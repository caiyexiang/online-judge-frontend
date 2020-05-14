<template>
  <div>
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
    <CodeBtn @click="createCodeSubmission" :disabled="finished" />
  </div>
</template>

<script>
import CodeMirror from '@/components/CodeMirror'
import CodeBtn from './CodeBtn'
import { createCodeSubmission } from '@/api/contest'
export default {
  components: {
    CodeMirror,
    CodeBtn,
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
    }
  },
  methods: {
    updateAnswer() {
      this.$emit('updateAnswer', this.answer)
    },
    createCodeSubmission() {
      if (!this.answer.length) {
        this.$message.error('代码不能为空')
        return
      }
      const data = {
        code: this.answer,
        language: this.language,
        contest: this.$route.params.id,
        problem: this.problem.id,
      }
      createCodeSubmission(data).then(
        res => {
          this.answer = ''
          this.$message.success('提交成功')
          // fix20200304: 修复了提交答案后提交记录需要打开
          this.$parent.$data.dialogVisible.status = true
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
