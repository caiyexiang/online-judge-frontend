<script>
import CodeMirror from '@/components/CodeMirror'
import { createCodeFillSubmission } from '@/api/contest'
import { fillRegEx } from '@/utils/constant'
export default {
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
    }
  },
  components: {
    CodeMirror,
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
        })
        .catch(e => {
          this.$message.error('提交失败')
          console.error(e)
        })
    },
    updateAnswer() {
      this.$emit('updateAnswer', this.answer)
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
          type="primary"
          vOn:click_native={this.createCodeFillSubmission}
        >
          提交代码
        </el-button>
      </div>
    )
  },
}
</script>
