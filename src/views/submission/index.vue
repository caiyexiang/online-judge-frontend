<template>
  <div class="app-container">
    <header>
      <div class="title">提交记录</div>
      <p>
        <strong>
          提交人：{{ result.user.username }} | 问题ID：{{ result.problem }} | 测验ID：{{ result.contest }}
        </strong>
      </p>
      <el-card shadow="never">
        <div class="info-card">
          <div>
            <div>使用内存：{{ result.memory_usage }}</div>
            <div>执行用时：{{ result.time_usage }}ms</div>
          </div>
          <div>
            <div>
              状态：<span :style="result.status | statusClassFilter">{{ result.status }}</span>
            </div>
            <div>提交日期：{{ result.time | parseTime }}</div>
          </div>
        </div>
      </el-card>
    </header>
    <main>
      <p>代码运行输出：</p>
      <el-card shadow="never">
        <pre>{{ result.output }}</pre>
      </el-card>
      <p>代码：</p>
      <CodeMirror
        :value="result.code"
        :language="result.language"
        :read-only="true"
        :auto-focus="false"
        :disable-language="true"
      />
    </main>
  </div>
</template>

<script>
import CodeMirror from '@/components/CodeMirror'
import { parseTime } from '@/utils'
import { getCodeSubmission, getCodeFillSubmission } from '@/api/contest'
export default {
  name: 'Submission',
  filters: {
    parseTime,
    statusClassFilter(status) {
      return status === 'Accepted' ? 'color:green' : 'color:red'
    },
  },
  components: { CodeMirror },
  data() {
    return {
      result: {
        user: { username: '', id: '' },
      },
    }
  },
  created() {
    this.getSubmission()
  },
  computed: {
    fetchApi() {
      return this.$route.name === 'CodeSubmission' ? getCodeSubmission : getCodeFillSubmission
    },
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    getSubmission() {
      this.fetchApi(this.id).then(res => {
        this.result = res
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  font-size: 14px;
  color: rgb(83, 83, 83) !important;
  header {
    .info-card {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      & > :last-child {
        text-align: end;
      }
      & > div {
        width: 300px;
        line-height: 20px;
      }
    }
  }
}
</style>
