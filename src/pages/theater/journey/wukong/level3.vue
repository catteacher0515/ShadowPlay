<template>
  <view class="level-container">
    <!-- 1. Background -->
    <image 
      class="bg-scene" 
      src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/bg-scene-kingdom.jpg.jpg" 
      mode="aspectFill" 
    />
    
    <!-- 2. Game Area (Drag & Align) -->
    <view class="game-area" v-if="gameStage === 'playing' || gameStage === 'outro' || gameStage === 'finished'">
      <!-- Target: Shadow Body (Fixed) -->
      <view class="target-body" id="target-body">
        <image 
          v-if="!isSuccess"
          class="shadow-img" 
          src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-shadow.png.png" 
          mode="aspectFit" 
        />
        <!-- Success State: Real Body -->
        <image 
          v-else
          class="real-img animate-shine" 
          src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-pray.png.png" 
          mode="aspectFit" 
        />
      </view>

      <!-- Draggable: Soul (Moving) -->
      <view 
        v-if="!isSuccess"
        class="soul-sprite"
        :style="{ 
          left: soulX + 'px', 
          top: soulY + 'px',
          opacity: isDragging ? 1 : 0.7
        }"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
         <image src="https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-soul.png.png" mode="aspectFit" />
         <view class="drag-hint" v-if="!isDragging">拖拽归位</view>
      </view>
    </view>

    <!-- 3. Dialog Layer (Pure CSS Style) -->
    <view class="dialog-layer" v-if="showDialog" @click="nextDialog">
      
      <!-- Character Sprite Layer -->
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

      <!-- Skip Button (Pure CSS) -->
      <view class="btn-skip-css" @click.stop="skipStory">
        <text>跳过</text>
      </view>

      <!-- Dialog Box (Pure CSS) -->
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
    
    <!-- 4. Victory Modal (Pure CSS Style) -->
    <view v-if="gameStage === 'finished'" class="victory-modal">
      <view class="victory-content-css">
        <view class="modal-border-inner"></view>
        <text class="victory-title">功德圆满</text>
        <text class="victory-desc">已集齐【唐三藏】真身组件</text>
        
        <view class="reward-grid">
           <view v-for="item in rewardItems" :key="item.id" class="reward-item-css">
             <image :src="item.src" mode="aspectFit" />
             <text class="item-name">{{ item.name }}</text>
           </view>
        </view>

        <button class="confirm-btn-css" @click="goBack">归队</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch, nextTick } from 'vue';

const safeAreaTop = uni.getSystemInfoSync().statusBarHeight || 20;
const screenWidth = uni.getSystemInfoSync().windowWidth;
const screenHeight = uni.getSystemInfoSync().windowHeight;

// --- Assets Mapping (Strict) ---
const ASSETS = {
  // Tang Seng
  TS_SHADOW: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-shadow.png.png',
  TS_SOUL: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-soul.png.png',
  TS_PRAY: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-tangseng-pray.png.png',
  
  // Wukong
  WUKONG_PROBE: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-probe.png.png',
  WUKONG_POINT: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-point.png.png',
  WUKONG_PROUD: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-wukong-proud.png.png',
  
  // Bajie
  BAJIE_POINT: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/sprite-bajie-arrogant.png.png',
  
  // Rewards
  REWARD_BODY: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-tangseng-body.png.png',
  REWARD_HAND: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-tangseng-hand.png.png',
  REWARD_HEAD: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-tangseng-head.png.png',
  REWARD_LEG: 'https://636c-cloud1-8gizllp3a0666dde-1400097024.tcb.qcloud.la/images/theater/journey/wukong/icon-tangseng-leg.png.png',
};

const rewardItems = [
  { id: 'body', name: '锦襕袈裟', src: ASSETS.REWARD_BODY },
  { id: 'hand', name: '九环锡杖', src: ASSETS.REWARD_HAND },
  { id: 'head', name: '紫金钵盂', src: ASSETS.REWARD_HEAD },
  { id: 'leg', name: '通关文牒', src: ASSETS.REWARD_LEG },
];

