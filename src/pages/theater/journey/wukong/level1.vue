<template>
  <view class="level-container">
    <image 
      class="bg-scene" 
      src="/static/images/theater/journey/wukong/bg-scene-gaolao.jpg.jpg" 
      mode="aspectFill" 
    />
    
    <view 
      class="bajie-placeholder" 
      :class="{ visible: isFogCleared }"
      v-if="gameStage === 'intro' || gameStage === 'playing'"
    >
      <view class="bajie-shadow"></view> 
    </view>

    <canvas 
      v-if="gameStage === 'playing'"
      canvas-id="fogCanvas" 
      class="fog-canvas"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      :disable-scroll="true"
    ></canvas>

    <view class="dialog-layer" v-if="showDialog" @click="nextDialog">
      
      <view class="sprite-stage">
        <image 
          v-if="currentLine.sprite"
          class="char-sprite"
          :class="[
            currentLine.position === 'right' ? 'pos-right' : 'pos-left',
            currentLine.effect ? currentLine.effect : '',
            isSpriteChanging ? 'fade-out' : 'fade-in'
          ]"
          :src="currentLine.sprite" 
          mode="heightFix" 
        />
      </view>

      <view class="skip-btn" @click.stop="skipStory">
        <image src="/static/images/theater/journey/wukong/btn-story-skip.png.jpg" mode="aspectFit" />
      </view>

      <view class="dialog-box">
        <image class="dialog-bg" src="/static/images/theater/journey/wukong/ui-dialog-panel.png.jpg" mode="scaleToFill" />
        
        <view class="name-tag">
          <image class="tag-bg" src="/static/images/theater/journey/wukong/ui-name-tag.png.jpg" mode="scaleToFill" />
          <text class="name-text">{{ currentLine.name }}</text>
        </view>

        <text class="dialog-text">{{ displayedText }}</text>
        
        <view class="next-indicator">▼</view>
      </view>
    </view>

    <view class="nav-bar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="back-btn" @click="goBack">
        <text>← 退出关卡</text>
      </view>
    </view>
    
    <view v-if="gameStage === 'finished'" class="victory-modal">
      <view class="modal-mask"></view>
      
      <view class="treasure-box-container">
        <image class="box-bg" src="/static/images/theater/journey/wukong/ui-dialog-panel.png.jpg" mode="scaleToFill" />
        
        <view class="box-header">
          <image class="header-bg" src="/static/images/theater/journey/wukong/ui-name-tag.png.jpg" mode="scaleToFill" />
          <text class="header-text">灵物归位</text>
        </view>
    
        <view class="items-grid">
          <view class="item-slot slot-1">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-bajie-hand.png.png" mode="aspectFit" />
            <text class="item-name">九齿钉耙</text>
          </view>
          
          <view class="item-slot slot-2">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-bajie-body.png.png" mode="aspectFit" />
            <text class="item-name">天蓬战甲</text>
          </view>
          
          <view class="item-slot slot-3">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-bajie-head.png.png" mode="aspectFit" />
            <text class="item-name">行者僧帽</text>
          </view>
          
          <view class="item-slot slot-4">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-bajie-leg.png.png" mode="aspectFit" />
            <text class="item-name">踏云布鞋</text>
          </view>
        </view>
    
        <text class="victory-desc">已集齐【天蓬元帅】真身组件</text>
        
        <button class="confirm-btn" @click="goBack">收入影箱，继续征途</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch } from 'vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;
const screenWidth = uni.getSystemInfoSync().windowWidth;
const screenHeight = uni.getSystemInfoSync().windowHeight;

// --- 游戏状态管理 ---
const gameStage = ref('intro'); 

// --- 资源映射 ---
const ASSETS = {
  WUKONG_PROBE: '/static/images/theater/journey/wukong/sprite-wukong-probe.png.png',
  WUKONG_POINT: '/static/images/theater/journey/wukong/sprite-wukong-point.png.png',
  WUKONG_PROUD: '/static/images/theater/journey/wukong/sprite-wukong-proud.png.png',
  BAJIE_ARROGANT: '/static/images/theater/journey/wukong/sprite-bajie-arrogant.png.png',
  BAJIE_SCARED: '/static/images/theater/journey/wukong/sprite-bajie-scared.png.png',
  BAJIE_BEG: '/static/images/theater/journey/wukong/sprite-bajie-beg.png.png',
};

