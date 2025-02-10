import express from 'express'
import OpenAI from 'openai'

const router = express.Router()

// 创建聊天路由处理
router.post('/chat', async (req, res) => {
  const { messages, temperature } = req.body
  const apiKey = req.headers.authorization?.replace('Bearer ', '')

  if (!apiKey) {
    return res.status(401).json({ message: 'API Key is required' })
  }

  try {
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey
    })

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages
      ],
      model: "deepseek-chat",
      temperature: temperature
    })

    res.json(completion.choices[0].message)
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || 'Failed to send message' 
    })
  }
})

export default router 