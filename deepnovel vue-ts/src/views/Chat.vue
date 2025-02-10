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
          </div>
          <div class="message-text">{{ message.content }}</div>
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
const apiKey = ref('')
const temperature = ref(1.3)
const showSettings = ref(false)
const currentMessage = ref('')
const messages = ref<Array<{role: string, content: string, timestamp: number}>>([])
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

    messages.value.push({
      role: 'assistant',
      content: response.content || '',
      timestamp: Date.now()
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
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.settings-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.input-group {
  margin: 1rem 0;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
  max-width: 80%;
}

.user-message {
  margin-left: auto;
}

.assistant-message {
  margin-right: auto;
}

.message-content {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-message .message-content {
  background-color: #007AFF;
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.input-container {
  padding: 1rem;
  background-color: #fff;
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  resize: none;
}

.send-button {
  padding: 0.5rem 1rem;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.typing-indicator {
  display: flex;
  gap: 0.3rem;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: #007AFF;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

.primary-button {
  background-color: #007AFF;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
}
</style> 