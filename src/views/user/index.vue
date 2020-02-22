<template>
  <div>
    <div class="title-container">
      <div class="title">{{ $store.getters.username }} 的个人主页</div>
      <BackBtn> 返回 </BackBtn>
    </div>
    <div class="main-container">
      <el-card id="profile-card">
        <profile />
      </el-card>
      <el-card id="dashboard-card">
        <div slot="header">
          <span>用户数据统计</span>
        </div>
        <dashboard />
      </el-card>
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import { Dashboard, Profile } from './components'
export default {
  components: { BackBtn, Dashboard, Profile },
}
</script>

<style lang="scss" scoped>
.main-container {
  display: flex;
  #profile-card {
    width: 230px;
    height: 250px;
    margin-right: 20px;
  }
  #dashboard-card {
    flex: 1;
    height: 500px;
  }
}
</style>
