<template>
  <div>
    <div class="sticky-header filter-container" v-if="this.$route.name === 'ContestDetail'">
      <el-select class="filter-item" v-model="type" @change="getSubmissions" style="width:400px;">
        <el-option value="编程题">编程题</el-option>
        <el-option value="代码补全题">代码补全题</el-option>
      </el-select>
      <el-select class="filter-item" v-model="filterQuery.status" style="width:500px;">
        <el-option value="" label="全部提交" />
        <el-option value="Accepted" label="仅限通过的提交" />
      </el-select>
      <el-input class="filter-item" v-model="filterQuery.problem" placeholder="问题ID" />
      <el-input class="filter-item" v-model="filterQuery.search" placeholder="用户名" />
      <el-button
        class="refresh-button filter-item"
        icon="el-icon-refresh-right"
        :disabled="disabled"
        circle
        @click="getSubmissions"
      />
    </div>
    <div class="title-container sticky-header" v-else>
      <el-radio-group v-model="type" @change="getSubmissions">
        <el-radio-button label="编程题" />
        <el-radio-button label="代码补全题" />
      </el-radio-group>
      <el-button
        class="refresh-button"
        icon="el-icon-refresh-right"
        :disabled="disabled"
        circle
        @click="getSubmissions"
      />
    </div>
    <div class="container">
      <el-table :data="list" highlight-current-row stripe v-loading="loading">
        <el-table-column prop="time" label="时间">
          <template slot-scope="{ row: { time } }">
            {{ time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="problem" label="问题" />
        <el-table-column prop="user.username" label="用户" />
        <el-table-column label="语言" prop="language" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="{ row: { status } }">
            <span :style="status | statusClassFilter">{{ status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="耗时" prop="time_usage" />
        <el-table-column label="内存" prop="memory_usage" />
        <el-table-column>
          <template slot-scope="{ row: { id } }">
            <el-button type="primary" @click="handleDetail(id)">
              详情
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
import { parseTime } from '@/utils'
import openWindow from '@/utils/open-window'
import { getCodeSubmissions, getCodeFillSubmissions } from '@/api/contest'
export default {
  name: 'SubmissionTable',
  props: {
    params: {
      type: Object,
      default: null,
    },
    query: {
      type: Object,
      default: null,
    },
  },
  filters: {
    parseTime,
    statusClassFilter(status) {
      return status === 'Accepted' ? 'color:green' : 'color:red'
    },
  },
  data() {
    return {
      type: '编程题',
      disabled: false,
      list: [],
      offset: 0,
      limit: 10,
      total: 0,
      loading: false,
      filterQuery: {
        problem: '',
        status: '',
        search: '',
      },
      fetchApi: {
        编程题: getCodeSubmissions,
        代码补全题: getCodeFillSubmissions,
      },
      detailName: {
        编程题: 'code-submission',
        代码补全题: 'code-fill-submission',
      },
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
  watch: {
    filterQuery: {
      handler() {
        this.getSubmissions()
      },
      deep: true,
    },
    query: {
      handler() {
        this.filterQuery = { ...this.filterQuery, ...this.query }
      },
      immediate: true,
    },
  },
  methods: {
    getSubmissions() {
      this.startTimer()
      const params = {
        offset: this.offset,
        limit: this.limit,
        ...this.params,
        ...this.filterQuery,
      }
      this.loading = true
      this.fetchApi[this.type](params).then(({ count, results }) => {
        this.total = count
        this.list = results
        this.loading = false
      })
    },
    handleDetail(id) {
      openWindow(`/${this.detailName[this.type]}/${id}/`)
    },
    handlePageChange(page) {
      this.page = page
      this.getSubmissions()
    },
    startTimer() {
      this.disabled = true
      this.timer = window.setTimeout(() => {
        this.disabled = false
      }, 750)
    },
  },
}
</script>

<style lang="scss" scoped>
.sticky-header {
  position: sticky;
  top: 0px;
  z-index: 20;
  padding-bottom: 10px;
  box-shadow: 0 15px 10px -15px gray;
  justify-content: space-between;
  display: flex;
  background: white;
  display: flex;
  align-items: center;
}
.title-container {
  justify-content: space-between;
}
</style>
