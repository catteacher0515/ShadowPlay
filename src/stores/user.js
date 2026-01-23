import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    craftsmanship: 0, // 匠心值
    unlockProgress: {
      workshop: false,
      theater: false
    }
  }),
  actions: {
    addCraftsmanship(value) {
      this.craftsmanship += value
    }
  }
})