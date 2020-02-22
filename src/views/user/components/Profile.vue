<template>
  <div>
    <div class="avatar-container">
      <img src="@/assets/images/avatar.svg" class="avatar" />
    </div>
    <div class="data-container">
      <p>
        <strong>{{ username }}</strong>
      </p>
      <p>
        <strong> {{ PERMISSION_TYPE[permission] }} </strong>
      </p>
      <p class="info">姓名：{{ name || '未命名' }}</p>
      <p class="info">昵称：{{ nickname || '未命名' }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PERMISSION_TYPE } from '@/utils/constant'
export default {
  name: 'Profile',
  data() {
    return {
      PERMISSION_TYPE,
    }
  },
  computed: {
    ...mapGetters(['username', 'userid', 'permission', 'nickname', 'name']),
  },
}
</script>

<style lang="scss" scoped>
.avatar-container {
  width: 100%;
  .avatar {
    width: 40%;
    height: 40%;
    display: block;
    margin: 0 auto;
  }
}
.data-container {
  width: 100%;
  p {
    text-align: center;
  }
  .info {
    color: gray;
    font-size: 0.9em;
  }
}
</style>
