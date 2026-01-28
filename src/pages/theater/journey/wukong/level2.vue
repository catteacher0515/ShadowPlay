<template>
  <view class="level-container" :class="{ 'shake-screen': isShaking }">
    <image 
      class="bg-scene" 
      src="/static/images/theater/journey/wukong/bg-scene-liusha.png.png" 
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
           <image class="bubble-bg" src="/static/images/theater/journey/wukong/ui-bubble.png.png" mode="aspectFit" />
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
        <view class="box-bg-css"></view>
        
        <view class="box-header">
          <view class="header-bg-css"></view>
          <text class="header-text">灵物归位</text>
        </view>
    
        <view class="items-grid">
          <view class="item-slot slot-1">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-shaseng-weapon.png.png" mode="aspectFit" />
            <text class="item-name">降妖宝杖</text>
          </view>
          <view class="item-slot slot-2">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-shaseng-necklace.png.png" mode="aspectFit" />
            <text class="item-name">骷髅项链</text>
          </view>
          <view class="item-slot slot-3">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-shaseng-robe.png.png" mode="aspectFit" />
            <text class="item-name">罗汉僧袍</text>
          </view>
          <view class="item-slot slot-4">
            <view class="slot-glow"></view>
            <image class="item-icon" src="/static/images/theater/journey/wukong/icon-shaseng-shoes.png.png" mode="aspectFit" />
            <text class="item-name">罗汉草鞋</text>
          </view>
        </view>
    
        <text class="victory-desc">已集齐【卷帘大将】真身组件</text>
        
        <button class="confirm-btn" @click="goBack">收入影箱，继续征途</button>
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
  WUKONG_POINT: '/static/images/theater/journey/wukong/sprite-wukong-point.png.png',
  WUKONG_PROBE: '/static/images/theater/journey/wukong/sprite-wukong-probe.png.png',
  WUKONG_PROUD: '/static/images/theater/journey/wukong/sprite-wukong-proud.png.png',
  BAJIE_ARROGANT: '/static/images/theater/journey/wukong/sprite-bajie-arrogant.png.png',
  SHASENG_FIERCE: '/static/images/theater/journey/wukong/sprite-shaseng-fierce.png.png',
  SHASENG_BOW: '/static/images/theater/journey/wukong/sprite-shaseng-bow.png.png',
  
  // Items (Sha Seng Parts)
  WEAPON: '/static/images/theater/journey/wukong/icon-shaseng-weapon.png.png',
  NECKLACE: '/static/images/theater/journey/wukong/icon-shaseng-necklace.png.png',
  ROBE: '/static/images/theater/journey/wukong/icon-shaseng-robe.png.png',
  SHOES: '/static/images/theater/journey/wukong/icon-shaseng-shoes.png.png',
  
  // Traps
  TRAP_CRAB: '/static/images/theater/journey/wukong/icon-trap-crab.png.png',
  TRAP_STONE: '/static/images/theater/journey/wukong/icon-trap-stone.png.png',
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
  uni.navigateBack();
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

/* --- Dialog UI (Reused from Level 1) --- */
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

.skip-btn {
  position: absolute; top: 60px; right: 20px; width: 80px; height: 40px; z-index: 102;
  image { width: 100%; height: 100%; }
}

.dialog-box {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  width: 90%; height: 160px; z-index: 101;
}

.dialog-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }

.name-tag {
  position: absolute; top: -15px; left: 0px; width: 120px; height: 40px; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  .tag-bg { position: absolute; width: 100%; height: 100%; }
  .name-text { position: relative; color: #fff; font-weight: bold; font-size: 14px; z-index: 3; text-shadow: 0 1px 2px #000; }
}

.dialog-text {
  position: relative; z-index: 2; display: block; padding: 35px 25px 20px 25px;
  font-size: 16px; color: #fff; line-height: 1.6; text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

.next-indicator {
  position: absolute; bottom: 15px; right: 20px; color: #FFD700; animation: blink 1s infinite;
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
   适配缺失图片，保持 Level 1 的灵匣开启效果
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
.treasure-box-container {
  position: relative; width: 90%; max-width: 400px; padding: 40px 20px 30px;
  border-radius: 16px; display: flex; flex-direction: column; align-items: center;
  /* 关键：允许标题溢出 */
  overflow: visible !important;
  animation: boxPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.2s; opacity: 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
/* 盒子 CSS 背景 */
.box-bg-css {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #2c2c2c, #000);
  border: 3px solid #FFD700; border-radius: 16px; z-index: -1;
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.1);
}
/* 标题栏 (位置上调 -50px) */
.box-header {
  position: absolute; top: -50px; width: 160px; height: 50px;
  display: flex; align-items: center; justify-content: center; z-index: 10;
}
/* CSS 绘制标题背景 */
.header-bg-css {
  position: absolute; width: 100%; height: 100%;
  background: #000; border: 2px solid #FFD700; border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}
.header-text { position: relative; color: #FFD700; font-size: 20px; font-weight: bold; letter-spacing: 4px; }

.items-grid {
  position: relative; z-index: 5;
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0 25px; width: 100%;
}
.item-slot {
  position: relative; display: flex; flex-direction: column; align-items: center;
  opacity: 0; transform: translateY(30px);
}
.slot-1 { animation: itemPopUp 0.5s ease-out forwards 0.5s; }
.slot-2 { animation: itemPopUp 0.5s ease-out forwards 0.7s; }
.slot-3 { animation: itemPopUp 0.5s ease-out forwards 0.9s; }
.slot-4 { animation: itemPopUp 0.5s ease-out forwards 1.1s; }

.item-icon {
  width: 80px; height: 80px; position: relative; z-index: 2;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  animation: itemFloat 3s ease-in-out infinite alternate;
}
.slot-glow {
  position: absolute; top: 50%; left: 50%; width: 100px; height: 100px;
  transform: translate(-50%, -60%);
  background: radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%);
  z-index: 1; opacity: 0.8; animation: glowPulse 2s ease-in-out infinite alternate;
}
.item-name { margin-top: 8px; font-size: 12px; color: #FFD700; opacity: 0.9; text-shadow: 0 1px 2px #000; }
.victory-desc {
  position: relative; z-index: 5;
  color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 25px;
  text-align: center; opacity: 0; animation: fadeIn 0.5s ease-out forwards 1.3s;
}
.confirm-btn {
  position: relative; z-index: 5;
  background: linear-gradient(to bottom, #FFD700, #FFA000);
  color: #000; font-weight: bold; font-size: 16px;
  border-radius: 25px; padding: 8px 40px; border: none;
  box-shadow: 0 4px 15px rgba(255, 160, 0, 0.5);
  animation: btnPulse 2s infinite alternate;
  opacity: 0; animation: fadeIn 0.5s ease-out forwards 1.5s;
}

@keyframes fadeIn { to { opacity: 1; } }
@keyframes boxPopIn { to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes itemPopUp { to { opacity: 1; transform: translateY(0); } }
@keyframes itemFloat { from { transform: translateY(0); } to { transform: translateY(-8px); } }
@keyframes glowPulse { from { opacity: 0.5; transform: translate(-50%, -60%) scale(0.8); } to { opacity: 1; transform: translate(-50%, -60%) scale(1.1); } }
@keyframes btnPulse { from { box-shadow: 0 4px 15px rgba(255, 160, 0, 0.5); } to { box-shadow: 0 8px 25px rgba(255, 160, 0, 0.8); } }
</style>