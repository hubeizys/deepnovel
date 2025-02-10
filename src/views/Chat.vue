<template>
  <div class="chat-container">
    <!-- API Key 设置 -->
    <div class="settings-panel" v-if="showSettings">
      <div class="settings-content">
        <h3>设置</h3>
        <form class="settings-form" @submit.prevent="saveSettings">
          <div class="input-group">
            <label>API Key:</label>
            <input type="password" v-model="apiKey" placeholder="请输入 DeepSeek API Key" />
          </div>
          <div class="input-group">
            <label>Temperature:</label>
            <select v-model="temperature">
              <option :value="0.0">代码生成/数学解题 (0.0)</option>
              <option :value="1.0">数据抽取/分析 (1.0)</option>
              <option :value="1.3">通用对话/翻译 (1.3)</option>
              <option :value="1.5">创意类写作/诗歌创作 (1.5)</option>
            </select>
          </div>
          <button type="submit" class="primary-button">保存设置</button>
        </form>
      </div>
    </div>

    <!-- 聊天界面 -->
    <div class="chat-header">
      <h2>DeepSeek Chat</h2>
      <button @click="showSettings = !showSettings" class="icon-button">
        <i class="fas fa-cog"></i>
      </button>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" 
           :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']">
        <div class="message-content">
          <div class="message-header">
            <span class="role">{{ message.role === 'user' ? '你' : 'AI' }}</span>
            <span class="time">{{ formatTime(message.timestamp) }}</span>
            <span v-if="message.metadata?.confidence" class="confidence">
              可信度: {{ (message.metadata.confidence * 100).toFixed(0) }}%
            </span>
          </div>
          
          <!-- 文本消息 -->
          <div v-if="!message.type || message.type === 'text'" class="message-text">
            {{ message.content }}
          </div>

          <!-- 代码消息 -->
          <pre v-else-if="message.type === 'code'" class="message-code">
            <code>{{ message.content }}</code>
          </pre>

          <!-- 建议消息 -->
          <div v-else-if="message.type === 'suggestion'" class="message-suggestion">
            <div class="suggestion-content">{{ message.content }}</div>
            <div v-if="message.metadata?.sources?.length" class="suggestion-sources">
              <div class="sources-title">参考来源:</div>
              <ul>
                <li v-for="(source, idx) in message.metadata.sources" :key="idx">
                  {{ source }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 标签 -->
          <div v-if="message.metadata?.tags?.length" class="message-tags">
            <span v-for="(tag, idx) in message.metadata.tags" :key="idx" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <div class="input-container">
      <textarea 
        v-model="currentMessage" 
        @keydown.enter.prevent="sendMessage"
        placeholder="输入消息，按Enter发送..."
        rows="3"
      ></textarea>
      <button @click="sendMessage" :disabled="loading || !currentMessage.trim()" class="send-button">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { openDB, type DBSchema } from 'idb'
import { onMounted, ref } from 'vue'
import { useChatApiStore } from '../stores/chatApi'
import type { ChatResponse } from '../types/chatResponse'

interface ChatDBSchema extends DBSchema {
  messages: {
    key: string
    value: ChatMessage[]
  }
  settings: {
    key: string
    value: ChatSettings
  }
}

interface ChatSettings {
  apiKey: string
  temperature: number
}

interface ChatMessage {
  role: string
  content: string
  timestamp: number
  type?: string
  metadata?: {
    confidence: number
    sources?: string[]
    tags?: string[]
  }
}

const DB_NAME = 'deepnovel'
const MESSAGES_STORE = 'messages'
const SETTINGS_STORE = 'settings'

// 初始化数据库
async function initDB() {
  return await openDB<ChatDBSchema>(DB_NAME, 1, {
    upgrade(db) {
      // 确保创建所有需要的 store
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        db.createObjectStore(MESSAGES_STORE)
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE)
      }
    }
  })
}

// 保存消息历史
async function saveMessages(messages: ChatMessage[]) {
  const db = await initDB()
  await db.put(MESSAGES_STORE, messages, 'chatHistory')
}

