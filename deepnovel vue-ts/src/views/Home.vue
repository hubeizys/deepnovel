<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(feature, index) in features" :key="index">
        <el-card class="feature-card" :body-style="{ padding: '20px' }">
          <div class="feature-icon">
            <el-icon :size="40" :color="feature.color">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <el-button type="primary" @click="navigateTo(feature.route)">
            开始使用
          </el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const features = [
  {
    title: '角色生成器',
    description: '输入关键词，AI 帮你生成完整的角色设定，包括背景、性格、外貌等。',
    icon: 'User',
    color: '#409EFF',
    route: '/character'
  },
  {
    title: '世界观构建',
    description: '通过问答形式，帮助你构建完整的世界观，包括地理、历史、文化等。',
    icon: 'Globe',
    color: '#67C23A',
    route: '/world'
  },
  {
    title: '情节大纲',
    description: '基于经典故事结构模板，帮助你规划小说的主线剧情和重要转折。',
    icon: 'Files',
    color: '#E6A23C',
    route: '/plot'
  },
  {
    title: '场景生成',
    description: '根据上下文智能续写或扩写场景描写和对话内容。',
    icon: 'Edit',
    color: '#F56C6C',
    route: '/scene'
  }
]

const navigateTo = (route: string) => {
  router.push(route)
}
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.feature-card {
  height: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.feature-icon {
  margin-bottom: 20px;
}

.feature-card h3 {
  margin: 10px 0;
  color: #303133;
}

.feature-card p {
  color: #606266;
  margin-bottom: 20px;
  min-height: 60px;
}
</style> 