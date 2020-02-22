<template>
  <div class="navbar">
    <div id="logo-container">
      <img src="@/assets/images/logo-small.png" @click="$router.push('/')" class="pointer" />
    </div>
    <div class="right-menu">
      <el-button type="text" @click="dialogVisible = true"> 公告 </el-button>
      <el-dropdown trigger="click" class="dropdown">
        <el-button type="primary">
          <i class="el-icon-user" />
          {{ username }}
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link :to="{ name: 'UserHome', params: { id: userid } }">
            <el-dropdown-item>
              个人主页
            </el-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'UserCodeSubmission', params: { id: userid } }">
            <el-dropdown-item>
              提交记录
            </el-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'UserContestSubmission', params: { id: userid } }">
            <el-dropdown-item>
              测验结果
            </el-dropdown-item>
          </router-link>
          <router-link :to="{ name: 'UserSettings', params: { id: userid } }">
            <el-dropdown-item>
              设置
            </el-dropdown-item>
          </router-link>
          <div v-if="permission < 3" @click="openAdmin">
            <el-dropdown-item divided>
              管理端
            </el-dropdown-item>
          </div>
          <div @click="logout">
            <el-dropdown-item divided>
              注销
            </el-dropdown-item>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="公告" :append-to-body="true" :visible.sync="dialogVisible" width="80%">
      <keep-alive><announcement /></keep-alive>
    </el-dialog>
  </div>
</template>

<script>
import { Announcement } from '@/views/login/components'
import { mapGetters } from 'vuex'
export default {
  name: 'Navbar',
  components: {
    Announcement,
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
  computed: {
    ...mapGetters(['userid', 'username', 'permission']),
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    openAdmin() {
      window.location = `${process.env.VUE_APP_HOST_URL}admin/`
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  box-sizing: border-box;
  height: 50px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  #logo-container {
    img {
      height: 50px;
    }
  }
  .right-menu {
    .dropdown {
      margin-left: 30px;
    }
  }
}
</style>
