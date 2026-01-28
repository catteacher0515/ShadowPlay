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

      <view class="btn-skip-css" @click.stop="skipStory">
        <text>跳过</text>
      </view>

      <view class="dialog-box-css">
        <view class="name-tag-css">
          <text>{{ currentLine.name }}</text>
        </view>
        <text class="dialog-text-css">{{ displayedText }}</text>
        <view class="next-indicator-css">▼</view>
      </view>
    </view>

    <view class="nav-bar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="back-btn" @click="goBack">
        <text>← 退出关卡</text>
      </view>
    </view>
    
    <view v-if="gameStage === 'finished'" class="victory-modal">
      <view class="victory-content-css">
        <view class="modal-border-inner"></view>
        
        <text class="victory-title">灵物归位</text>
        <text class="victory-desc">已集齐【天蓬元帅】真身组件</text>
        
        <view class="items-grid">
          <view class="reward-item-css">
            <image src="/static/images/theater/journey/wukong/icon-bajie-hand.png.png" mode="aspectFit" />
            <text class="item-name">九齿钉耙</text>
          </view>
          <view class="reward-item-css">
            <image src="/static/images/theater/journey/wukong/icon-bajie-body.png.png" mode="aspectFit" />
            <text class="item-name">天蓬战甲</text>
          </view>
          <view class="reward-item-css">
            <image src="/static/images/theater/journey/wukong/icon-bajie-head.png.png" mode="aspectFit" />
            <text class="item-name">行者僧帽</text>
          </view>
          <view class="reward-item-css">
            <image src="/static/images/theater/journey/wukong/icon-bajie-leg.png.png" mode="aspectFit" />
            <text class="item-name">踏云布鞋</text>
          </view>
        </view>
        
        <button class="confirm-btn-css" @click="goBack">收入影箱，继续征途</button>
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

/* --- UI 层 (通用布局) --- */
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

.char-sprite {
  position: absolute;
  bottom: 0; 
  height: 240px; 
  transition: all 0.3s ease-out;
  
  &.pos-left {
    left: 10px; 
    animation: slideInLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  }
  
  &.pos-right {
    right: 10px;
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

/* --- Pure CSS 跳过按钮 --- */
.btn-skip-css {
  position: absolute; top: 60px; right: 20px;
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3);
  color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 14px; z-index: 102;
  
  &:active { background: rgba(0,0,0,0.6); }
}

/* --- Pure CSS 对话框 (黑金风格) --- */
.dialog-box-css {
  position: absolute; bottom: 40px; left: 5%; width: 90%; height: 150px;
  background: rgba(20, 20, 20, 0.9);
  border: 2px solid #5D4037;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,0,0,0.8);
  z-index: 101;
}

.name-tag-css {
  position: absolute; top: -18px; left: 10px;
  background: #3E2723; border: 1px solid #8D6E63;
  padding: 4px 20px; transform: skewX(-15deg);
  
  text {
    display: block; transform: skewX(15deg);
    color: #FFD700; font-weight: bold; font-size: 14px;
  }
}

.dialog-text-css {
  display: block; padding: 25px 20px;
  color: #E0E0E0; font-size: 16px; line-height: 1.6;
}

.next-indicator-css {
  position: absolute; bottom: 10px; right: 15px; color: #FFD700;
  animation: blink 1s infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

/* --- 顶部导航 --- */
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
   ✨ 结算弹窗样式 (纯 CSS 灵匣风格) ✨
========================================= */

.victory-modal {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center;
  perspective: 1000px;
  padding: 20px;
}

.modal-mask {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(5px);
  animation: fadeIn 0.5s ease-out forwards;
}

.victory-content-css {
  width: 90%; max-width: 400px; background: #2C1608;
  border: 2px solid #FFD700; border-radius: 12px;
  padding: 40px 20px 30px;
  display: flex; flex-direction: column; align-items: center;
  position: relative;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
  animation: boxPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.2s;
  opacity: 0; transform: scale(0.8) translateY(20px);
}

.modal-border-inner {
  position: absolute; inset: 6px; border: 1px dashed rgba(255,215,0,0.3);
  border-radius: 8px; pointer-events: none;
}

.victory-title {
  color: #FFD700; font-size: 24px; font-weight: bold; margin-bottom: 8px;
  letter-spacing: 4px; text-shadow: 0 2px 4px #000;
}
.victory-desc {
  color: #A1887F; font-size: 14px; margin-bottom: 25px;
}

.items-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; width: 100%;
}

.reward-item-css {
  display: flex; flex-direction: column; align-items: center;
  opacity: 0; animation: itemPopUp 0.5s ease-out forwards;
  
  image { 
    width: 60px; height: 60px; margin-bottom: 5px; 
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
    animation: itemFloat 3s ease-in-out infinite alternate;
  }
  .item-name { color: #D7CCC8; font-size: 12px; }
  
  &:nth-child(1) { animation-delay: 0.5s; }
  &:nth-child(2) { animation-delay: 0.7s; }
  &:nth-child(3) { animation-delay: 0.9s; }
  &:nth-child(4) { animation-delay: 1.1s; }
}

.confirm-btn-css {
  background: linear-gradient(to bottom, #FFD700, #FFA000);
  color: #3E2723; font-weight: bold; border-radius: 25px;
  padding: 0 40px; box-shadow: 0 4px 10px rgba(255, 160, 0, 0.4);
  border: none;
  opacity: 0; animation: fadeIn 0.5s ease-out forwards 1.3s;
}

@keyframes fadeIn { to { opacity: 1; } }
@keyframes boxPopIn { to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes itemPopUp { to { opacity: 1; transform: translateY(0); } }
@keyframes itemFloat { from { transform: translateY(0); } to { transform: translateY(-5px); } }
</style>