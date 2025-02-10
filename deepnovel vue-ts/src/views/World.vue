<template>
  <div class="world-container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="world-form">
          <template #header>
            <div class="card-header">
              <h3>世界观构建</h3>
            </div>
          </template>
          
          <el-steps :active="activeStep" finish-status="success" class="steps">
            <el-step title="基础设定" />
            <el-step title="地理环境" />
            <el-step title="文明发展" />
            <el-step title="魔法体系" />
          </el-steps>

          <!-- 基础设定 -->
          <div v-if="activeStep === 0" class="step-content">
            <el-form :model="worldForm.basic" label-width="120px">
              <el-form-item label="世界名称">
                <el-input v-model="worldForm.basic.name" placeholder="为你的世界命名" />
              </el-form-item>
              <el-form-item label="时代背景">
                <el-select v-model="worldForm.basic.era" placeholder="选择时代背景">
                  <el-option label="远古时代" value="ancient" />
                  <el-option label="中世纪" value="medieval" />
                  <el-option label="现代" value="modern" />
                  <el-option label="未来" value="future" />
                </el-select>
              </el-form-item>
              <el-form-item label="世界类型">
                <el-radio-group v-model="worldForm.basic.type">
                  <el-radio value="fantasy">奇幻</el-radio>
                  <el-radio value="scifi">科幻</el-radio>
                  <el-radio value="reality">现实</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>

          <!-- 地理环境 -->
          <div v-if="activeStep === 1" class="step-content">
            <el-form :model="worldForm.geography" label-width="120px">
              <el-form-item label="主要地形">
                <el-checkbox-group v-model="worldForm.geography.terrains">
                  <el-checkbox label="mountains">山脉</el-checkbox>
                  <el-checkbox label="forests">森林</el-checkbox>
                  <el-checkbox label="oceans">海洋</el-checkbox>
                  <el-checkbox label="deserts">沙漠</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="气候特征">
                <el-select v-model="worldForm.geography.climate" multiple placeholder="选择气候特征">
                  <el-option label="温带" value="temperate" />
                  <el-option label="热带" value="tropical" />
                  <el-option label="寒带" value="frigid" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- 文明发展 -->
          <div v-if="activeStep === 2" class="step-content">
            <el-form :model="worldForm.civilization" label-width="120px">
              <el-form-item label="社会制度">
                <el-input
                  type="textarea"
                  v-model="worldForm.civilization.system"
                  placeholder="描述这个世界的社会制度..."
                  :rows="3"
                />
              </el-form-item>
              <el-form-item label="主要种族">
                <el-input
                  type="textarea"
                  v-model="worldForm.civilization.races"
                  placeholder="描述这个世界存在的主要种族..."
                  :rows="3"
                />
              </el-form-item>
            </el-form>
          </div>

          <!-- 魔法体系 -->
          <div v-if="activeStep === 3" class="step-content">
            <el-form :model="worldForm.magic" label-width="120px">
              <el-form-item label="魔法类型">
                <el-input
                  type="textarea"
                  v-model="worldForm.magic.types"
                  placeholder="描述这个世界的魔法体系..."
                  :rows="3"
                />
              </el-form-item>
              <el-form-item label="限制条件">
                <el-input
                  type="textarea"
                  v-model="worldForm.magic.limitations"
                  placeholder="描述魔法使用的限制和代价..."
                  :rows="3"
                />
              </el-form-item>
            </el-form>
          </div>

          <div class="step-actions">
            <el-button v-if="activeStep > 0" @click="prevStep">上一步</el-button>
            <el-button
              v-if="activeStep < 3"
              type="primary"
              @click="nextStep"
            >
              下一步
            </el-button>
            <el-button
              v-else
              type="primary"
              @click="generateWorld"
              :loading="loading"
            >
              生成世界观
            </el-button>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card v-if="worldDescription" class="world-result">
          <template #header>
            <div class="card-header">
              <h3>世界观描述</h3>
              <el-button type="primary" text @click="saveWorld">
                保存设定
              </el-button>
            </div>
          </template>
          <div class="world-description">
            <el-scrollbar height="600px">
              <div v-html="worldDescription"></div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const activeStep = ref(0)
const loading = ref(false)
const worldDescription = ref('')

interface WorldForm {
  basic: {
    name: string
    era: string
    type: string
  }
  geography: {
    terrains: string[]
    climate: string[]
  }
  civilization: {
    system: string
    races: string
  }
  magic: {
    types: string
    limitations: string
  }
}

const worldForm = reactive<WorldForm>({
  basic: {
    name: '',
    era: '',
    type: 'fantasy'
  },
  geography: {
    terrains: [],
    climate: []
  },
  civilization: {
    system: '',
    races: ''
  },
  magic: {
    types: '',
    limitations: ''
  }
})

const nextStep = () => {
  if (activeStep.value < 3) {
    activeStep.value++
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

const generateWorld = async () => {
  loading.value = true
  try {
    // TODO: 调用 AI API 生成世界观
    // 这里使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1500))
    worldDescription.value = `
      <h4>阿斯特利亚世界设定</h4>
      <p>这是一个充满魔法与奇迹的中世纪奇幻世界。大陆被巍峨的山脉分割，广袤的森林和碧蓝的海洋环绕着人类的聚居地。</p>
      
      <h4>地理环境</h4>
      <p>阿斯特利亚大陆横跨温带和寒带，北部终年积雪，南部四季分明。东部沿海地区气候温和，适宜人类居住。</p>
      
      <h4>文明发展</h4>
      <p>世界由七大王国组成，每个王国都有独特的文化传统。除人类外，精灵族居住在古老的森林，矮人族在山脉中建立了庞大的地下城市。</p>
      
      <h4>魔法体系</h4>
      <p>魔法分为元素、生命、死亡和空间四大派系。施法者需要通过冥想积累魔力，每次施法都会消耗精神力。强大的魔法可能需要特定的仪式和祭品。</p>
    `
    ElMessage.success('世界观生成成功')
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    loading.value = false
  }
}

const saveWorld = () => {
  // TODO: 保存世界观设定到本地或数据库
  ElMessage.success('世界观设定保存成功')
}
</script>

<style scoped>
.world-container {
  padding: 20px;
}

.steps {
  margin-bottom: 30px;
}

.step-content {
  min-height: 300px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.world-description {
  line-height: 1.6;
}

.world-description :deep(h4) {
  color: #409EFF;
  margin-top: 20px;
  margin-bottom: 10px;
}

.world-description :deep(p) {
  margin: 10px 0;
  text-align: justify;
}
</style> 