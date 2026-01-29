<template>
  <view class="level-container" :class="{ 'shake-screen': isShaking }">
    <image 
      class="bg-scene" 
      src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/bg-scene-liusha.png.png" 
      mode="aspectFill" 
    />
    
    <view class="game-area" v-if="gameStage === 'playing'">
      <view 
        v-for="bubble in bubbles" 
        :key="bubble.id"
        class="bubble-item"
        :style="{ 
          left: bubble.x + 'px', 
          bottom: bubble.y + 'px',
          transition: 'bottom 0.1s linear'
        }"
        @click="onBubbleClick(bubble)"
      >
        <view class="bubble-wrapper">
           <image class="bubble-bg" src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/ui-bubble.png.png" mode="aspectFit" />
           <image class="bubble-content" :src="bubble.contentSrc" mode="aspectFit" />
        </view>
      </view>
    </view>
    
    <view class="progress-hud" v-if="gameStage === 'playing'">
      <view class="hud-title">法宝收集 {{ collectedCount }}/4</view>
      <view class="hud-slots">
        <view 
          v-for="(item, index) in targetItems" 
          :key="item.id" 
          class="slot-item"
          :class="{ collected: isCollected(item.id) }"
        >
          <image v-if="isCollected(item.id)" :src="item.src" mode="aspectFit" />
        </view>
      </view>
    </view>

    <view class="dialog-layer" v-if="showDialog" @click="nextDialog">
      
      <view class="sprite-stage">
        <image 
          v-if="currentLine.sprite"
          class="char-sprite"
          :class="[
            currentLine.position === 'right' ? 'pos-right' : 'pos-left',
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
        <text class="victory-desc">已集齐【卷帘大将】真身组件</text>
        
        <view class="reward-grid">
          <view class="reward-item-css">
            <image src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-weapon.png.png" mode="aspectFit" />
            <text class="item-name">降妖宝杖</text>
          </view>
          <view class="reward-item-css">
            <image src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-necklace.png.png" mode="aspectFit" />
            <text class="item-name">骷髅项链</text>
          </view>
          <view class="reward-item-css">
            <image src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-robe.png.png" mode="aspectFit" />
            <text class="item-name">罗汉僧袍</text>
          </view>
          <view class="reward-item-css">
            <image src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-shoes.png.png" mode="aspectFit" />
            <text class="item-name">罗汉草鞋</text>
          </view>
        </view>
        
        <button class="confirm-btn-css" @click="goBack">收入影箱，继续征途</button>
      </view>
    </view>
    
    <view class="trap-flash" :class="{ active: isShaking }"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;
const screenWidth = uni.getSystemInfoSync().windowWidth;
const screenHeight = uni.getSystemInfoSync().windowHeight;

// --- Assets Mapping ---
const ASSETS = {
  // Sprites
  WUKONG_POINT: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-point.png.png',
  WUKONG_PROBE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-probe.png.png',
  WUKONG_PROUD: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-proud.png.png',
  BAJIE_ARROGANT: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-bajie-arrogant.png.png',
  SHASENG_FIERCE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-shaseng-fierce.png.png',
  SHASENG_BOW: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-shaseng-bow.png.png',
  
  // Items (Sha Seng Parts)
  WEAPON: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-weapon.png.png',
  NECKLACE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-necklace.png.png',
  ROBE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-robe.png.png',
  SHOES: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-shaseng-shoes.png.png',
  
  // Traps
  TRAP_CRAB: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-trap-crab.png.png',
  TRAP_STONE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-trap-stone.png.png',
};

// --- Game Logic: Items & Bubbles ---
const targetItems = [
  { id: 'weapon', src: ASSETS.WEAPON },
  { id: 'necklace', src: ASSETS.NECKLACE },
  { id: 'robe', src: ASSETS.ROBE },
  { id: 'shoes', src: ASSETS.SHOES },
];
const collectedIds = ref(new Set());
const bubbles = ref([]);
const isShaking = ref(false);
let gameLoopTimer = null;
let spawnTimer = null;

