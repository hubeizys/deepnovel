import { defineStore } from 'pinia'

interface ChatSettings {
  apiKey: string
  temperature: number
}

export const useChatSettingsStore = defineStore('chatSettings', {
  state: () => ({
    apiKey: '',
    temperature: 1.3
  }),
  
  actions: {
    saveSettings(settings: ChatSettings) {
      this.apiKey = settings.apiKey
      this.temperature = settings.temperature
      // 保存到localStorage
      localStorage.setItem('chatSettings', JSON.stringify(settings))
    },
    
    loadSettings() {
      const savedSettings = localStorage.getItem('chatSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        this.apiKey = settings.apiKey
        this.temperature = settings.temperature
      }
    }
  }
}) 