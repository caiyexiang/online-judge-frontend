<template>
  <div>
    <div class="title-container">
      <div class="title">
        <span>提交记录</span>
      </div>
      <back-btn>返回</back-btn>
    </div>
    <div class="container">
      <submission-table :params="params" />
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import SubmissionTable from '@/components/SubmissionTable'
export default {
  name: 'CodeSubmission',
  components: {
    SubmissionTable,
    BackBtn,
  },
  data() {
    return {
      params: { user: this.$store.getters.userid },
    }
  },
}
</script>
