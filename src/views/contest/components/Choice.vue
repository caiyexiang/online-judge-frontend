<template>
  <div>
    <el-card>
      <div class="problem-title">
        <span v-if="problem.score !== undefined">
          <el-tag>得分：{{ problem.score }}</el-tag>
        </span>
        【{{ problem.maxScore }}分】{{ problem.index + 1 }}. {{ problem.description }}
      </div>
      <div>
        <el-checkbox-group
          v-if="problem.multiple"
          v-model="answer"
          @change="updateAnswer"
        >
          <el-checkbox
            v-for="(value, index) in choice"
            :key="index"
            :label="index"
            class="choice-option"
          >
            {{ String.fromCharCode(65 + index) }}. {{ value }}
          </el-checkbox>
        </el-checkbox-group>
        <el-radio-group
          v-else
          v-model="answer[0]"
          @change="updateAnswer"
        >
          <el-radio
            v-for="(value, index) in choice"
            :key="index"
            :label="index"
            class="choice-option"
          >
            {{ String.fromCharCode(65 + index) }}. {{ value }}
          </el-radio>
        </el-radio-group>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Choice',
  props: {
    problem: {
      type: Object,
      default: () => Object.create(null),
    },
  },
  data() {
    return {
      answer: [...this.problem.answer],
    }
  },
  computed: {
    choice() {
      return JSON.parse(this.problem.choice)
    },
  },
  methods: {
    updateAnswer() {
      this.$emit('updateAnswer', this.answer)
    },
  },
}
</script>

<style lang="scss" scoped>
.choice-option {
  display: block;
  margin: 10px 0;
}
</style>
