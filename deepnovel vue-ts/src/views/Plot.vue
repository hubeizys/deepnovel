<template>
  <div class="plot-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="plot-form">
          <template #header>
            <div class="card-header">
              <h3>情节大纲生成器</h3>
            </div>
          </template>

          <el-form :model="plotForm" label-width="120px">
            <el-form-item label="故事主题">
              <el-input
                v-model="plotForm.theme"
                placeholder="例如：复仇、成长、爱情..."
              />
            </el-form-item>

            <el-form-item label="故事结构">
              <el-select v-model="plotForm.structure" placeholder="选择故事结构">
                <el-option label="三幕剧" value="three-act" />
                <el-option label="英雄之旅" value="hero-journey" />
                <el-option label="五幕剧" value="five-act" />
                <el-option label="并行叙事" value="parallel" />
              </el-select>
            </el-form-item>

            <el-form-item label="主要人物">
              <el-input
                type="textarea"
                v-model="plotForm.characters"
                placeholder="描述主要人物及其关系..."
                :rows="3"
              />
            </el-form-item>

            <el-form-item label="核心冲突">
              <el-input
                type="textarea"
                v-model="plotForm.conflict"
                placeholder="描述故事中的主要冲突..."
                :rows="3"
              />
            </el-form-item>

            <el-form-item label="故事背景">
              <el-input
                type="textarea"
                v-model="plotForm.setting"
                placeholder="描述故事发生的时间、地点和社会背景..."
                :rows="3"
              />
            </el-form-item>

            <el-form-item label="结局倾向">
              <el-radio-group v-model="plotForm.ending">
                <el-radio label="happy">圆满结局</el-radio>
                <el-radio label="tragic">悲剧结局</el-radio>
                <el-radio label="open">开放结局</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generatePlot" :loading="loading">
                生成大纲
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="plotOutline" class="plot-result">
          <template #header>
            <div class="card-header">
              <h3>故事大纲</h3>
              <div class="header-actions">
                <el-button type="primary" text @click="savePlot">
                  保存大纲
                </el-button>
                <el-button type="primary" text @click="regeneratePlot">
                  重新生成
                </el-button>
              </div>
            </div>
          </template>

          <el-scrollbar height="600px">
            <div class="plot-outline">
              <div v-for="(act, index) in plotOutline.acts" :key="index" class="plot-act">
                <h4>{{ act.title }}</h4>
                <div class="plot-scenes">
                  <div v-for="(scene, sceneIndex) in act.scenes" :key="sceneIndex" class="plot-scene">
                    <h5>场景 {{ sceneIndex + 1 }}</h5>
                    <p>{{ scene.description }}</p>
                    <div class="scene-elements" v-if="scene.elements">
                      <el-tag v-if="scene.elements.characters">人物：{{ scene.elements.characters }}</el-tag>
                      <el-tag v-if="scene.elements.location" type="success">地点：{{ scene.elements.location }}</el-tag>
                      <el-tag v-if="scene.elements.conflict" type="warning">冲突：{{ scene.elements.conflict }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

interface PlotForm {
  theme: string
  structure: string
  characters: string
  conflict: string
  setting: string
  ending: string
}

interface Scene {
  description: string
  elements?: {
    characters?: string
    location?: string
    conflict?: string
  }
}

interface Act {
  title: string
  scenes: Scene[]
}

interface PlotOutline {
  acts: Act[]
}

const plotForm = reactive<PlotForm>({
  theme: '',
  structure: '',
  characters: '',
  conflict: '',
  setting: '',
  ending: 'happy'
})

const loading = ref(false)
const plotOutline = ref<PlotOutline | null>(null)

const generatePlot = async () => {
  if (!plotForm.theme || !plotForm.structure) {
    ElMessage.warning('请至少填写故事主题和结构')
    return
  }

  loading.value = true
  try {
    // TODO: 调用 AI API 生成情节大纲
    // 这里使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1500))
    plotOutline.value = {
      acts: [
        {
          title: '第一幕：起源',
          scenes: [
            {
              description: '年轻的魔法学徒艾莉在一次意外中发现了一本神秘的魔法书，书中记载着一个远古预言。',
              elements: {
                characters: '艾莉',
                location: '魔法学院图书馆',
                conflict: '神秘预言的发现'
              }
            },
            {
              description: '艾莉试图解读预言内容，但引来了学院高层的注意，她被警告要远离这个秘密。',
              elements: {
                characters: '艾莉、学院长老',
                location: '长老会议室',
                conflict: '权威与真相的对抗'
              }
            }
          ]
        },
        {
          title: '第二幕：冲突',
          scenes: [
            {
              description: '艾莉发现预言与一系列神秘失踪事件有关，她决定私下调查。',
              elements: {
                characters: '艾莉、失踪的学生',
                location: '魔法学院',
                conflict: '调查与隐瞒'
              }
            },
            {
              description: '调查过程中，艾莉结识了同样对真相着迷的同学托马斯，两人决定合作。',
              elements: {
                characters: '艾莉、托马斯',
                location: '学院花园',
                conflict: '信任与合作'
              }
            }
          ]
        },
        {
          title: '第三幕：高潮',
          scenes: [
            {
              description: '艾莉和托马斯发现学院高层一直在利用失踪的学生进行禁忌魔法实验。',
              elements: {
                characters: '艾莉、托马斯、学院高层',
                location: '地下实验室',
                conflict: '真相大白'
              }
            },
            {
              description: '在一场激烈的对抗后，艾莉和托马斯成功阻止了实验，解救了被困的学生。',
              elements: {
                characters: '全体主要人物',
                location: '魔法学院大厅',
                conflict: '正义与邪恶的终极对决'
              }
            }
          ]
        }
      ]
    }
    ElMessage.success('大纲生成成功')
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    loading.value = false
  }
}

const regeneratePlot = () => {
  generatePlot()
}

const savePlot = () => {
  // TODO: 保存大纲到本地或数据库
  ElMessage.success('大纲保存成功')
}
</script>

<style scoped>
.plot-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.plot-act {
  margin-bottom: 30px;
}

.plot-act h4 {
  color: #409EFF;
  margin-bottom: 15px;
}

.plot-scene {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.plot-scene h5 {
  color: #606266;
  margin: 0 0 10px 0;
}

.plot-scene p {
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.scene-elements {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.el-tag {
  margin-right: 8px;
}
</style> 