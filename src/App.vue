<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
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