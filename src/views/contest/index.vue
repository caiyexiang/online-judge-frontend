<template>
  <div>
    <div class="title-container">
      <h3 class="title">
        <span>{{ group.name }}</span>
        <el-tag id="tag">
          {{ PERMISSION_TYPE[group.permission] }}
        </el-tag>
      </h3>
      <p>{{ group.teacher | teacherFilter }}</p>
      <BackBtn>返回</BackBtn>
    </div>
    <div class="container">
      <el-table
        :data="list"
        highlight-current-row
        stripe
        @current-change="handleTableChange"
        v-loading="loading"
        :cell-style="{ cursor: 'pointer' }"
      >
        <el-table-column prop="id" label="测验id" width="100" />
        <el-table-column prop="title" label="测验名称" align="center" />
        <el-table-column prop="begin_time" label="起始时间" width="240">
          <template slot-scope="{ row: { begin_time } }">
            {{ begin_time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" width="240">
          <template slot-scope="{ row: { end_time } }">
            {{ end_time | parseTime }}
          </template>
        </el-table-column>
        <el-table-column prop="is_exam" label="类型" width="80">
          <template slot-scope="{ row: { is_exam } }">
            {{ is_exam | examFilter }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="80">
          <template slot-scope="{ row: { state } }">
            <el-tag :type="tagTypeMap[state]">
              {{ CONTEST_STATE[state] }}
            </el-tag>
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
import BackBtn from '@/components/BackBtn'
import { getGroup } from '@/api/group'
import { getContests } from '@/api/contest'
import { parseTime, compareTime } from '@/utils'
import { PERMISSION_TYPE, CONTEST_STATE } from '@/utils/constant.js'
export default {
  name: 'Contest',
  components: {
    BackBtn,
  },
  filters: {
    teacherFilter(teacher) {
      return teacher.reduce((prev, curr) => {
        return prev + ' ' + (curr.name || '未命名教师')
      }, '')
    },
    examFilter(is_exam) {
      return is_exam ? '考试' : '测验'
    },
    parseTime,
  },
  data() {
    return {
      group: {
        permission: 3,
        name: '',
        teacher: [],
      },
      list: [],
      offset: 0,
      limit: 10,
      total: 0,
      loading: false,
      tagTypeMap: {
        0: 'info',
        1: 'success',
        2: 'danger',
      },
      CONTEST_STATE,
      PERMISSION_TYPE,
    }
  },
  computed: {
    groupId() {
      return this.$route.params.group
    },
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
    this.getGroup()
    this.getContests()
  },
  methods: {
    getGroup() {
      getGroup(this.groupId).then(res => {
        this.group = res
      })
    },
    getContests() {
      const params = {
        offset: this.offset,
        limit: this.limit,
        group: this.groupId,
      }
      this.loading = true
      getContests(params).then(({ results, count }) => {
        results.forEach(item => {
          item.state = compareTime(item.now_time, item.begin_time) + compareTime(item.now_time, item.end_time)
        })
        this.list = results
        this.total = count
        this.loading = false
      })
    },
    handlePageChange(page) {
      this.page = page
      this.getContests()
    },
    handleTableChange({ id, state }) {
      if (state === 0) {
        this.$message.warning('测验还没开始呢！')
      } else {
        this.$router.push({ name: 'ContestDetail', params: { id } })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  #tag {
    margin-left: 10px;
  }
}
</style>
