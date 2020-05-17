<template>
  <div>
    <el-card>
      <h3 class="problem-title">
        <span v-if="problem.score !== undefined">
          <el-tag>得分: {{ problem.score }}</el-tag>
        </span>
        【{{ problem.maxScore }}分】{{ problem.index + 1 }}.
      </h3>
      <div>
        <p class='title'>题目描述</p>
        <p
          class="describetion"
          v-html="problem.description"
        />
      </div>
      <el-input
        v-model="answer"
        type="textarea"
        @input="updateAnswer"
      />
      <el-card
        shadow="never"
        v-if="problem.comment"
        style="margin-top: 10px"
      >
        <div slot="header">
          教师评语
        </div>
        <p>
          {{ problem.comment }}
        </p>
      </el-card>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    problem: {
      type: Object,
      default: () => Object.create(null),
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

<style lang="scss" scoped>
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
