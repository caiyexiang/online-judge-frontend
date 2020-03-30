<template>
  <div>
    <el-radio-group v-model="type" @change="getAnnoucement" style="margin-bottom: 10px">
      <el-radio-button label="公告"></el-radio-button>
      <el-radio-button label="FAQ"></el-radio-button>
    </el-radio-group>
    <div class="ql-snow">
      <div id="announcement-content" class="ql-editor" v-html="announcement" />
    </div>
  </div>
</template>

<script>
import { getAnnouncement } from '@/api/announcement'
import '@/assets/styles/quill.snow.css'
export default {
  name: 'Announcement',
  data() {
    return {
      announcement: '',
      type: '公告',
    }
  },
  computed: {
    id() {
      switch (this.type) {
        case '公告':
          return 1
        case 'FAQ':
          return 2
      }
    },
  },
  created() {
    this.getAnnoucement()
  },
  methods: {
    getAnnoucement() {
      getAnnouncement(this.id).then(res => {
        this.announcement = res.content
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#announcement-content {
  max-height: 350px;
  overflow-y: auto;
}
</style>