// --- Story Scripts ---
const gameStage = ref('intro'); // intro -> playing -> outro -> finished

const scripts = {
  intro: [
    { name: '孙悟空', text: '（探头）这里的弱水好生厉害，连根鹅毛都浮不起来...', sprite: ASSETS.WUKONG_PROBE, position: 'left' },
    { name: '猪八戒', text: '嘿！水里有个黑大汉，正瞪着咱们呢！', sprite: ASSETS.BAJIE_ARROGANT, position: 'right' },
    { name: '沙僧', text: '（河底怒吼）留下人头做我的项链！', sprite: null, position: 'right' },
    { name: '孙悟空', text: '呆子别吹牛了！点灯人，快戳破气泡，收了他的法宝！', sprite: ASSETS.WUKONG_POINT, position: 'left' },
  ],
  outro: [
    { name: '沙僧', text: '哇呀呀！是谁收了俺的宝杖？', sprite: ASSETS.SHASENG_FIERCE, position: 'right' },
    { name: '孙悟空', text: '正是你孙外公！', sprite: ASSETS.WUKONG_PROUD, position: 'left' },
    { name: '沙僧', text: '啊？莫非是取经人？恕罪恕罪！', sprite: ASSETS.SHASENG_BOW, position: 'right' },
  ]
};

// --- Dialog System (Reused Logic) ---
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
    setTimeout(() => { isSpriteChanging.value = false; }, 50);
  }
});

const typeWriter = (text) => {
  if (!text) return;
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
    if (gameStage.value === 'intro') startGame();
    if (gameStage.value === 'outro') finishGame();
  }
};

const skipStory = () => {
  if (gameStage.value === 'intro') startGame();
  if (gameStage.value === 'outro') finishGame();
};

onMounted(() => {
  typeWriter(currentLine.value.text);
});

onUnmounted(() => {
  stopGameLoop();
});

// --- Game Loop ---
const collectedCount = computed(() => collectedIds.value.size);
const isCollected = (id) => collectedIds.value.has(id);

const startGame = () => {
  gameStage.value = 'playing';
  collectedIds.value.clear();
  bubbles.value = [];
  
  // Start Spawning
  spawnTimer = setInterval(spawnBubble, 800);
  
  // Start Moving
  gameLoopTimer = setInterval(updateBubbles, 50);
};

const stopGameLoop = () => {
  clearInterval(spawnTimer);
  clearInterval(gameLoopTimer);
};

const spawnBubble = () => {
  // Determine Type: Target or Trap?
  // We need to prioritize spawning uncollected targets
  const uncollected = targetItems.filter(item => !collectedIds.value.has(item.id));
  
  let type = 'trap';
  let contentSrc = '';
  let contentId = '';
  
  // 40% chance to spawn a target if needed
  if (uncollected.length > 0 && Math.random() < 0.4) {
    type = 'target';
    const target = uncollected[Math.floor(Math.random() * uncollected.length)];
    contentSrc = target.src;
    contentId = target.id;
  } else {
    // Spawn Trap
    type = 'trap';
    contentSrc = Math.random() > 0.5 ? ASSETS.TRAP_CRAB : ASSETS.TRAP_STONE;
  }
  
  bubbles.value.push({
    id: Date.now() + Math.random(),
    x: Math.random() * (screenWidth - 80) + 10, // Padding
    y: -100, // Start below screen
    speed: 2 + Math.random() * 3,
    type,
    contentSrc,
    contentId
  });
};

const updateBubbles = () => {
  for (let i = bubbles.value.length - 1; i >= 0; i--) {
    const b = bubbles.value[i];
    b.y += b.speed;
    
    // Remove if off screen
    if (b.y > screenHeight + 100) {
      bubbles.value.splice(i, 1);
    }
  }
};

