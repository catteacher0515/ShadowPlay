// src/utils/bgm.js

class BGMManager {
  constructor() {
    this.innerAudioContext = null;
    this.isMusicOn = true; // 默认开启
  }

  // 初始化或获取实例
  getInstance() {
    if (!this.innerAudioContext) {
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.loop = true; // 默认循环
      this.innerAudioContext.volume = 0.5; // 默认音量
    }
    return this.innerAudioContext;
  }

  // 播放音乐
  play(src) {
    const ctx = this.getInstance();
    if (src && ctx.src !== src) {
      ctx.src = src; // 只有路径变了才重新加载
    }
    // 只有在开关开启时才播放
    if (this.isMusicOn) {
      ctx.play();
    }
  }

  // 暂停
  pause() {
    if (this.innerAudioContext) {
      this.innerAudioContext.pause();
    }
  }

  // 停止
  stop() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop();
    }
  }

  // 切换静音状态
  toggleMute() {
    this.isMusicOn = !this.isMusicOn;
    if (this.isMusicOn) {
      // 如果恢复开启，且有源文件，则尝试播放
      if (this.innerAudioContext && this.innerAudioContext.src) {
        this.innerAudioContext.play();
      }
    } else {
      this.pause();
    }
    return this.isMusicOn;
  }
}

// ✨ 核心修复点：使用 const 定义并导出，匹配 import { bgmManager } 的写法
export const bgmManager = new BGMManager();