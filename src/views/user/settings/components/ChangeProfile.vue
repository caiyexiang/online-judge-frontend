<template>
  <el-form ref="form" :model="form" status-icon label-width="100px" class="profile-form">
    <el-form-item label="昵称" prop="nickname" required :error="formError.nickname">
      <el-input v-model="form.nickname" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        提交更改
      </el-button>
      <el-button @click="resetForm">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import { updateProfile } from '@/api/user'
export default {
  name: 'changeProfile',
  mixins: [formMixin],
  data() {
    return {
      form: {
        nickname: '',
      },
    }
  },
  methods: {
    async submitData() {
      await updateProfile(this.$store.getters.userid, this.form)
      this.$message.success('修改资料成功!')
      this.resetForm()
      await this.$store.dispatch('user/getInfo')
    },
  },
}
</script>

<style></style>
