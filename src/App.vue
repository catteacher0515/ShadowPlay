<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
    
    // ✨✨✨ 激活云开发 (填入你的环境ID) ✨✨✨
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-8gizllp3a0666dde', // 你的环境 ID
        traceUser: true
      });
    }
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
/* Global Styles */
@import '@/uni.scss';

page {
  background-color: $theme-bg-dark;
  color: $theme-text-light;
}
</style>