// --- 剧情数据 ---
const scripts = {
  intro: [
    { 
      name: '孙悟空', 
      text: '（嗅）好大一股妖气...这高老庄灯火昏暗，定有妖怪在此作祟！', 
      sprite: ASSETS.WUKONG_PROBE, 
      position: 'left' 
    },
    { 
      name: '猪八戒', 
      text: '（迷雾中）哼！哪来的弼马温，敢坏你猪祖宗的好事！', 
      sprite: ASSETS.BAJIE_ARROGANT, 
      position: 'right',
      effect: 'ghost-mode' 
    },
    { 
      name: '孙悟空', 
      text: '嘿！这呆子躲在“黑风阵”里不敢见人。', 
      sprite: ASSETS.WUKONG_PROBE, 
      position: 'left' 
    },
    { 
      name: '孙悟空', 
      text: '屏幕前的“点灯人”，快伸出你的金手指，帮俺老孙擦亮这天光，揪出这夯货！', 
      sprite: ASSETS.WUKONG_POINT, 
      position: 'left' 
    }
  ],
  outro: [
    { 
      name: '猪八戒', 
      text: '哎哟哟！别擦了，俺老猪的肚子都露出来啦！', 
      sprite: ASSETS.BAJIE_SCARED, 
      position: 'right' 
    },
    { 
      name: '猪八戒', 
      text: '原来是大师兄！俺老猪有眼不识泰山，这就跟您走！', 
      sprite: ASSETS.BAJIE_BEG, 
      position: 'right' 
    },
    { 
      name: '孙悟空', 
      text: '呆子！既认得俺老孙，还不快快现出原形！', 
      sprite: ASSETS.WUKONG_PROUD, 
      position: 'left' 
    },
    { 
      name: '猪八戒', 
      text: '得勒！大师兄请上座，俺老猪这就牵马坠镫！', 
      sprite: ASSETS.BAJIE_BEG, 
      position: 'right' 
    }
  ]
};

// --- 对话系统逻辑 ---
const dialogIndex = ref(0);
const displayedText = ref('');
const isTyping = ref(false);
const isSpriteChanging = ref(false);
let typingTimer = null;

const currentScript = computed(() => scripts[gameStage.value] || []);
const currentLine = computed(() => currentScript.value[dialogIndex.value] || {});
const showDialog = computed(() => ['intro', 'outro'].includes(gameStage.value));

watch(() => currentLine.value.sprite, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    isSpriteChanging.value = true;
    setTimeout(() => {
      isSpriteChanging.value = false;
    }, 50);
  }
});

const typeWriter = (text) => {
  displayedText.value = '';
  isTyping.value = true;
  let i = 0;
  clearInterval(typingTimer);
  typingTimer = setInterval(() => {
    if (i < text.length) {
      displayedText.value += text.charAt(i);
      i++;
    } else {
      clearInterval(typingTimer);
      isTyping.value = false;
    }
  }, 50);
};

const nextDialog = () => {
  if (isTyping.value) {
    clearInterval(typingTimer);
    displayedText.value = currentLine.value.text;
    isTyping.value = false;
    return;
  }

  if (dialogIndex.value < currentScript.value.length - 1) {
    dialogIndex.value++;
    typeWriter(currentLine.value.text);
  } else {
    if (gameStage.value === 'intro') {
      startGame();
    } else if (gameStage.value === 'outro') {
      finishGame();
    }
  }
};

const skipStory = () => {
  if (gameStage.value === 'intro') startGame();
  if (gameStage.value === 'outro') finishGame();
};

onMounted(() => {
  typeWriter(currentLine.value.text);
});

// --- 迷雾/刮刮乐逻辑 ---
const ctx = ref(null);
const isFogCleared = ref(false);
const scrubDistance = ref(0);
const WIN_THRESHOLD = 3000;