// --- Game Logic ---
const gameStage = ref('intro'); // intro -> playing -> outro -> finished
const isSuccess = ref(false);

// Dragging State
const soulX = ref(50); // Initial random pos
const soulY = ref(150);
const isDragging = ref(false);
const targetRect = ref({ x: 0, y: 0, width: 0, height: 0 });

// Capture the instance early
const instance = getCurrentInstance();

// Story Scripts
const scripts = {
  intro: [
    { name: '孙悟空', text: '师父坐那半天不理人，俺老孙看着不对劲！', sprite: ASSETS.WUKONG_PROBE, position: 'left' },
    { name: '猪八戒', text: '嘿嘿，师父怕是乐不思蜀，不想去西天咯！', sprite: ASSETS.BAJIE_POINT, position: 'right' },
    { name: '唐僧(魂)', text: '（虚弱）贫僧... 这是在哪里？为何身子好沉...', sprite: ASSETS.TS_SOUL, position: 'right' },
    { name: '孙悟空', text: '呔！师父这是魂离了窍！点灯人，快把师父元神按回去！', sprite: ASSETS.WUKONG_POINT, position: 'left' },
  ],
  outro: [
    { name: '唐僧', text: '阿弥陀佛... 刚才仿佛做了一场大梦。', sprite: ASSETS.TS_PRAY, position: 'right' },
    { name: '孙悟空', text: '师父，这就叫“色即是空”！赶路要紧！', sprite: ASSETS.WUKONG_PROUD, position: 'left' },
    { name: '唐僧', text: '悟空说得是。女王深情，只能来世再报了... 上路吧。', sprite: ASSETS.TS_PRAY, position: 'right' },
  ]
};

// --- Dialog System ---
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
  
  // Set initial random position for Soul
  soulX.value = screenWidth * 0.1; 
  soulY.value = screenHeight * 0.3;
});

// --- Game Loop: Drag & Align ---
const startGame = () => {
  gameStage.value = 'playing';
  
  // Use nextTick to ensure the DOM is updated before querying
  nextTick(() => {
    setTimeout(() => {
      // FIX: Use the cached 'instance' variable, not getCurrentInstance() inside callback
      const query = uni.createSelectorQuery().in(instance);
      query.select('#target-body').boundingClientRect(data => {
        if (data) {
          console.log('Target Rect:', data);
          targetRect.value = data;
        } else {
          console.error('Failed to get target rect');
        }
      }).exec();
    }, 200); // Give it a bit more time to render
  });
};

let startTouchX = 0, startTouchY = 0;
let initialSoulX = 0, initialSoulY = 0;

const touchStart = (e) => {
  isDragging.value = true;
  const touch = e.touches[0];
  startTouchX = touch.clientX;
  startTouchY = touch.clientY;
  initialSoulX = soulX.value;
  initialSoulY = soulY.value;
};

const touchMove = (e) => {
  if (!isDragging.value || isSuccess.value) return;
  const touch = e.touches[0];
  const dx = touch.clientX - startTouchX;
  const dy = touch.clientY - startTouchY;
  
  // Directly update position for smooth dragging
  soulX.value = initialSoulX + dx;
  soulY.value = initialSoulY + dy;
};

const touchEnd = () => {
  isDragging.value = false;
  checkAlignment();
};

const checkAlignment = () => {
  if (isSuccess.value) return;

  // Calculate Centers
  // Soul sprite size is roughly 240px wide x 360px high based on CSS
  const soulWidth = 240; 
  const soulHeight = 360;
  
  const soulCenterX = soulX.value + soulWidth / 2;
  const soulCenterY = soulY.value + soulHeight / 2;
  
  const targetCenterX = targetRect.value.left + targetRect.value.width / 2;
  const targetCenterY = targetRect.value.top + targetRect.value.height / 2;
  
  const distance = Math.sqrt(
    Math.pow(soulCenterX - targetCenterX, 2) + 
    Math.pow(soulCenterY - targetCenterY, 2)
  );

  console.log('Distance:', distance);

  // Threshold: 50px
  if (distance < 50) {
    onAlignSuccess();
  }
};

