<template>
  <div>
    <h3>
      <span v-if="problem.score !== undefined">
        <el-tag>得分: {{ problem.score }}</el-tag> </span
      >【{{ problem.maxScore }}分】 {{ problem.title }}
    </h3>
    <el-card shadow="never">
      <div slot="header">
        <span>题目描述</span>
      </div>
      <div>
        <p v-html="problem.description" />
      </div>
    </el-card>
    <el-card v-if="problem.hint" shadow="never">
      <div slot="header">
        <span>提示</span>
      </div>
      <div class="text-wrapper">
        <p v-html="problem.hint" />
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
    <CodeMirror v-model="problem.answer" :language.sync="language" />
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
      default: () => {
        return {}
      },
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  filters: {
    sampleFilter(sample) {
      return sample && sample.join('')
    },
  },
  data() {
    return {
      language: this.problem.language || 'c',
    }
  },
  methods: {
    createCodeSubmission() {
      if (!this.problem.answer.length) {
        this.$message.error('代码不能为空')
        return
      }
      const data = {
        code: this.problem.answer,
        language: this.language,
        contest: this.$route.params.id,
        problem: this.problem.id,
      }
      createCodeSubmission(data).then(
        res => {
          this.problem.answer = ''
          this.$message.success('提交成功')
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
