<template>
  <div class="app-wrapper">
    <navbar />
    <app-main />
  </div>
</template>

<script>
import { AppMain, Navbar } from './components'
export default {
  components: {
    Navbar,
    AppMain,
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  padding: 20px 120px;
}
</style>
