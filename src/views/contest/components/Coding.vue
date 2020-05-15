<template>
  <div @click.capture="resultDrawerVisible = false">
    <h3>
      <span v-if="problem.score !== undefined">
        <el-tag>得分: {{ problem.score }}</el-tag> </span
      >【{{ problem.maxScore }}分】{{ problem.index + 1 }}. {{ problem.title }}
    </h3>
    <el-card shadow="never">
      <div slot="header">
        <span>题目描述</span>
      </div>
      <div>
        <p v-html="problem.description" />
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>提示</span>
      </div>
      <div class="text-wrapper">
        <p v-html="problem.hint" />
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>输入</span>
      </div>
      <div class="text-wrapper">
        <p v-html="problem.input" />
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>输出</span>
      </div>
      <div class="text-wrapper">
        <p v-html="problem.output" />
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>示例输入</span>
      </div>
      <div class="text-wrapper">
        <pre>{{ problem.sample_input_json | sampleFilter }}</pre>
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header">
        <span>示例输出</span>
      </div>
      <div class="text-wrapper">
        <pre>{{ problem.sample_output_json | sampleFilter }}</pre>
      </div>
    </el-card>
    <CodeMirror v-model="answer" :language.sync="language" @updateValue="updateAnswer" />
    <el-button
      @click="createCodeSubmission"
      :disabled="finished"
      type="primary"
      style="margin-top:20px"
      :loading="loading"
      >提交代码</el-button
    >
    <el-button :type="msgType" plain v-show="msg">
      {{ msg }}
    </el-button>
    <el-button type="primary" v-show="result" @click="openSubmission">
      查看结果
    </el-button>
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
  },
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
}
</style>
