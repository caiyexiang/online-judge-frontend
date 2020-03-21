<template>
  <div>
    <h3 class="problem-title">
      <span v-if="problem.score !== undefined">
        <el-tag>得分: {{ problem.score }}</el-tag>
      </span>
      【{{ problem.maxScore }}分】
    </h3>
    <el-card shadow="never">
      <div slot="header">
        <p v-html="problem.description" />
      </div>
      <el-input v-model="answer" type="textarea" @input="updateAnswer" />
    </el-card>
    <el-card shadow="never" v-if="problem.comment" style="margin-top: 10px">
      <div slot="header">
        教师评语
      </div>
      <p>
        {{ problem.comment }}
      </p>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    problem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      answer: this.problem.answer,
      comment: this.problem.comment || '',
    }
  },
  methods: {
    updateAnswer() {
      this.$emit('updateAnswer', this.answer)
    },
  },
}
</script>
