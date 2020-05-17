<template>
  <div @click.capture="resultDrawerVisible = false">
    <el-card>
      <h3>
        <span v-if="problem.score !== undefined">
          <el-tag>得分: {{ problem.score }}</el-tag>
        </span>【{{ problem.maxScore }}分】{{ problem.index + 1 }}. {{ problem.title }}
      </h3>
      <div>
        <p class='title'>题目描述</p>
        <p
          class="describetion"
          v-html="problem.description"
        />

        <p class='title'>输入</p>
        <p
          class="describetion"
          v-html="problem.input"
        />
        <p class='title'>输出</p>
        <p
          class="describetion"
          v-html="problem.output"
        />
      </div>
      <el-row>
        <el-col :span='11'>
          <span class='title'>示例输入
            <a
              class="copy"
              v-clipboard:copy="problem.sample_input_json.join('')"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError"
            >
              <i class="el-icon-document-copy"></i>
              <span>{{"<-点我复制"}}</span>
            </a>
          </span>
          <div class="text-wrapper">
            <el-input
              type="textarea"
              spellcheck="false"
              :value="problem.sample_input_json | sampleFilter"
              :autosize='{minRows: 5, maxRows: 10}'
              style="font-family:'Consolas';background-color:none repeat scroll 0 0 #8DB8FF;"
              resize='none'
            >
            </el-input>
          </div>
        </el-col>
        <el-col
          :span='12'
          :offset="1"
        >
          <span class='title'>示例输出</span>
          <div class="text-wrapper">
            <el-input
              type="textarea"
              spellcheck="false"
              :value="problem.sample_output_json| sampleFilter"
              :autosize='{minRows: 5, maxRows: 10}'
              style="font-family:'Consolas';background-color:none repeat scroll 0 0 #8DB8FF;"
              resize='none'
            >
            </el-input>
          </div>
        </el-col>
      </el-row>
      <div v-if='problem.hint!==""'>
        <p class='title'>提示</p>
        <p
          class="describetion"
          v-html="problem.hint"
        />
      </div>
    </el-card>
    <el-card>
      <CodeMirror
        v-model="answer"
        :language.sync="language"
        @updateValue="updateAnswer"
      />
      <el-button
        @click="createCodeSubmission"
        :disabled="finished"
        type="primary"
        style="margin-top:20px"
        :loading="loading"
        size="medium"
      >提交代码</el-button>
      <el-button
        :type="msgType"
        plain
        v-show="msg"
      >
        {{ msg }}
      </el-button>
      <el-button
        type="primary"
        v-show="result"
        @click="openSubmission"
      >
        查看结果
      </el-button>
    </el-card>
  </div>
</template>

<script>
import openWindow from '@/utils/open-window'
import { mapGetters } from 'vuex'
import { getCodeSubmissions } from '@/api/contest'
import CodeMirror from '@/components/CodeMirror'
import { createCodeSubmission } from '@/api/contest'
export default {
  components: {
    CodeMirror,
  },
  props: {
    problem: {
      type: Object,
      default: () => Object.create(null),
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    sampleFilter(sample) {
      return sample ? sample.join('\n') : ''
    },
  },
  data() {
    return {
      language: this.problem.language || 'c',
      answer: this.problem.answer || '',
      contest: parseInt(this.$route.params.id),
      result: null,
      msg: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['username']),
    msgType() {
      if (this.msg === '正在运行...') {
        return 'info'
      } else if (this.msg === 'Accepted') {
        return 'success'
      } else {
        return 'danger'
      }
    },
  },
  methods: {
    updateAnswer() {
      this.$emit('updateAnswer', this.answer)
    },
    pollSubmission() {
      this.result = null
      this.msg = '正在运行...'
      this.loading = true
      let counter = 0
      const timer = setInterval(() => {
        counter++
        if (counter > 5) {
          clearInterval(timer)
          return
        }
        const params = {
          offset: 0,
          limit: 1,
          contest: this.contest,
          problem: this.problem.id,
          search: this.username,
        }
        getCodeSubmissions(params)
          .then(({ results }) => {
            const result = results[0]
            if (result.status !== 'waiting') {
              this.loading = false
              this.msg = result.status
              this.result = result
              this.dialogVisible = true
              clearInterval(timer)
            }
          })
          .catch(_ => {
            this.msg = '网络错误'
            this.loading = false
            clearInterval(timer)
          })
      }, 1000)
      this.$once('hook:beforeDestroy', () => {
        timer && clearInterval(timer)
      })
    },
    openSubmission() {
      openWindow(`/code-submission/${this.result.id}/`)
    },
    createCodeSubmission() {
      if (!this.answer.length) {
        this.$message.error('代码不能为空')
        return
      }
      const data = {
        code: this.answer,
        language: this.language,
        contest: this.contest,
        problem: this.problem.id,
      }
      createCodeSubmission(data).then(
        res => {
          this.$message.success('提交成功')
          this.pollSubmission()
        },
        err => {
          this.$message.error('提交失败')
          console.error(err)
        },
      )
    },
    onCopy(event) {
      this.$message({
        message: 'Code copied',
        type: 'success'
      });
    },
    onCopyError(e) {
      this.$message.error('Failed to copy code');
    }
  },
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
}
.title {
  font-size: 20px;
  font-weight: 400;
  margin: 25px 0 8px 0;
  color: #3091f2;
}
p.describetion {
  margin-left: 25px;
  margin-right: 20px;
  font-size: 15px;
}
</style>