const onBubbleClick = (bubble) => {
  if (bubble.type === 'target') {
    // Collect Item
    if (!collectedIds.value.has(bubble.contentId)) {
      collectedIds.value.add(bubble.contentId);
      uni.showToast({ title: '捕获成功!', icon: 'success', duration: 500 });
      
      // Check Win
      if (collectedIds.value.size === 4) {
        onWin();
      }
    }
  } else {
    // Trap Trigger
    triggerShake();
    uni.vibrateLong();
  }
  
  // Remove bubble after click
  const index = bubbles.value.findIndex(b => b.id === bubble.id);
  if (index !== -1) bubbles.value.splice(index, 1);
};

const triggerShake = () => {
  isShaking.value = true;
  setTimeout(() => { isShaking.value = false; }, 500);
};

const onWin = () => {
  stopGameLoop();
  setTimeout(() => {
    gameStage.value = 'outro';
    dialogIndex.value = 0;
    typeWriter(scripts.outro[0].text);
  }, 1000);
};

const finishGame = () => {
  gameStage.value = 'finished';
  // Save progress
  const clearedIds = uni.getStorageSync('WUKONG_CLEARED_IDS') || [];
  if (!clearedIds.includes('shaseng')) {
    clearedIds.push('shaseng');
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

/* Shake Effect */
.shake-screen {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-8px, 0, 0); }
  40%, 60% { transform: translate3d(8px, 0, 0); }
}

.trap-flash {
  position: absolute; inset: 0; background: rgba(255, 0, 0, 0.3);
  opacity: 0; pointer-events: none; z-index: 200;
  transition: opacity 0.1s;
  &.active { opacity: 1; }
}

.bg-scene {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
  opacity: 0.4;
}

/* --- Game Area --- */
.game-area {
  position: absolute; inset: 0; z-index: 10;
}

.bubble-item {
  position: absolute; width: 80px; height: 80px;
}

.bubble-wrapper {
  width: 100%; height: 100%; position: relative;
  animation: floatWiggle 2s ease-in-out infinite alternate;
}

@keyframes floatWiggle {
  from { transform: translateX(-5px); }
  to { transform: translateX(5px); }
}

.bubble-bg {
  position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.8;
}

.bubble-content {
  position: absolute; top: 15%; left: 15%; width: 70%; height: 70%;
  z-index: 2;
}

/* --- HUD --- */
.progress-hud {
  position: absolute; top: 100px; right: 20px;
  background: rgba(0,0,0,0.6);
  padding: 10px; border-radius: 12px;
  border: 1px solid rgba(255,215,0,0.3);
  z-index: 50;
}

.hud-title {
  color: #FFD700; font-size: 12px; margin-bottom: 5px; text-align: center;
}

.hud-slots {
  display: flex; gap: 5px;
}

.slot-item {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  border: 1px dashed rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  
  &.collected {
    border: 1px solid #FFD700;
    background: rgba(255,215,0,0.1);
  }
  
  image { width: 80%; height: 80%; }
}

/* --- Dialog UI (Pure CSS Upgrade) --- */
.dialog-layer {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
  z-index: 100; pointer-events: auto;
}

.sprite-stage {
  position: absolute; bottom: 120px; left: 0; width: 100%; height: 400px;
  pointer-events: none; z-index: 90; overflow: hidden;
}

.char-sprite {
  position: absolute; bottom: 0; height: 250px; transition: all 0.3s ease-out;
  
  &.pos-left { left: -10px; animation: slideInLeft 0.4s forwards; }
  &.pos-right { right: -0px; animation: slideInRight 0.4s forwards; }
  &.fade-out { opacity: 0; transform: scale(0.95); }
  &.fade-in { opacity: 1; transform: scale(1); }
}

@keyframes slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

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

/* --- NavBar --- */
.nav-bar {
  position: absolute; top: 0; left: 0; width: 100%; z-index: 200; padding-left: 20px;
  .back-btn {
    color: rgba(255,255,255,0.8); font-size: 14px;
    background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px;
    display: inline-block;
  }
}

/* =========================================
   ✨ 5. 结算弹窗 (CSS 纯享版)
   适配缺失图片，保持 Level 3 的灵匣开启效果
========================================= */
.victory-modal {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center;
  padding: 20px; perspective: 1000px;
}
.modal-mask {
  position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
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

.reward-grid {
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