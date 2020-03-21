<template>
  <el-tabs v-model="tab">
    <el-tab-pane label="提交记录" name="submission">
      <SubmissionTable :params="params" :query="query" />
    </el-tab-pane>
    <el-tab-pane label="编程题排行榜" name="rank">
      <Rank @go-submission="handleGoSubmission" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SubmissionTable from '@/components/SubmissionTable'
import Rank from '@/components/Rank'
export default {
  name: 'ContestStatus',
  components: {
    SubmissionTable,
    Rank,
  },
  data() {
    return {
      params: { contest: this.$route.params.id },
      tab: 'submission',
      query: { search: this.$store.getters.username },
    }
  },
  methods: {
    handleGoSubmission(username) {
      this.tab = 'submission'
      this.query = { search: username, status: 'Accepted' }
    },
  },
}
</script>
