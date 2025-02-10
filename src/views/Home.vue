<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { UserFilled, Monitor, DocumentCopy, Edit } from '@element-plus/icons-vue'
const router = useRouter()
const features = [
  {
    title: '角色生成器',
    description: '输入关键词，AI 帮你生成完整的角色设定，包括背景、性格、外貌等。',
    icon: 'User',
    color: '#6366f1',
    route: '/character'
  },
  {
    title: '世界观构建',
    description: '通过问答形式，帮助你构建完整的世界观，包括地理、历史、文化等。',
    icon: 'Globe',
    color: '#10b981',
    route: '/world'
  },
  {
    title: '情节大纲',
    description: '基于经典故事结构模板，帮助你规划小说的主线剧情和重要转折。',
    icon: 'Files',
    color: '#f59e0b',
    route: '/plot'
  },
  {
    title: '场景生成',
    description: '根据上下文智能续写或扩写场景描写和对话内容。',
    icon: 'Edit',
    color: '#ef4444',
    route: '/scene'
  }
]</script>

<template>
  <div class="home-container">
    <div class="welcome-text">
      <h1>AI 辅助小说创作平台</h1>
      <p class="subtitle">让AI助你开启创作之旅</p>
    </div>
    <el-row :gutter="24">
      <el-col v-for="(f,i) in features" :key="i" :span="6">
        <el-card class="feature-card" :body-style="{ padding: '0' }">
          <div class="feature-content">
            <div class="feature-icon" :style="{ backgroundColor: `${f.color}20` }">
              <component 
                :is="f.icon === 'User' ? UserFilled : 
                     f.icon === 'Globe' ? Monitor :
                     f.icon === 'Files' ? DocumentCopy :
                     f.icon === 'Edit' ? Edit : undefined"
                :style="{ color: f.color, fontSize: '32px' }"
              />
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.description }}</p>
            <el-button 
              class="feature-button" 
              :style="{ backgroundColor: f.color }"
              @click="router.push(f.route)"
            >开始使用</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-text {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-text h1 {
  background: linear-gradient(120deg, var(--primary-color), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.feature-card {
  height: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  box-shadow: var(--shadow-md);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.feature-content {
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-primary);
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-content h3 {
  margin: 0 0 1rem;
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1.25rem;
}

.feature-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  flex-grow: 1;
  line-height: 1.6;
}

.feature-button {
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.3s ease;
}

.feature-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
  
  .welcome-text h1 {
    font-size: 2rem;
  }
  
  :deep(.el-row) {
    margin: 0 !important;
  }
  
  :deep(.el-col) {
    padding: 0.5rem !important;
  }
}
</style>