const startGame = () => {
  gameStage.value = 'playing';
  dialogIndex.value = 0;
  
  setTimeout(() => {
    ctx.value = uni.createCanvasContext('fogCanvas', getCurrentInstance());
    ctx.value.setFillStyle('rgba(0, 0, 0, 0.95)');
    ctx.value.fillRect(0, 0, screenWidth, screenHeight);
    
    ctx.value.setFillStyle('#FFD700');
    ctx.value.setFontSize(20);
    ctx.value.setTextAlign('center');
    ctx.value.fillText('手指滑动 擦除妖雾', screenWidth / 2, screenHeight / 2);
    
    ctx.value.draw();
  }, 100);
};

let lastX = 0;
let lastY = 0;

const touchStart = (e) => {
  const { x, y } = e.touches[0];
  lastX = x;
  lastY = y;
};

const touchMove = (e) => {
  if (isFogCleared.value) return;

  const { x, y } = e.touches[0];
  
  ctx.value.globalCompositeOperation = 'destination-out';
  ctx.value.beginPath();
  ctx.value.arc(x, y, 40, 0, 2 * Math.PI);
  ctx.value.fill();
  ctx.value.draw(true);
  
  const dist = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
  scrubDistance.value += dist;
  lastX = x;
  lastY = y;
  
  if (scrubDistance.value > WIN_THRESHOLD) {
    onWin();
  }
};

const touchEnd = () => {};

const onWin = () => {
  if (isFogCleared.value) return;
  isFogCleared.value = true;
  
  uni.vibrateLong();
  uni.showToast({ title: '妖雾散去！', icon: 'success' });
  
  setTimeout(() => {
    gameStage.value = 'outro';
    dialogIndex.value = 0;
    typeWriter(scripts.outro[0].text);
  }, 1000);
};

const finishGame = () => {
  gameStage.value = 'finished';
  const clearedIds = uni.getStorageSync('WUKONG_CLEARED_IDS') || [];
  if (!clearedIds.includes('bajie')) {
    clearedIds.push('bajie');
    uni.setStorageSync('WUKONG_CLEARED_IDS', clearedIds);
  }
};

const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.redirectTo({ url: '/pages/theater/journey/index' });
  }
};
</script>

<style lang="scss" scoped>
.level-container {
  width: 100vw; height: 100vh;
  position: relative; overflow: hidden;
  background: #000;
}

.bg-scene {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
}

.bajie-placeholder {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0; transition: opacity 1s;
  z-index: 2;
  
  &.visible { opacity: 1; }
  
  .bajie-shadow {
    width: 200px; height: 300px;
    background: radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%);
    border: 2px dashed #FFD700;
    border-radius: 50%;
  }
}

.fog-canvas {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10;
}

.dialog-layer {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
  z-index: 100; pointer-events: auto;
}

/* 立绘舞台 */
.sprite-stage {
  position: absolute;
  bottom: 140px; 
  left: 0; width: 100%; 
  height: 250px; 
  pointer-events: none;
  z-index: 90;
  overflow: hidden;
}

