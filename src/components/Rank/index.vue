<template>
  <div>
    <div class="refresh-btn-container">
      <el-button class="refresh-button" icon="el-icon-refresh-right" :disabled="disabled" circle @click="getTable" />
    </div>
    <div v-if="user_rank" style="margin-bottom: 10px">
      <el-table
        :data="user_rank"
        :cell-style="cellStyle"
        :row-class-name="tableRowClassName"
        style="width: 100%;"
        border
        size="small"
        :key="1"
      >
        <el-table-column align="center" label="你的排名" prop="rank" width="80" />
        <el-table-column align="center" label="用户名" prop="user.username" width="120" />
        <el-table-column align="center" label="总分数" prop="score" width="80" />
        <el-table-column align="center" label="总用时" prop="penalty" width="100">
          <template slot-scope="{ row }">
            <div>
              {{ row.penalty | parseSeconds }}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" v-for="index in problemSize" :key="index" :label="index.toString()">
          <template slot-scope="{ row }">
            <div>
              {{ row.rank_scores[index - 1] | parseRankScore }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-table
      v-loading="loading"
      :data="table"
      style="width: 100%;"
      border
      :key="2"
      highlight-current-row
      v-if="problemSize"
      :cell-style="cellStyle"
      size="small"
    >
      <el-table-column align="center" label="排名" type="index" width="80" />
      <el-table-column align="center" label="用户名" prop="user.username" width="120" />
      <el-table-column align="center" label="总分数" prop="score" width="80" />
      <el-table-column align="center" label="总用时" prop="penalty" width="100">
        <template slot-scope="{ row }">
          <div>
            {{ row.penalty | parseSeconds }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" v-for="index in problemSize" :key="index" :label="index.toString()">
        <template slot-scope="{ row }">
          <div>
            {{ row.rank_scores[index - 1] | parseRankScore }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="no-data" v-else><p>排行榜暂时没有数据</p></div>
    <el-pagination
      style="margin-top:10px;text-align:center"
      v-if="total > 0"
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script>
function parseRankScore({ time_usage, error }) {
  let text = ''
  if (time_usage > 0) {
    text += parseSeconds(time_usage)
  }
  if (error > 0) {
    text += `(-${error})`
  }
  return text
}

import { getRank } from '@/api/contest'
import { parseSeconds } from '@/utils'
export default {
  filters: {
    parseSeconds,
    parseRankScore,
  },
  data() {
    return {
      id: this.$route.params.id,
      table: [],
      user_rank: undefined,
      total: 0,
      pageQuery: {
        offset: 0,
        limit: 10,
      },
      loading: false,
    }
  },
  created() {
    this.getTable()
  },
  computed: {
    page: {
      get() {
        return Math.floor(this.pageQuery.offset / this.pageQuery.limit) + 1
      },
      set(val) {
        this.pageQuery.offset = (val - 1) * this.pageQuery.limit
      },
    },
    problemSize() {
      if (this.table.length) {
        return this.table[0].rank_scores.length
      }
      return 0
    },
  },
  methods: {
    handlePageChange(page) {
      this.page = page
      this.getTable()
    },
    getTable() {
      this.loading = true
      getRank(this.id, this.pageQuery).then(res => {
        this.total = res.count
        this.table = res.results.rank
        this.loading = false
        this.user_rank = [res.result.user_rank]
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex >= 4 && this.table[rowIndex].rank_scores[columnIndex - 4].accepted === true) {
        return 'background:#67C23A;color:white;'
      } else if (columnIndex >= 4 && this.table[rowIndex].rank_scores[columnIndex - 4].error > 0) {
        return 'background:#F56C6C;color:white;'
      } else {
        return ''
      }
    },
    tableRowClassName({ row, rowIndex }) {
      return 'success-row'
    },
  },
}
</script>

<style lang="scss" scoped>
.no-data {
  width: 100%;
  height: 200px;
  position: relative;
  & p {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
  }
}
</style>

<style>
.refresh-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}
.success-row {
  background-color: #f0f9eb !important;
}
</style>
