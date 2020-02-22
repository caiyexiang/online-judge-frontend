<template>
  <div>
    <div class="title-container">
      <div class="title">
        <span>测验结果</span>
      </div>
      <back-btn>返回</back-btn>
    </div>
    <div class="container">
      <el-table :data="list" highlight-current-row stripe v-loading="loading">
        <el-table-column prop="contest.id" label="测验id" width="80" />
        <el-table-column prop="contest.title" label="测验名称" />
        <el-table-column prop="contest.course.name" label="课程" />
        <el-table-column prop="judged" label="状态" width="100">
          <template slot-scope="{ row: { judged } }">
            {{ judged | judgedFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="total_score" label="分数" width="120">
          <template slot-scope="{ row: { total_score } }">
            <span class="black-text">{{ total_score }}</span>
            <span>/100</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="100">
          <template
            slot-scope="{
              row: {
                contest: { id },
              },
            }"
          >
            <el-button type="primary" size="small" @click="handleDetail(id)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="total > 0"
        class="pagination"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { getContestSubmissions } from '@/api/contest'
import BackBtn from '@/components/BackBtn'
export default {
  name: 'ContestSubmission',
  components: { BackBtn },
  filters: {
    judgedFilter(judged) {
      return judged ? '未评分' : '已评分'
    },
  },
  data() {
    return {
      list: [],
      offset: 0,
      limit: 10,
      total: 0,
      loading: false,
    }
  },
  computed: {
    page: {
      set(page) {
        this.offset = (page - 1) * this.limit
      },
      get() {
        return Math.floor(this.offset / this.limit) + 1
      },
    },
  },
  created() {
    this.getContestSubmissions()
  },
  methods: {
    getContestSubmissions() {
      const params = {
        offset: this.offset,
        limit: this.limit,
      }
      this.loading = true
      getContestSubmissions(params).then(({ count, results }) => {
        this.total = count
        this.list = results
        this.loading = false
      })
    },
    handleDetail(id) {
      this.$router.push({ name: 'ContestDetail', params: { id } })
    },
    handlePageChange(page) {
      this.page = page
      this.getContestSubmissions()
    },
  },
}
</script>

<style lang="scss" scoped>
.black-text {
  font-weight: 800;
  font-size: 1.5rem;
  color: #000;
}
</style>
