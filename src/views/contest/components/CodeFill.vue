<script>
import openWindow from '@/utils/open-window'
import { mapGetters } from 'vuex'
import { getCodeFillSubmissions } from '@/api/contest'
import CodeMirror from '@/components/CodeMirror'
import { createCodeFillSubmission } from '@/api/contest'
import { fillRegEx } from '@/utils/constant'
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
  data() {
    return {
      answer: [...this.problem.answer],
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
    createCodeFillSubmission() {
      if (this.answer.length === 0) {
        this.$message.error('代码为空')
        return
      }
      const data = {
        code: JSON.stringify(this.answer),
        language: this.problem.language,
        contest: this.contest,
        problem: this.problem.id,
      }
      createCodeFillSubmission(data)
        .then(_ => {
          this.$message.success('提交成功')
          this.pollSubmission()
        })
        .catch(e => {
          this.$message.error('提交失败')
          console.error(e)
        })
    },
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
        getCodeFillSubmissions(params)
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
      openWindow(`/code-fill-submission/${this.result.id}/`)
    },
  },
  render() {
    const codeTemplateList = this.problem.code_template.split(fillRegEx)
    const codeElement = []
    const scoreElement =
      this.problem.score !== undefined ? (
        <span>
          <el-tag>得分: {this.problem.score}</el-tag>
        </span>
      ) : (
        undefined
      )
    const resultButton = this.result ? (
      <el-button type="primary" vOn:click={this.openSubmission}>
        查看结果
      </el-button>
    ) : (
      undefined
    )
    const statusButton = this.msg ? (
      <el-button type={this.msgType} plain>
        {this.msg}
      </el-button>
    ) : (
      undefined
    )
    for (let i = 0; i < codeTemplateList.length; i++) {
      codeElement.push(
        <CodeMirror
          value={codeTemplateList[i]}
          language={this.problem.language}
          read-only={true}
          auto-focus={false}
          show-language={false}
          theme="solarized"
        />,
      )
      if (i !== codeTemplateList.length - 1) {
        codeElement.push(
          <CodeMirror
            vModel={this.answer[i]}
            language={this.problem.language}
            show-language={false}
            vOn:updateValue={this.updateAnswer}
          />,
        )
      }
    }
    return (
      <div>
      <el-card>
        <h3>
          {scoreElement}【{this.problem.maxScore}分】{this.problem.index + 1}. {this.problem.title}
        </h3>
        <el-card shadow="never">
          <div slot="header">
            <span>题目描述</span>
          </div>
          <div>
            <p domPropsInnerHTML={this.problem.description} />
          </div>
        </el-card>
        {codeElement}
        <el-button
          style="margin-top:20px"
          disabled={this.finished}
          loading={this.loading}
          type="primary"
          vOn:click={this.createCodeFillSubmission}
        >
          提交代码
        </el-button>
        {statusButton}
        {resultButton}
        </el-card>
      </div>
    )
  },
}
</script>
