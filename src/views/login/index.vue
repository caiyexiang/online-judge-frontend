<template>
  <div class="login-container">
    <header>
      <router-link to="/login">
        <img src="@/assets/images/logo.png" />
      </router-link>
    </header>
    <main>
      <el-card id="announcement">
        <div slot="header">
          <span>公告栏</span>
        </div>
        <Announcement />
      </el-card>
      <el-card id="login-form">
        <LoginForm />
      </el-card>
    </main>
    <footer>
      <p>powered by Leon, Xander & Tony copyright 2020</p>
    </footer>
  </div>
</template>

<script>
import { LoginForm, Announcement } from './components'
export default {
  name: 'Login',
  components: {
    LoginForm,
    Announcement,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.login-container {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  padding: 50px;
  & header {
    box-sizing: inherit;
    width: 100%;
    height: 150px;
    overflow: hidden;
    margin-bottom: 30px;
    text-align: center;
    img {
      display: inline-block;
      height: 150px;
    }
  }
  & main {
    display: flex;
    #announcement {
      flex-grow: 1;
    }
    #login-form {
      height: 230px;
      margin-left: 10px;
      width: 450px;
    }
  }
  & footer {
    p {
      width: 100%;
      margin-top: 50px;
      color: #9c9c9c;
      text-align: center;
    }
  }
}
</style>