const onAlignSuccess = () => {
  isSuccess.value = true;
  
  // Snap to target position visually
  soulX.value = targetRect.value.left;
  soulY.value = targetRect.value.top;
  
  uni.vibrateLong();
  uni.showToast({ title: '魂魄归位！', icon: 'success' });
  
  setTimeout(() => {
    gameStage.value = 'outro';
    dialogIndex.value = 0;
    typeWriter(scripts.outro[0].text);
  }, 1500);
};

const finishGame = () => {
  gameStage.value = 'finished';
  // Save progress
  const clearedIds = uni.getStorageSync('WUKONG_CLEARED_IDS') || [];
  if (!clearedIds.includes('tangseng')) {
    clearedIds.push('tangseng');
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

.bg-scene {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
  opacity: 0.4; /* Strict Requirement */
}

/* --- Game Area --- */
.game-area {
  position: absolute; inset: 0; z-index: 10;
}

.target-body {
  position: absolute; 
  top: 50%; left: 50%; transform: translate(-50%, -40%);
  width: 240px; height: 360px;
  z-index: 5;
  
  .shadow-img { width: 100%; height: 100%; opacity: 0.8; }
  .real-img { width: 100%; height: 100%; }
}

.soul-sprite {
  position: absolute; 
  width: 240px; height: 360px;
  z-index: 20;
  
  image { width: 100%; height: 100%; opacity: 0.8; filter: drop-shadow(0 0 10px gold); }
}

.drag-hint {
  position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  color: #FFD700; font-size: 14px; background: rgba(0,0,0,0.5);
  padding: 4px 10px; border-radius: 12px; pointer-events: none;
}

.animate-shine {
  animation: shine 1.5s ease-out;
}

@keyframes shine {
  0% { filter: brightness(3) blur(10px); opacity: 0; }
  50% { filter: brightness(2) blur(5px); opacity: 1; }
  100% { filter: brightness(1) blur(0); opacity: 1; }
}

/* --- Pure CSS Dialog UI --- */
.dialog-layer {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
  z-index: 100; pointer-events: auto;
}

.sprite-stage {
  position: absolute; bottom: 160px; left: 0; width: 100%; height: 400px;
  pointer-events: none; z-index: 90; overflow: hidden;
}

.char-sprite {
  position: absolute; bottom: 0; 
  height: 240px; /* Strict Requirement */
  transition: all 0.3s ease-out;
  &.pos-left { left: 20px; animation: slideInLeft 0.4s forwards; }
  &.pos-right { right: 20px; animation: slideInRight 0.4s forwards; }
  &.fade-out { opacity: 0; transform: scale(0.95); }
  &.fade-in { opacity: 1; transform: scale(1); }
}
@keyframes slideInLeft { from { transform: translateX(-50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

.btn-skip-css {
  position: absolute; top: 60px; right: 20px;
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.3);
  color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 14px; z-index: 102;
}

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

/* --- Pure CSS Victory Modal --- */
.victory-modal {
  position: absolute; inset: 0; background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center; z-index: 300;
}

.victory-content-css {
  width: 80%; background: #2C1608;
  border: 2px solid #FFD700; border-radius: 12px;
  padding: 30px 20px;
  display: flex; flex-direction: column; align-items: center;
  position: relative;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
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
  display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;
}

.reward-item-css {
  display: flex; flex-direction: column; align-items: center;
  
  image { 
    width: 50px; height: 50px; margin-bottom: 5px; 
    background: rgba(0,0,0,0.3); border-radius: 8px; border: 1px solid #5D4037;
  }
  .item-name { color: #D7CCC8; font-size: 12px; }
}

.confirm-btn-css {
  background: linear-gradient(to bottom, #FFD700, #FFA000);
  color: #3E2723; font-weight: bold; border-radius: 25px;
  padding: 0 40px; box-shadow: 0 4px 10px rgba(255, 160, 0, 0.4);
  border: none;
}
</style>