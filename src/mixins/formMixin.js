import { FormError } from '@/utils/error'
export default {
  data() {
    return {
      formError: {},
    }
  },
  created() {
    this.initFormError()
  },
  methods: {
    initFormError() {
      const formError = { ...this.formError }
      for (const key in this.form) {
        formError[key] = ''
      }
      this.formError = formError
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs['form'].validate(valid => {
          if (!valid) {
            reject(new Error('表单信息错误'))
          } else {
            resolve(valid)
          }
        })
      })
    },
    resetForm() {
      this.$refs['form'].resetFields()
    },
    handleError(err) {
      if (err instanceof FormError) {
        const formErrorCopy = Object.assign(this.formError)
        const { data } = err
        for (const key in data) {
          if (this.formError.hasOwnProperty(key)) {
            formErrorCopy[key] = data[key]
          } else {
            this.$message.error(`表单项: ${key} 出错, 错误信息: ${data[key]}`)
            console.error(`${key}:${data[key]}`)
          }
        }
        this.formError = formErrorCopy
      } else {
        if (typeof err === 'string') {
          this.$message.error(err)
        } else {
          console.table(err)
        }
      }
    },
    async submitForm() {
      try {
        await this.validateForm()
        await this.submitData()
      } catch (err) {
        this.loading = false
        this.handleError(err)
      }
    },
  },
}
