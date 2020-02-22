<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive>
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    },
  },
}
</script>

<style lang="scss" scoped>
.app-main {
  /* navbar = 50+20+20  */
  min-height: calc(100vh - 130px);
  padding: 20px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
</style>
