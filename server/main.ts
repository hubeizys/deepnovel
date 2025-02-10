import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import chatRouter from './chat'

// 加载环境变量
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api', chatRouter)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 