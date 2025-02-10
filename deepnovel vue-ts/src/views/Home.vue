<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { UserFilled, Monitor, DocumentCopy, Edit } from '@element-plus/icons-vue'
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
]</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col v-for="(f,i) in features" :key="i" :span="6">
        <el-card class="feature-card">
          <div class="feature-icon">
            <component 
              :is="f.icon === 'User' ? UserFilled : 
                   f.icon === 'Globe' ? Monitor :
                   f.icon === 'Files' ? DocumentCopy :
                   f.icon === 'Edit' ? Edit : undefined"
              :style="{ color: f.color, fontSize: '40px' }"
            />
          </div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.description }}</p>
          <el-button type="primary" @click="router.push(f.route)">开始使用</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}
.feature-card {
  height: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
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