import { app, ipcMain } from 'electron'
import * as fs from 'fs'
import OpenAI from 'openai'
import * as path from 'path'

// 配置文件路径
const CONFIG_PATH = path.join(app.getPath('userData'), 'chat-config.json')

interface ChatConfig {
  apiKey: string
  temperature: number
}

// 读取配置
function loadConfig(): ChatConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
      return config
    }
  } catch (error) {
    console.error('Error loading config:', error)
  }
  return { apiKey: '', temperature: 1.3 }
}

// 保存配置
function saveConfig(config: ChatConfig) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config))
    return true
  } catch (error) {
    console.error('Error saving config:', error)
    return false
  }
}

let openaiInstance: OpenAI | null = null

// 初始化OpenAI客户端
function initOpenAI(apiKey: string) {
  openaiInstance = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  })
}

// 设置IPC处理程序
export function setupChatHandlers() {
  // 加载配置
  const config = loadConfig()
  if (config.apiKey) {
    initOpenAI(config.apiKey)
  }

  // 保存设置
  ipcMain.handle('save-chat-settings', async (_, settings: ChatConfig) => {
    const success = saveConfig(settings)
    if (success) {
      initOpenAI(settings.apiKey)
    }
    return success
  })

  // 获取设置
  ipcMain.handle('get-chat-settings', async () => {
    return loadConfig()
  })

  // 处理聊天请求
  ipcMain.handle('send-chat-message', async (_, { messages, temperature }) => {
    if (!openaiInstance) {
      throw new Error('API not initialized')
    }

    try {
      const completion = await openaiInstance.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages
        ],
        model: "deepseek-chat",
        temperature: temperature
      })

      return completion.choices[0].message
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send message')
    }
  })
}