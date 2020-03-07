<template>
  <el-form ref="form" :model="form" status-icon :rules="rules" label-width="4rem" class="login-form">
    <el-form-item label="用户名" prop="username" :error="formError.username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password" :error="formError.password">
      <el-input v-model="form.password" type="password" autocomplete="off" @keyup.enter.native="submitForm" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm" v-loading="loading">
        登录
      </el-button>
      <el-button @click="resetForm">
        清空
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import formMixin from '@/mixins/formMixin.js'
import { isLegalUsername } from '@/utils/validator'
export default {
  mixins: [formMixin],
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空'))
      } else if (!isLegalUsername(value)) {
        callback(new Error('请输入合法的(数字/英文)用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: '',
        username: '',
      },
      rules: {
        password: [{ validator: validatePassword, trigger: 'blur' }],
        username: [{ validator: validateUsername, trigger: 'blur' }],
      },
      loading: false,
    }
  },
  methods: {
    async submitData() {
      this.loading = true
      const { permission } = await this.$store.dispatch('user/login', this.form)
      if (permission === 3) {
        this.$router.push('/')
      } else {
        window.location = `${document.location.protocol}//${document.location.host}/admin/`
      }
      this.loading = false
    },
  },
}
</script>
