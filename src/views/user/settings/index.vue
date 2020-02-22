<template>
  <div>
    <div class="title-container">
      <div class="title">
        设置
      </div>
      <back-btn>返回</back-btn>
    </div>
    <div class="container">
      <el-card>
        <el-tabs tab-position="left">
          <el-tab-pane label="修改密码">
            <ChangePassword />
          </el-tab-pane>
          <el-tab-pane label="修改资料">
            <ChangeProfile />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import { ChangePassword, ChangeProfile } from './components'
export default {
  name: 'setttings',
  components: { BackBtn, ChangePassword, ChangeProfile },
}
</script>