/* ✨ 修复点：立绘参数严格按照你的要求设置 */
.char-sprite {
  position: absolute;
  bottom: 0; 
  height: 250px; 
  transition: all 0.3s ease-out;
  
  &.pos-left {
    left: 5px; 
    animation: slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  &.pos-right {
    right: 5px;
    animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  &.ghost-mode {
    opacity: 0.6;
    animation: ghostFloat 3s ease-in-out infinite alternate;
  }
  
  &.fade-out { opacity: 0; transform: scale(0.95); }
  &.fade-in { opacity: 1; transform: scale(1); }
}

@keyframes slideInLeft {
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes ghostFloat {
  from { transform: translateY(0); }
  to { transform: translateY(-15px); }
}

.skip-btn {
  position: absolute; top: 60px; right: 20px;
  width: 80px; height: 40px;
  z-index: 102;
  image { width: 100%; height: 100%; }
}

.dialog-box {
  position: absolute; bottom: 40px; left: 50%;
  transform: translateX(-50%);
  width: 90%; height: 160px;
  z-index: 101;
}

.dialog-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
}

.name-tag {
  position: absolute; top: -15px; left: 0px;
  width: 120px; height: 40px; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  
  .tag-bg { position: absolute; width: 100%; height: 100%; }
  .name-text { 
    position: relative; color: #fff; font-weight: bold; font-size: 14px; z-index: 3; 
    text-shadow: 0 1px 2px #000;
  }
}

.dialog-text {
  position: relative; z-index: 2;
  display: block;
  padding: 35px 25px 20px 25px;
  font-size: 16px; color: #fff; line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.next-indicator {
  position: absolute; bottom: 15px; right: 20px;
  color: #FFD700; animation: blink 1s infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.nav-bar {
  position: absolute; top: 0; left: 0; width: 100%;
  z-index: 200; padding-left: 20px;
  
  .back-btn {
    color: rgba(255,255,255,0.8); font-size: 14px;
    background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px;
    display: inline-block;
  }
}

/* =========================================
   ✨ 结算弹窗样式 (最终修正版) ✨
========================================= */

.victory-modal {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center;
  perspective: 1000px;
  padding: 20px; /* 增加 padding 防止紧贴屏幕边缘 */
}

.modal-mask {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.5s ease-out forwards;
}

.treasure-box-container {
  position: relative;
  width: 90%; max-width: 400px;
  padding: 40px 20px 30px;
  border-radius: 16px;
  display: flex; flex-direction: column; align-items: center;
  /* ✨ 关键修复：允许子元素溢出（解决标题被切） */
  overflow: visible !important; 
  opacity: 0; transform: scale(0.8) translateY(20px);
  animation: boxPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.2s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.box-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: -1; filter: brightness(0.7) sepia(0.2);
  border-radius: 16px;
  /* ✨ 关键修复：移除 CSS 边框，防止双重边框和干扰 */
  /* border: 3px solid #FFD700; <-- 已删除 */
}

.box-header {
  /* ✨ 关键修复：位置大幅上调，彻底解决重叠 */
  position: absolute; top: -50px; 
  width: 160px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
  
  .header-bg { position: absolute; width: 100%; height: 100%; }
  .header-text {
    position: relative; color: #FFD700; font-size: 20px; font-weight: bold;
    text-shadow: 0 2px 4px #000; letter-spacing: 4px;
  }
}

.items-grid {
  position: relative; z-index: 5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 30px 0 25px;
  width: 100%;
}

.item-slot {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  opacity: 0; transform: translateY(30px);
}

.item-icon {
  width: 80px; height: 80px;
  position: relative; z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  animation: itemFloat 3s ease-in-out infinite alternate;
}

.slot-glow {
  position: absolute;
  top: 50%; left: 50%;
  width: 100px; height: 100px;
  transform: translate(-50%, -60%);
  background: radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%);
  z-index: 1;
  opacity: 0.8;
  animation: glowPulse 2s ease-in-out infinite alternate;
}

.item-name {
  margin-top: 8px;
  font-size: 12px; color: #FFD700; opacity: 0.9;
  text-shadow: 0 1px 2px #000;
}

.slot-1 { animation: itemPopUp 0.5s ease-out forwards 0.5s; }
.slot-2 { animation: itemPopUp 0.5s ease-out forwards 0.7s; }
.slot-3 { animation: itemPopUp 0.5s ease-out forwards 0.9s; }
.slot-4 { animation: itemPopUp 0.5s ease-out forwards 1.1s; }

.victory-desc {
  position: relative; z-index: 5;
  color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 25px;
  text-align: center;
  opacity: 0; animation: fadeIn 0.5s ease-out forwards 1.3s;
}

.confirm-btn {
  position: relative; z-index: 5;
  background: linear-gradient(to bottom, #FFD700, #FFA000);
  color: #000; font-weight: bold; font-size: 16px;
  border-radius: 25px; padding: 8px 40px;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 160, 0, 0.5);
  animation: btnPulse 2s infinite alternate;
  opacity: 0; animation: fadeIn 0.5s ease-out forwards 1.5s, btnPulse 2s infinite alternate 1.5s;
  
  &:active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(255, 160, 0, 0.3); }
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes boxPopIn {
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes itemPopUp {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes itemFloat {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

@keyframes glowPulse {
  from { opacity: 0.5; transform: translate(-50%, -60%) scale(0.8); }
  to { opacity: 1; transform: translate(-50%, -60%) scale(1.1); }
}

@keyframes btnPulse {
  from { box-shadow: 0 4px 15px rgba(255, 160, 0, 0.5); }
  to { box-shadow: 0 8px 25px rgba(255, 160, 0, 0.8); }
}
</style>