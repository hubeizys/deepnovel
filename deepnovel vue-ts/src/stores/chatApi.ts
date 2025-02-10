import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatApiStore = defineStore('chatApi', () => {
  const apiKey = ref('')
  const temperature = ref(1.3)
  const baseURL = 'http://localhost:3000'

  // 加载设置
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('chat-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      apiKey.value = settings.apiKey
      temperature.value = settings.temperature
    }
  }

  // 保存设置
  const saveSettings = (settings: { apiKey: string; temperature: number }) => {
    apiKey.value = settings.apiKey
    temperature.value = settings.temperature
    localStorage.setItem('chat-settings', JSON.stringify(settings))
  }

  // 发送聊天消息
  const sendChatMessage = async (messages: Array<{ role: string; content: string }>) => {
    try {
      const response = await axios.post(`${baseURL}/api/chat`, {
        messages,
        temperature: temperature.value
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey.value}`
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '发送消息失败')
    }
  }

  return {
    apiKey,
    temperature,
    loadSettings,
    saveSettings,
    sendChatMessage
  }
}) 