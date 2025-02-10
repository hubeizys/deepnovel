<template>
  <div class="chat-container">
    <!-- API Key 设置 -->
    <div class="settings-panel" v-if="showSettings">
      <div class="settings-content">
        <h3>设置</h3>
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
        <button @click="saveSettings" class="primary-button">保存设置</button>
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
import { onMounted, ref } from 'vue'
import { useChatApiStore } from '../stores/chatApi'
import type { ChatResponse } from '../types/chatResponse'
const apiKey = ref('')
const temperature = ref(1.3)
const showSettings = ref(false)
const currentMessage = ref('')
const messages = ref<Array<{role: string, content: string, timestamp: number, type?: string, 
  metadata?: {confidence: number, sources?: string[], tags?: string[]}}>>([])
const loading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const chatApiStore = useChatApiStore()

// 从localStorage加载设置和历史记录
onMounted(async () => {
  try {
    const savedMessages = localStorage.getItem('chat_history')
    if (savedMessages) {
      messages.value = JSON.parse(savedMessages)
    }
    
    chatApiStore.loadSettings()
    apiKey.value = chatApiStore.apiKey
    temperature.value = chatApiStore.temperature
  } catch (error) {
    console.error('Failed to load settings:', error)
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
  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: Date.now()
  })

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

    messages.value.push({
      role: 'assistant',
      content: parsedResponse.content,
      timestamp: Date.now(),
      type: parsedResponse.type,
      metadata: parsedResponse.metadata
    })
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
/* ... existing styles ... */

.message-code {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', Courier, monospace;
}

.message-suggestion {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #28a745;
}

.suggestion-sources {
  margin-top: 0.5rem;
  font-size: 0.9em;
  color: #666;
}

.sources-title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.message-tags {
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8em;
}

.confidence {
  background-color: #28a745;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8em;
  margin-left: 0.5rem;
}

/* ... rest of existing styles ... */
</style> 