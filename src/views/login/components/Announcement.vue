<template>
  <div class="ql-snow">
    <div id="announcement-content" class="ql-editor" v-html="announcement" />
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
    }
  },
  created() {
    this.getAnnoucement()
  },
  methods: {
    getAnnoucement() {
      getAnnouncement().then(res => {
        this.announcement = res.content
      })
    },
  },
}
</script>

<style lang="scss" scoped>
#announcement-content {
  max-height: 350px;
  overflow-y: scroll;
}
</style>
