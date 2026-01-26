<template>
  <view class="daily-page">
    <image class="bg-layer" src="/static/images/daily/bg-detail-paper-texture.jpg.jpg" mode="aspectFill" />

    <view class="nav-bar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="back-btn" @click="goBack">
        <view class="sys-back-arrow"></view>
      </view>
      <text class="page-title">拾影·日签</text>
    </view>

    <view class="card-container">
      <view class="paper-card">
        
        <view class="visual-box">
          
          <view class="date-header">
            <text class="lunar-text">{{ currentDate.lunar }}</text>
            <text class="solar-text">{{ currentDate.solar }}</text>
          </view>

          <view class="art-frame-container">
            <view class="art-frame">
               <image class="main-art" src="/static/images/daily/sample-shadow-hunting.jpg.jpg" mode="aspectFit" />
            </view>
          </view>
          
        </view>

        <view class="text-box">
          <view class="content-layer">
            <text class="poem">鹿鸣悠悠，马鸣萧萧。</text>
            <view class="daily-advice">
              <text class="label">今日，</text>
              <text class="value">宜一团和气。</text>
            </view>
            <image class="brand-stamp" src="/static/images/daily/stamp-watermark-brand.png.png" mode="heightFix" />
          </view>
        </view>

      </view>
    </view>

    <view class="footer-area">
      <view class="save-btn" @click="onSave" hover-class="btn-hover">
        <image class="icon" src="/static/images/daily/icon-btn-download-gold.png.png" />
        <text>收入金库</text>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

const safeAreaTop = ref(44);
const currentDate = reactive({
  solar: '',
  lunar: ''
});

// --- Date Logic ---
const initDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  currentDate.solar = `${year}.${month}.${day}`;

  const lunarMapping = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', 
                        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  const lunarDay = lunarMapping[(now.getDate() % 30)] || '初一'; 
  currentDate.lunar = `丙午年 正月${lunarDay}`; 
};

// 智能返回逻辑
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.reLaunch({ url: '/pages/index/index' });
  }
};

const onSave = () => uni.showToast({ title: '已收入金库', icon: 'success' });

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  if (sys.safeAreaInsets?.top) {
    safeAreaTop.value = sys.safeAreaInsets.top;
  }
  initDate();
});
</script>

<style lang="scss" scoped>
/* Page Layout */
.daily-page {
  width: 100vw; height: 100vh; position: relative; overflow: hidden;
  background-color: #1a1a1a;
}
.bg-layer { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; opacity: 0.6; }

/* Navbar */
.nav-bar {
  position: absolute; top: 0; left: 0; width: 100%; z-index: 100;
  display: flex; align-items: center; height: 44px;
}
.back-btn {
  width: 44px; height: 44px; 
  margin-left: 4px;
  display: flex; align-items: center; justify-content: center;
}
/* ⚠️ CSS 绘制的系统级返回箭头 */
.sys-back-arrow {
  width: 20rpx;
  height: 20rpx;
  border-left: 4rpx solid rgba(255, 255, 255, 0.95);
  border-bottom: 4rpx solid rgba(255, 255, 255, 0.95);
  transform: rotate(45deg);
  margin-left: 8rpx;
}

.page-title {
  position: absolute; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 500; letter-spacing: 1px;
}

/* CARD CONTAINER */
.card-container {
  position: relative; z-index: 10; width: 100%; height: 100%;
  display: flex; justify-content: center; align-items: center; padding-bottom: 60px;
}

/* THE PAPER CARD */
.paper-card {
  width: 650rpx; 
  height: 1100rpx;
  background-color: #F5EAD4; 
  background-image: linear-gradient(to bottom, #F5EAD4, #EBE0C5);
  border-radius: 12rpx;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  overflow: hidden;
  display: flex; flex-direction: column; position: relative;
}

/* VISUAL AREA */
.visual-box {
  flex: 6.5; position: relative; width: 100%;
  display: flex; flex-direction: column; 
  padding: 30rpx 40rpx; box-sizing: border-box;
}

/* Date Header */
.date-header {
  width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
  margin-bottom: 30rpx; padding-top: 20rpx;
}
.lunar-text {
  font-family: 'Songti SC', serif; font-size: 34rpx; color: #2C1608; font-weight: bold; letter-spacing: 4rpx; margin-bottom: 8rpx;
}
.solar-text {
  font-family: 'Courier New', serif; font-size: 22rpx; color: #888; font-weight: 500; letter-spacing: 2rpx;
}

/* Art Frame */
.art-frame-container {
  flex: 1; width: 100%; position: relative; display: flex; justify-content: center; align-items: center;
}
.art-frame {
  width: 100%; height: 100%; position: relative;
  background-color: #E6DBC0; 
  box-shadow: inset 3px 3px 8px rgba(139, 116, 85, 0.25), inset -2px -2px 6px rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(139, 116, 85, 0.2); 
  border-radius: 8rpx;
  display: flex; justify-content: center; align-items: center;
  padding: 24rpx; box-sizing: border-box;
}
.main-art { width: 100%; height: 100%; mix-blend-mode: multiply; opacity: 0.95; }

/* TEXT AREA */
.text-box {
  flex: 3.5; position: relative; width: 100%; display: flex; align-items: center; justify-content: center;
}
.content-layer {
  width: 100%; padding: 0 40rpx; display: flex; flex-direction: column; align-items: center;
}
.poem {
  font-family: 'Songti SC', serif; font-size: 38rpx; color: #2C1608;
  margin-bottom: 30rpx; letter-spacing: 2rpx; text-align: center; font-weight: bold;
}
.daily-advice {
  display: flex; align-items: center; font-size: 26rpx; color: #8A6D3B; margin-bottom: 40rpx;
  border-top: 1px solid rgba(138, 109, 59, 0.3); border-bottom: 1px solid rgba(138, 109, 59, 0.3);
  padding: 10rpx 20rpx;
}
.brand-stamp { height: 80rpx; width: 200rpx; opacity: 0.7; mix-blend-mode: multiply; }

/* Footer */
.footer-area {
  position: absolute; bottom: 50rpx; width: 100%; display: flex; justify-content: center; z-index: 20;
}
.save-btn {
  display: flex; flex-direction: column; align-items: center;
  .icon { width: 100rpx; height: 100rpx; margin-bottom: 10rpx; }
  text { font-size: 24rpx; color: #E0D6C3; letter-spacing: 1px; }
}
</style>