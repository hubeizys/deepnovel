<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  HomeFilled,
  UserFilled,
  Monitor,
  DocumentCopy,
  Edit
} from '@element-plus/icons-vue';

const router = useRouter()
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
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
}

.el-aside {
  background-color: #304156;
  color: #fff;
}

.el-menu-vertical {
  border-right: none;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  color: #303133;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>