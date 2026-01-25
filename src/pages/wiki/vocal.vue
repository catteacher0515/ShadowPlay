<template>
  <view class="vocal-container">
    <image class="bg-img" src="/static/images/wiki/vocal/bg-vocal-stage.jpg.jpg" mode="aspectFill" />

    <view class="player-wrapper">
      
      <view class="turntable" :class="{ 'is-spinning': isPlaying }">
        <image class="disc-base" src="/static/images/wiki/vocal/ui-disc-skin.png.png" mode="aspectFit" />
        
        <image class="disc-cover" :src="currentTrack.cover" mode="aspectFit" />
      </view>

      <view class="control-stick-wrapper" :class="{ 'stick-active': isPlaying }">
         <image class="stick-img" src="/static/images/wiki/vocal/ui-control-stick.png.png" mode="heightFix" />
      </view>

    </view>

    <view class="control-panel">
      <view class="track-info">
        <text class="track-name">{{ currentTrack.name }}</text>
        <text class="track-desc">{{ currentTrack.desc }}</text>
      </view>
      
      <view class="play-btn-box" @click="togglePlay">
        <image class="btn-img" src="/static/images/wiki/vocal/btn-play-call.png.png" mode="heightFix" />
        <view class="btn-shadow" v-if="isPlaying"></view>
      </view>
    </view>

    <view class="back-btn" :style="{ top: safeAreaTop + 'px' }" @click="goBack">
      <text class="back-icon">←</text>
    </view>

  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const safeAreaTop = ref(40);
const isPlaying = ref(false);

// 播放列表数据 (路径已修正为 .png.png)
const tracks = [
  {
    id: 1,
    name: '掐嗓 · 借扇',
    desc: '孙悟空大战铁扇公主 (选段)',
    // 修正：根据截图，孙悟空的图是 .png.png
    cover: '/static/images/wiki/vocal/char-shadow-monkey.png.png', 
    // 这是一个京剧音频示例，用来测试播放功能
    audio: 'https://music.163.com/song/media/outer/url?id=1359436324.mp3' 
  }
];
const currentTrack = ref(tracks[0]);

// 音频上下文
let innerAudioContext = null;

const togglePlay = () => {
  if (!innerAudioContext) return;

  if (isPlaying.value) {
    innerAudioContext.pause();
    isPlaying.value = false;
  } else {
    innerAudioContext.src = currentTrack.value.audio;
    innerAudioContext.play();
    isPlaying.value = true;
  }
};

const goBack = () => {
  uni.navigateBack();
};

onMounted(() => {
  const menuButton = uni.getMenuButtonBoundingClientRect();
  if (menuButton) {
    safeAreaTop.value = menuButton.top;
  }
  
  // 初始化音频实例
  innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = false;
  
  // 监听播放结束，自动复位
  innerAudioContext.onEnded(() => {
    isPlaying.value = false;
  });
  
  // 监听错误，防止闪退
  innerAudioContext.onError((res) => {
    console.error('Audio Error:', res.errMsg);
    isPlaying.value = false;
    uni.showToast({ title: '音频播放失败', icon: 'none' });
  });
});

onUnmounted(() => {
  if (innerAudioContext) {
    innerAudioContext.destroy();
  }
});
</script>

<style lang="scss" scoped>
.vocal-container {
  width: 100vw; height: 100vh; position: relative;
  background: #1a1a1a; overflow: hidden;
}
.bg-img {
  width: 100%; height: 100%; position: absolute; z-index: 0; opacity: 0.6; /* 稍微调暗背景 */
}

/* Player Mechanism */
.player-wrapper {
  position: relative; width: 100%; height: 60vh;
  margin-top: 15vh;
  display: flex; justify-content: center; align-items: center;
}

/* Turntable */
.turntable {
  width: 320px; height: 320px; /* 加大尺寸 */
  position: relative;
  display: flex; justify-content: center; align-items: center;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.is-spinning {
  animation: spin 10s linear infinite;
}

.disc-base {
  width: 100%; height: 100%; position: absolute;
}
.disc-cover {
  width: 80%; height: 80%; position: absolute;
  /* 混合模式，让角色图看起来印在皮子上 */
  mix-blend-mode: multiply; 
  opacity: 0.95; /* 稍微提高不透明度，让角色更清晰 */
}

/* Control Stick (Tonearm) */
.control-stick-wrapper {
  position: absolute; 
  top: -60px; right: 10px; 
  width: 120px; height: 320px;
  transform-origin: 60% 30px; /* 调整旋转轴心 */
  transform: rotate(-35deg); /* 初始状态：移开 */
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 20;
  pointer-events: none;
}
.stick-active {
  transform: rotate(0deg); /* 激活状态：移入 */
}
.stick-img {
  width: 100%; height: 100%;
}

/* Controls */
.control-panel {
  position: absolute; bottom: 100px; width: 100%;
  display: flex; flex-direction: column; align-items: center;
  z-index: 20;
}
.track-info {
  text-align: center; margin-bottom: 30px;
}
.track-name {
  font-size: 26px; color: #E0D6C3; font-weight: bold; display: block; margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
.track-desc {
  font-size: 14px; color: rgba(255,255,255,0.7);
}

.play-btn-box {
  width: 180px; height: 60px; position: relative;
  transition: transform 0.1s;
}
.play-btn-box:active { transform: scale(0.95); }

.btn-img { width: 100%; height: 100%; }
.btn-shadow {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.2); border-radius: 12px;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Nav */
.back-btn {
  position: fixed; left: 20px; z-index: 100;
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.1); backdrop-filter: blur(5px);
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255,255,255,0.2); color: #fff;
}
</style>