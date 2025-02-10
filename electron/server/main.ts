import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'

// 加载环境变量
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deepnovel')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// AI 接口
app.post('/api/ai/character', async (req, res) => {
  try {
    // TODO: 调用 AI API 生成角色
    res.json({
      success: true,
      data: {
        basicInfo: '示例角色信息',
        personality: '示例性格特征',
        appearance: '示例外貌描写',
        background: '示例背景故事'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成失败'
    })
  }
})

app.post('/api/ai/world', async (req, res) => {
  try {
    // TODO: 调用 AI API 生成世界观
    res.json({
      success: true,
      data: {
        description: '示例世界观描述',
        geography: '示例地理环境',
        civilization: '示例文明发展',
        magic: '示例魔法体系'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成失败'
    })
  }
})

app.post('/api/ai/plot', async (req, res) => {
  try {
    // TODO: 调用 AI API 生成情节
    res.json({
      success: true,
      data: {
        title: '示例标题',
        acts: [
          {
            title: '第一幕',
            scenes: [
              {
                description: '示例场景描述',
                elements: {
                  characters: '示例角色',
                  location: '示例地点',
                  conflict: '示例冲突'
                }
              }
            ]
          }
        ]
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成失败'
    })
  }
})

app.post('/api/ai/scene', async (req, res) => {
  try {
    // TODO: 调用 AI API 生成场景
    res.json({
      success: true,
      data: {
        content: '示例场景内容',
        analysis: {
          emotion: '示例情感分析',
          imagery: '示例意象分析',
          interaction: '示例互动分析'
        },
        suggestions: [
          {
            type: 'success',
            content: '示例建议'
          }
        ]
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '生成失败'
    })
  }
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 