// 加载消息历史
async function loadMessages() {
  const db = await initDB()
  return await db.get(MESSAGES_STORE, 'chatHistory') || []
}

const apiKey = ref('')
const temperature = ref(1.3)
const showSettings = ref(false)
const currentMessage = ref('')
const messages = ref<Array<{role: string, content: string, timestamp: number, type?: string, 
  metadata?: {confidence: number, sources?: string[], tags?: string[]}}>>([])
const loading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const chatApiStore = useChatApiStore()

// 从数据库加载设置和历史记录
onMounted(async () => {
  try {
    messages.value = await loadMessages()
    
    await chatApiStore.loadSettings()
    apiKey.value = chatApiStore.apiKey
    temperature.value = chatApiStore.temperature
  } catch (error) {
    console.error('Failed to load settings:', error)
    ElMessage.warning('设置加载失败，请重新配置API Key')
    showSettings.value = true
  }
})

// 保存设置
const saveSettings = async () => {
  if (!apiKey.value) {
    ElMessage.error('请输入API Key')
    return
  }
  
  try {
    chatApiStore.saveSettings({
      apiKey: apiKey.value,
      temperature: temperature.value
    })
    
    showSettings.value = false
    ElMessage.success('设置已保存')
  } catch (error: any) {
    ElMessage.error(error.message || '保存设置失败')
  }
}

// 发送消息
const sendMessage = async () => {
  if (!apiKey.value) {
    ElMessage.error('请先设置API Key')
    showSettings.value = true
    return
  }

  if (!currentMessage.value.trim()) return

  const userMessage = currentMessage.value
  currentMessage.value = ''
  
  const newMessage: ChatMessage = {
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  }
  
  messages.value.push(newMessage)
  await saveMessages(messages.value)

  loading.value = true

  try {
    const messageHistory = messages.value.map(m => ({
      role: m.role,
      content: m.content
    }))

    const response = await chatApiStore.sendChatMessage(messageHistory)
    
    // 解析 JSON 响应
    let parsedResponse: ChatResponse
    try {
      parsedResponse = typeof response.content === 'string' 
        ? JSON.parse(response.content)
        : response.content
    } catch (e) {
      parsedResponse = {
        content: response.content || '',
        type: 'text',
        metadata: {
          confidence: 1
        }
      }
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: parsedResponse.content,
      timestamp: Date.now(),
      type: parsedResponse.type,
      metadata: parsedResponse.metadata
    }
    
    messages.value.push(assistantMessage)
    await saveMessages(messages.value)
  } catch (error: any) {
    ElMessage.error(error.message || '发送消息失败')
  } finally {
    loading.value = false
    scrollToBottom()
  }
} 

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString()
}

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7f9;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 10;
}

.chat-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.settings-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.settings-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #2c3e50;
}

.input-group input,
.input-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  margin-bottom: 1rem;
}

.message-content {
  max-width: 80%;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-message .message-content {
  margin-left: auto;
  background-color: #007bff;
  color: white;
}

.assistant-message .message-content {
  margin-right: auto;
  background-color: #fff;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.role {
  font-weight: 600;
}

.time {
  color: #666;
}

.message-code {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
  margin: 0.5rem 0;
}

.message-suggestion {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #28a745;
  margin: 0.5rem 0;
}

.input-container {
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0056b3;
}

.send-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.primary-button:hover {
  background-color: #0056b3;
}

.icon-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.2rem;
  transition: color 0.2s;
}

.icon-button:hover {
  color: #007bff;
}

.loading {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.typing-indicator {
  display: flex;
  gap: 0.5rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #007bff;
  border-radius: 50%;
  animation: typing 1s infinite ease-in-out;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.message-tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: rgba(0,0,0,0.1);
  color: inherit;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8em;
}

.confidence {
  background-color: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8em;
}

.suggestion-sources {
  margin-top: 0.75rem;
  font-size: 0.9em;
  color: #666;
}

.sources-title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.suggestion-sources ul {
  margin: 0;
  padding-left: 1.5rem;
}

.suggestion-sources li {
  margin-bottom: 0.25rem;
}
</style> 