<template>
  <div class="scene-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="scene-form">
          <template #header>
            <div class="card-header">
              <h3>场景生成器</h3>
            </div>
          </template>

          <el-form :model="sceneForm" label-width="120px">
            <el-form-item label="场景类型">
              <el-radio-group v-model="sceneForm.type">
                <el-radio label="description">环境描写</el-radio>
                <el-radio label="dialogue">对话场景</el-radio>
                <el-radio label="action">动作场景</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="场景氛围">
              <el-select v-model="sceneForm.mood" placeholder="选择场景氛围">
                <el-option label="轻松欢快" value="happy" />
                <el-option label="紧张刺激" value="tense" />
                <el-option label="悲伤压抑" value="sad" />
                <el-option label="神秘诡异" value="mysterious" />
                <el-option label="浪漫温馨" value="romantic" />
              </el-select>
            </el-form-item>

            <el-form-item label="写作风格">
              <el-select v-model="sceneForm.style" placeholder="选择写作风格">
                <el-option label="写实主义" value="realistic" />
                <el-option label="魔幻现实" value="magical" />
                <el-option label="意识流" value="stream" />
                <el-option label="武侠风格" value="wuxia" />
                <el-option label="科幻风格" value="scifi" />
              </el-select>
            </el-form-item>

            <el-form-item label="场景要素">
              <el-input
                type="textarea"
                v-model="sceneForm.elements"
                placeholder="描述场景中的关键要素，如人物、地点、道具等..."
                :rows="3"
              />
            </el-form-item>

            <el-form-item label="上文内容">
              <el-input
                type="textarea"
                v-model="sceneForm.context"
                placeholder="粘贴上文内容，帮助生成连贯的场景..."
                :rows="3"
              />
            </el-form-item>

            <el-form-item label="场景长度">
              <el-slider
                v-model="sceneForm.length"
                :step="100"
                :min="200"
                :max="1000"
                :marks="{
                  200: '短',
                  500: '中',
                  1000: '长'
                }"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generateScene" :loading="loading">
                生成场景
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card v-if="generatedScene" class="scene-result">
          <template #header>
            <div class="card-header">
              <h3>生成结果</h3>
              <div class="header-actions">
                <el-button type="primary" text @click="saveScene">
                  保存场景
                </el-button>
                <el-button type="primary" text @click="regenerateScene">
                  重新生成
                </el-button>
              </div>
            </div>
          </template>

          <div class="scene-content">
            <el-scrollbar height="600px">
              <div class="scene-text" v-html="formattedScene"></div>
              
              <div class="scene-analysis" v-if="sceneAnalysis">
                <h4>场景分析</h4>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="情感基调">
                    {{ sceneAnalysis.emotion }}
                  </el-descriptions-item>
                  <el-descriptions-item label="关键意象">
                    {{ sceneAnalysis.imagery }}
                  </el-descriptions-item>
                  <el-descriptions-item label="人物互动">
                    {{ sceneAnalysis.interaction }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <div class="scene-suggestions" v-if="suggestions.length">
                <h4>优化建议</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="(suggestion, index) in suggestions"
                    :key="index"
                    :type="suggestion.type"
                  >
                    {{ suggestion.content }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { computed, reactive, ref } from 'vue'

interface SceneForm {
  type: string
  mood: string
  style: string
  elements: string
  context: string
  length: number
}

interface SceneAnalysis {
  emotion: string
  imagery: string
  interaction: string
}

interface Suggestion {
  type: 'primary' | 'success' | 'warning' | 'danger'
  content: string
}

const sceneForm = reactive<SceneForm>({
  type: 'description',
  mood: '',
  style: '',
  elements: '',
  context: '',
  length: 500
})

const loading = ref(false)
const generatedScene = ref('')
const sceneAnalysis = ref<SceneAnalysis | null>(null)
const suggestions = ref<Suggestion[]>([])

const formattedScene = computed(() => {
  if (!generatedScene.value) return ''
  return generatedScene.value.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')
})

const generateScene = async () => {
  if (!sceneForm.elements) {
    ElMessage.warning('请至少填写场景要素')
    return
  }

  loading.value = true
  try {
    // TODO: 调用 AI API 生成场景
    // 这里使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    generatedScene.value = `夕阳的余晖透过哥特式的彩绘玻璃窗，在图书馆古老的木地板上投下斑驳的光影。空气中漂浮着细小的尘埃，在光束中缓缓起舞。艾莉站在高耸的书架前，指尖轻轻抚过一排排古籍的书脊，厚重的皮革封面和烫金的文字透着岁月的气息。

突然，一本没有标题的黑皮书引起了她的注意。当她试图抽出这本书时，一股奇异的能量顺着她的手指流遍全身。书页无风自动，泛着幽幽的蓝光，上面的文字仿佛活了过来，在她眼前流动。

"这不可能..."艾莉倒吸一口冷气，她认出了这些符号——这是远古魔法文字，而且正在向她诉说一个尘封已久的预言。`

    sceneAnalysis.value = {
      emotion: '神秘感和紧张感交织，带有一丝惊奇和敬畏',
      imagery: '夕阳、彩绘玻璃、漂浮的尘埃、古籍、幽蓝光芒',
      interaction: '主角艾莉与神秘魔法书的互动，展现了发现的惊讶和认知的转变'
    }

    suggestions.value = [
      {
        type: 'success',
        content: '场景氛围营造得当，光影描写细腻'
      },
      {
        type: 'primary',
        content: '可以适当加入更多感官描写，如古籍的气味、触感等'
      },
      {
        type: 'warning',
        content: '建议增加一些环境声音的描写，提升场景的立体感'
      }
    ]

    ElMessage.success('场景生成成功')
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    loading.value = false
  }
}

const regenerateScene = () => {
  generateScene()
}

const saveScene = () => {
  // TODO: 保存场景到本地或数据库
  ElMessage.success('场景保存成功')
}
</script>

<style scoped>
.scene-container {
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

.scene-content {
  padding: 20px 0;
}

.scene-text {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
}

.scene-text :deep(p) {
  margin-bottom: 1em;
  text-indent: 2em;
}

.scene-analysis {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dcdfe6;
}

.scene-analysis h4,
.scene-suggestions h4 {
  color: #409EFF;
  margin-bottom: 15px;
}

.scene-suggestions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dcdfe6;
}

:deep(.el-timeline-item__node--primary) {
  background-color: #409EFF;
}

:deep(.el-timeline-item__node--success) {
  background-color: #67C23A;
}

:deep(.el-timeline-item__node--warning) {
  background-color: #E6A23C;
}

:deep(.el-timeline-item__node--danger) {
  background-color: #F56C6C;
}
</style> 