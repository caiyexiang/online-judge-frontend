<template>
  <div class="container" v-loading="loading">
    <header>
      <div>
        <el-button class="header-item big-font" type="text" icon="el-icon-back" @click="handleBack" />
        <span class="header-item big-font"> {{ contest.title }} </span>
        <span class="header-item"> {{ displayTime }} </span>
        <span class="header-item" v-if="finished">
          <el-tag type="danger" style="margin-right:10px;">
            已结束
          </el-tag>
          <el-tag :type="judged ? `success` : `warning`">
            {{ judged ? `总分: ${total_score} 分` : '评分中' }}
          </el-tag>
        </span>
        <el-button type="text" class="header-item" @click="openDialog('status')">
          测验状态
        </el-button>
        <el-button type="text" class="header-item" @click="openDialog('announcement')">
          测验公告
        </el-button>
      </div>
      <div>
        <el-button type="primary" size="small" :disabled="disablePrev" @click="switchPrev">
          <i class="el-icon-arrow-left" />
        </el-button>
        <el-button type="primary" size="small" :disabled="disableNext" @click="switchNext">
          <i class="el-icon-arrow-right" />
        </el-button>
      </div>
    </header>
    <main>
      <div id="left">
        <el-button style="width:100%" v-if="hasNonCoding" type="success" :disabled="finished" @click="submitSubmission">
          {{ submissionId ? '提交非编程题(已提交过)' : '提交非编程题' }}
        </el-button>
        <div v-for="type of types" :key="type">
          <div v-if="problems[type] && problems[type].length">
            <p>{{ PROBLEM_TYPE_CN[type] }}</p>
            <el-row>
              <el-button
                v-for="(problem, index) of problems[type]"
                :key="`${type}-${problem.id}`"
                type="primary"
                class="switch-btn"
                :plain="!plainState(type, index)"
                @click="switchProblem(type, index)"
              >
                {{ index + 1 }}
              </el-button>
            </el-row>
          </div>
        </div>
      </div>
      <div id="right">
        <components
          :is="type2component[currentType]"
          :problem="problems[currentType][currentIndex]"
          :finished="finished"
          @updateAnswer="updateAnswer"
          :key="`${currentType}-${currentIndex}`"
        />
      </div>
    </main>
    <el-dialog title="公告" :visible.sync="dialogVisible.announcement" width="80%">
      <div>
        {{ contest.description }}
      </div>
    </el-dialog>
    <div v-if="dialogVisible.status">
      <el-dialog title="测验状态" :visible.sync="dialogVisible.status" width="80%">
        <ContestStatus />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import ContestStatus from './components/ContestStatus'
