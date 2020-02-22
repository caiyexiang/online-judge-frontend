<template>
  <el-button id="back-btn" type="text" icon="el-icon-arrow-left" @click="goBack">
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'BackBtn',
  props: {
    to: {
      type: String,
      default: '',
    },
  },
  methods: {
    goBack() {
      this.to ? this.$router.push(this.to) : this.$router.go(-1)
    },
  },
}
</script>
