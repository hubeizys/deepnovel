<template>
  <div class="character-container">
    <el-card class="character-form">
      <template #header>
        <div class="card-header">
          <h3>角色生成器</h3>
        </div>
      </template>
      <el-form :model="form" label-width="120px">
        <el-form-item label="角色关键词">
          <el-input
            v-model="form.keywords"
            placeholder="例如：冷酷的吸血鬼、热血的少年剑客"
          />
        </el-form-item>
        <el-form-item label="性格倾向">
          <el-select v-model="form.personality" placeholder="选择性格倾向">
            <el-option label="外向开朗" value="extrovert" />
            <el-option label="内向沉稳" value="introvert" />
            <el-option label="理性冷静" value="rational" />
            <el-option label="感性热情" value="emotional" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色身份">
          <el-input
            v-model="form.identity"
            placeholder="例如：王国骑士、商人、学生"
          />
        </el-form-item>
        <el-form-item label="创意程度">
          <el-slider v-model="form.creativity" :step="0.1" :min="0" :max="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generateCharacter" :loading="loading">
            生成角色
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="character" class="character-result">
      <template #header>
        <div class="card-header">
          <h3>生成结果</h3>
          <el-button type="primary" text @click="saveCharacter">
            保存角色
          </el-button>
        </div>
      </template>
      <div class="character-info">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="基本信息">
            {{ character.basicInfo }}
          </el-descriptions-item>
          <el-descriptions-item label="性格特征">
            {{ character.personality }}
          </el-descriptions-item>
          <el-descriptions-item label="外貌描写">
            {{ character.appearance }}
          </el-descriptions-item>
          <el-descriptions-item label="背景故事">
            {{ character.background }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

interface CharacterForm {
  keywords: string
  personality: string
  identity: string
  creativity: number
}

interface Character {
  basicInfo: string
  personality: string
  appearance: string
  background: string
}

const form = reactive<CharacterForm>({
  keywords: '',
  personality: '',
  identity: '',
  creativity: 0.7
})

const loading = ref(false)
const character = ref<Character | null>(null)

const generateCharacter = async () => {
  if (!form.keywords) {
    ElMessage.warning('请输入角色关键词')
    return
  }

  loading.value = true
  try {
    // TODO: 调用 AI API 生成角色
    // 这里使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1500))
    character.value = {
      basicInfo: '莉莎·冯·克劳德，23岁，来自古老的吸血鬼家族。',
      personality: '表面冷漠疏离，内心渴望温暖。极度自律，对血族的传统和规则有着近乎偏执的坚持。',
      appearance: '身材高挑，银白色长发，暗红色眼眸。常着黑色哥特风格礼服，举止优雅而克制。',
      background: '作为克劳德家族的继承人，从小接受严格的贵族教育。母亲在她年幼时因猎魔人袭击而亡，这段经历让她对人类既有戒备又有好奇。'
    }
    ElMessage.success('角色生成成功')
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    loading.value = false
  }
}

const saveCharacter = () => {
  if (character.value) {
    // TODO: 保存角色到本地或数据库
    ElMessage.success('角色保存成功')
  }
}
</script>

<style scoped>
.character-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.character-form,
.character-result {
  height: fit-content;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.character-info {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .character-container {
    grid-template-columns: 1fr;
  }
}
</style> 