import Coding from './components/Coding'
import Choice from './components/Choice'
import FillIn from './components/FillIn'
import CodeFill from './components/CodeFill'
import Qa from './components/QA'
import { PROBLEM_ENUM, PROBLEM_TYPE_CN } from '@/utils/constant.js'
import { getDefaultProblem, parseTime, parseSeconds } from '@/utils'
import {
  getContest,
  checkContestSubmission,
  getContestSubmission,
  getCodeFillSubmission,
  getCodeSubmission,
  getQASubmission,
  createContestSubmission,
  updateContestSubmission,
} from '@/api/contest'
const { CODING, CHOICE, FILLIN, CODEFILL, QA } = PROBLEM_ENUM
const type2component = {
  [CODING]: 'Coding',
  [CODEFILL]: 'CodeFill',
  [QA]: 'Qa',
  [CHOICE]: 'Choice',
  [FILLIN]: 'FillIn',
}
const getSubmission = {
  [CODING]: getCodeSubmission,
  [CODEFILL]: getCodeFillSubmission,
}
export default {
  name: 'ContestDetail',
  components: {
    ContestStatus,
    Coding,
    Choice,
    FillIn,
    CodeFill,
    Qa,
  },
  data() {
    return {
      id: parseInt(this.$route.params.id),
      submissionId: 0,
      timer: null,
      loading: false,
      finished: false,
      judged: false,
      displayTime: '00:00:00',
      total_score: 0,
      dialogVisible: {
        status: false,
        announcement: false,
      },
      problems: getDefaultProblem(),
      currentType: CODING,
      currentIndex: 0,
      contest: {
        title: '',
        now_time: '',
        end_time: '',
        description: '',
      },
      submission: [],
      score: [],
      // 决定题目顺序，这里是选择/填空/问答/代码补全/代码
      // 1 2 3 4 0
      types: [CHOICE, FILLIN, QA, CODEFILL, CODING],
      PROBLEM_TYPE_CN,
      type2component,
    }
  },
  async created() {
    this.$message('编程题分数会以最后一次的代码提交为准')
    try {
      this.loading = true
      await this.checkContestSubmission()
      await this.getContest()
      this.loading = false
      this.currentIndex = 0
      // 选取非空的题目数组类型当currentType
      for (const type of this.types) {
        if (this.problems[type].length > 0) {
          this.currentType = type
          break
        }
      }
    } catch (e) {
      this.loading = false
      this.$message.error('获取数据错误')
      console.error(e)
    }
    this.startTimer()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  computed: {
    currentProblem() {
      return this.problems[this.currentType][this.currentIndex]
    },
    currentComponent() {
      return type2component[this.currentType]
    },
    hasNonCoding() {
      return this.problems[CHOICE].length || this.problems[FILLIN].length || this.problems[QA].length
    },
    disablePrev() {
      return this.currentIndex === 0
    },
    disableNext() {
      return this.currentIndex === this.problems[this.currentType].length - 1
    },
    submissionApi() {
      return this.submissionId ? updateContestSubmission(this.submissionId) : createContestSubmission
    },
  },
  methods: {
    async checkContestSubmission() {
      const { count, results } = await checkContestSubmission(this.id)
      if (!count) return
      this.submissionId = results[0].id
      const res = await getContestSubmission(this.submissionId)
      this.submission[CHOICE] = JSON.parse(res.choice_submission)
      this.submission[FILLIN] = JSON.parse(res.fill_in_submission)
      this.judged = res.judged
      this.total_score = res.total_score
      this.score[QA] = JSON.parse(res.qa_score)
      if (!this.judged) return
      this.score[CHOICE] = JSON.parse(res.choice_score)
      this.score[FILLIN] = JSON.parse(res.fill_in_score)
      this.score[CODING] = JSON.parse(res.coding_score)
      this.score[CODEFILL] = JSON.parse(res.code_fill_score)
    },
    async getContest() {
      const res = await getContest(this.id)
      this.contest = res
      this.problems = res.problem_json
      this.maxScore = res.problem_score_json
      for (const type of this.types) {
        for (let index = 0; index < this.problems[type].length; index++) {
          const problem = this.problems[type][index]
          // 如果问题被删除, 从数组中移除这个问题，并且index自减
          if (problem.deleted) {
            this.problems[type].splice(index, 1)
            problem = null
            index--
            continue
          }
          problem.index = index
          problem.maxScore = this.maxScore[type][problem.id]
          if (type === CHOICE || type === FILLIN) {
            problem.answer = []
            if (this.submissionId) {
              problem.answer = this.submission[type][problem.id]
              if (this.judged) {
                problem.score = this.score[type][problem.id]
              }
            }
          } else if (type === QA) {
            problem.answer = ''
            problem.change = false
            if (this.submissionId) {
              const scoreObj = this.score[QA][problem.id]
              const submissionId = Object.keys(scoreObj)[0]
              const score = scoreObj[submissionId]
              if (submissionId !== '-1') {
                const { answer, comment } = await getQASubmission(submissionId)
                problem.answer = answer
                problem.comment = comment
              }
              if (this.judged) {
                problem.score = score
              }
            }
          } else if (type === CODING || type === CODEFILL) {
            problem.answer = ''
            if (this.submissionId && this.judged) {
              const scoreObj = this.score[type][problem.id]
              const submissionId = Object.keys(scoreObj)[0]
              problem.score = scoreObj[submissionId]
              if (submissionId !== '-1') {
                const { code } = await getSubmission[type](submissionId)
                problem.answer = code
              }
            }
          }
        }
      }
    },
    plainState(type, index) {
      return this.currentType === type && this.currentIndex === index
    },
    switchProblem(type, index) {
      this.currentType = type
      this.currentIndex = index
    },
    switchPrev() {
      this.currentIndex--
    },
    switchNext() {
      this.currentIndex++
    },
    handleBack() {
      this.$confirm('确定退出本次测验？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(_ => {})
    },
    async submitSubmission() {
      try {
        await this.$confirm('确定提交非编程题?提交后在测试结束前仍可再次提交。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
      } catch (_) {}
      const submission = {
        contest: this.id,
        choice_submission: {},
        fill_in_submission: {},
        qa_submission_list: [],
      }
      for (const type of [CHOICE, FILLIN, QA]) {
        for (const problem of this.problems[type]) {
          if (type === CHOICE) {
            submission.choice_submission[problem.id] = problem.answer
          } else if (type === FILLIN) {
            submission.fill_in_submission[problem.id] = problem.answer
          } else if (type === QA) {
            const item = { qa_problem_id: problem.id, change: problem.change }
            if (problem.change) {
              item.answer = problem.answer
            }
            submission.qa_submission_list.push(item)
          }
        }
      }
      submission.choice_submission = JSON.stringify(submission.choice_submission)
      submission.fill_in_submission = JSON.stringify(submission.fill_in_submission)
      try {
        const { id } = await this.submissionApi(submission)
        this.$message.success('提交成功')
        this.submissionId = id
      } catch (err) {
        this.$message.error('提交失败')
        console.error(err)
      }
    },
    openDialog(name) {
      this.dialogVisible[name] = true
    },
    updateAnswer(answer) {
      this.problems[this.currentType][this.currentIndex].answer = answer
      if (this.currentType === 3) {
        this.problems[this.currentType][this.currentIndex].change = true
      }
    },
    startTimer() {
      const dn = new Date(this.contest.now_time)
      const de = new Date(this.contest.end_time)
      // fix20200304: date的时间差应该除以1000转化为秒
      let dur = Math.floor((de - dn) / 1000)
      if (dur < 0) {
        this.finished = true
        this.displayTime = `结束时间:${parseTime(de)}`
      } else {
        this.timer = window.setInterval(() => {
          dur--
          this.displayTime = `倒计时:${parseSeconds(dur)}`
          if (dur <= 0) {
            window.clearInterval(this.timer)
            this.$message.warning('时间结束')
            // TODO: 使用push跳转
            this.$router.go(-1)
          }
        }, 1000)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  & header {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    padding: 15px;
    overflow: hidden;
    box-shadow: 0 10px 10px -15px gray;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-item {
      margin-right: 10px;
    }
  }
  main {
    box-sizing: border-box;
    display: flex;
    #left {
      background-color: rgb(239, 239, 239);
      box-sizing: border-box;
      height: calc(100vh - 60px);
      width: 20%;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
    }
    #right {
      box-sizing: border-box;
      height: calc(100vh - 60px);
      width: 80%;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 20px;
    }
  }
}

.big-font {
  font-size: 1.3em;
}

.switch-btn {
  width: 50px;
  margin-right: 5px;
  margin-left: 0;
  margin-bottom: 5px;
}
</style>
