<template>
  <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px">
    <el-form-item label="密码" prop="password" :error="formError.password">
      <el-input v-model="form.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="repeatPassword">
      <el-input v-model="form.repeatPassword" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">
        修改密码
      </el-button>
      <el-button @click="resetForm">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import formMixin from '@/mixins/formMixin'
import { updatePassword } from '@/api/user'
export default {
  name: 'ChangePassword',
  mixins: [formMixin],
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.repeatPassword !== '') {
          this.$refs.form.validateField('repeatPassword')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        repeatPassword: '',
        password: '',
      },
      rules: {
        password: [{ validator: validatePassword, trigger: 'blur' }],
        repeatPassword: [{ validator: validatePassword2, trigger: 'blur' }],
      },
    }
  },
  methods: {
    async submitData() {
      const data = { password: this.form.password }
      await updatePassword(data)
      this.resetForm()
      this.$message.success('修改密码成功! 请重新登陆! ')
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
  },
}
</script>
