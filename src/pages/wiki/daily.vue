<template>
  <view class="daily-detail-container">
    <view class="custom-navbar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="nav-content">
        <view class="btn-back" @click="goBack">←</view>
        <text class="page-title">拾影·日签</text>
      </view>
    </view>

    <view class="daily-card">
      <view class="image-section">
        <view class="date-overlay">
          <text class="date-lunar">乙巳年 正月廿三</text>
          <text class="date-solar">2026.02.20</text>
        </view>
        <view class="shadow-img-placeholder">
           <text>今日皮影：猎鹿</text>
        </view>
        <view class="info-overlay">
          <text class="art-title">猎鹿</text>
          <text class="art-desc">清末 · 乐亭影</text>
        </view>
      </view>

      <view class="text-section">
        <text class="quote-poetic">鹿鸣悠悠，马鸣萧萧。</text>
        <view class="quote-main">
          <text class="label">今日，</text>
          <text class="content">宜一团和气。</text>
        </view>
        <view class="brand-stamp">[云上·皮影]</view>
      </view>
    </view>

    <view class="bottom-actions">
      <button class="btn-collect" @click="saveToVault">
        <text>📥 收入金库</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;

const goBack = () => {
  uni.navigateBack();
};

const saveToVault = () => {
  uni.showToast({
    title: '已收入数字金库',
    icon: 'success'
  });
};
</script>

<style lang="scss" scoped>
.daily-detail-container {
  min-height: 100vh;
  background-color: #2C2C2C;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px; /* Space for bottom actions */
}

.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: transparent;
  color: white;
  
  .nav-content {
    height: 44px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    position: relative;
  }

  .btn-back {
    font-size: 24px;
    padding: 0 10px;
  }

  .page-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-weight: bold;
  }
}

.daily-card {
  margin: 80px 20px 20px 20px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.image-section {
  position: relative;
  height: 400px;
  background-color: #444;
}

.shadow-img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 20px;
  background: linear-gradient(to bottom, #444, #333);
}

.date-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  color: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  z-index: 1;

  .date-lunar {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .date-solar {
    font-size: 14px;
    opacity: 0.8;
  }
}

.info-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: rgba(255,255,255,0.9);
  display: flex;
  flex-direction: column;
  z-index: 1;

  .art-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .art-desc {
    font-size: 14px;
    opacity: 0.8;
  }
}

.text-section {
  padding: 40px 20px;
  background-color: #F7F5F0;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  /* Paper texture simulation */
  background-image: radial-gradient(#d0d0d0 1px, transparent 1px);
  background-size: 20px 20px;
}

.quote-poetic {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  font-style: italic;
  font-family: "Times New Roman", serif;
}

.quote-main {
  text-align: center;
  margin-bottom: 40px;
  
  .label {
    display: block;
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
  }
  
  .content {
    font-size: 28px;
    font-weight: bold;
    color: #2C1608;
  }
}

.brand-stamp {
  font-size: 14px;
  color: #A52A2A;
  border: 1px solid #A52A2A;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 2px;
}

.bottom-actions {
  position: fixed;
  bottom: 40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 90;
}

.btn-collect {
  background-color: #FFD700;
  color: #2C1608;
  border-radius: 50px;
  font-weight: bold;
  padding: 0 40px;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  border: none;
  font-size: 16px;
}
</style>