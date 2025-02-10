import { openDB, type DBSchema } from 'idb'
import OpenAI from 'openai'
import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ChatSettings {
  apiKey: string
  temperature: number
}

interface ChatDBSchema extends DBSchema {
  settings: {
    key: string
    value: ChatSettings
  }
}

const DB_NAME = 'deepnovel'
const STORE_NAME = 'settings'

let openaiClient: OpenAI | null = null

export const useChatApiStore = defineStore('chatApi', () => {
  const apiKey = ref('')
  const temperature = ref(1.3)

  // 初始化数据库
  const initDB = async () => {
    return await openDB<ChatDBSchema>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
    })
  }

  // 初始化 OpenAI 客户端
  const initOpenAI = (key: string) => {
    openaiClient = new OpenAI({
      apiKey: key,
      baseURL: 'https://api.deepseek.com',
      dangerouslyAllowBrowser: true
    })
  }

  // 加载设置
  const loadSettings = async () => {
    try {
      const db = await initDB()
      const settings = await db.get(STORE_NAME, 'chatSettings')
      if (settings) {
        apiKey.value = settings.apiKey
        temperature.value = settings.temperature
        initOpenAI(settings.apiKey)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
      throw error
    }
  }

  // 保存设置
  const saveSettings = async (settings: ChatSettings) => {
    try {
      const db = await initDB()
      await db.put(STORE_NAME, settings, 'chatSettings')
      apiKey.value = settings.apiKey
      temperature.value = settings.temperature
      initOpenAI(settings.apiKey)
    } catch (error) {
      console.error('Failed to save settings:', error)
      throw error
    }
  }

  // 发送聊天消息
  const sendChatMessage = async (messages: Array<{ role: string; content: string }>) => {
    if (!openaiClient) {
      throw new Error('API 未初始化')
    }

    try {
      const completion = await openaiClient.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个有帮助的AI助手。请以JSON格式输出你的回复。
            
示例输出格式:
{
  "content": "你的回复内容",
  "type": "text|code|suggestion",
  "metadata": {
    "confidence": 0.9,
    "sources": ["可选的来源引用"],
    "tags": ["相关标签"]
  }
}`
          },
          ...messages.map(m => ({
            role: m.role as 'user' | 'assistant' | 'system',
            content: m.content
          }))
        ],
        temperature: temperature.value,
        response_format: {
          type: 'json_object'
        }
      })

      return completion.choices[0].message
    } catch (error: any) {
      throw new Error(error.message || '发送消息失败')
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