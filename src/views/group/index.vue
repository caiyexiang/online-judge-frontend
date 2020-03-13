<template>
  <div>
    <div class="title-container">
      <div class="title">
        我的班级
      </div>
    </div>
    <div class="container" v-loading="loading">
      <el-row :gutter="20">
        <el-col :md="12" :lg="6" v-for="item of list" :key="item.id" style="margin-bottom:10px">
          <el-card>
            <h3>{{ item.name }}</h3>
            <p>{{ item.teacher | teacherFilter }}</p>
            <p>{{ item.permission | permissionFilter }}</p>
            <div>
              <router-link :to="contestListLink(item.id)">
                <el-button>进入班级</el-button>
              </router-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getGroups } from '@/api/group'
import { PERMISSION_TYPE } from '@/utils/constant'
export default {
  name: 'Group',
  data() {
    return {
      list: [],
      loading: false,
    }
  },
  filters: {
    teacherFilter(teacher) {
      return teacher.reduce((prev, curr) => {
        return prev + ' ' + (curr.name || '未命名教师')
      }, '')
    },
    permissionFilter(permission) {
      return PERMISSION_TYPE[permission]
    },
  },
  created() {
    //TODO 下拉加载
    this.getGroups()
  },
  methods: {
    getGroups() {
      this.loading = true
      getGroups().then(({ results }) => {
        this.loading = false
        this.list = results
      })
    },
    contestListLink(id) {
      return { name: 'ContestList', params: { group: id } }
    },
  },
}
</script>
