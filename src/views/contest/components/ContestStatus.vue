<template>
  <el-tabs>
    <el-tab-pane label="提交记录">
      <SubmissionTable :params="{ contest: this.$route.params.id }" />
    </el-tab-pane>
    <el-tab-pane label="编程题排行榜">
      <Rank />
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
}
</script>
