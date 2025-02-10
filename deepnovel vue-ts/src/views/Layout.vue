<script setup lang="ts">
import {
  ChatDotRound,
  DocumentCopy,
  Edit,
  HomeFilled,
  Monitor,
  UserFilled
} from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="enum-aside">
      <el-menu :router="true" class="el-menu-vertical" :default-active="router.currentRoute.value.path">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/character">
          <el-icon><UserFilled /></el-icon>
          <span>角色生成器</span>
        </el-menu-item>
        <el-menu-item index="/world">
          <el-icon><Monitor /></el-icon>
          <span>世界观构建</span>
        </el-menu-item>
        <el-menu-item index="/plot">
          <el-icon><DocumentCopy /></el-icon>
          <span>情节大纲</span>
        </el-menu-item>
        <el-menu-item index="/scene">
          <el-icon><Edit /></el-icon>
          <span>场景生成</span>
        </el-menu-item>
        <el-menu-item index="/chat">
          <el-icon><ChatDotRound /></el-icon>
          <span>AI 助手</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header height="60px">
        <div class="header-content">
          <h2>DeepNovel - AI 辅助小说创作平台</h2>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: var(--bg-secondary);

}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.enum-aside {
  margin-right:2em !important; 

}

.el-aside {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  margin: 1rem 0 1rem 1rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 0.3s ease;
}

.el-menu-vertical {
  border-right: none;
  background-color: transparent;
}

.el-menu-vertical :deep(.el-menu-item) {
  border-radius: var(--radius-md);
  margin: 0.5rem;
  height: 50px;
  line-height: 50px;
  transition: all 0.3s ease;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background-color: var(--primary-color) !important;
  color: white !important;
}

.el-menu-vertical :deep(.el-menu-item:hover) {
  background-color: var(--primary-hover);
  color: white;
  transform: translateX(4px);
}

.el-header {
  background-color: var(--bg-primary);
  margin: 1rem 1rem 0.5rem 0;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.header-content h2 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
  background: linear-gradient(120deg, var(--primary-color), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.el-main {
  background-color: var(--bg-primary);
  padding: 1.5rem;
  margin: 0.5rem 1rem 1rem 0;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .el-menu-vertical :deep(.el-menu-item) {
    color: var(--text-primary);
  }
  
  .el-menu-vertical :deep(.el-menu-item):not(.is-active):hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>