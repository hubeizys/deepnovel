import OpenAI from 'openai'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatApiStore = defineStore('chatApi', () => {
  const apiKey = ref('')
  const temperature = ref(1.3)
  let openaiClient: OpenAI | null = null

  // 初始化 OpenAI 客户端
  const initClient = () => {
    if (apiKey.value) {
      openaiClient = new OpenAI({
        apiKey: apiKey.value,
        baseURL: 'https://api.deepseek.com'
      })
    }
  }

  // 加载设置
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('chat-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      apiKey.value = settings.apiKey
      temperature.value = settings.temperature
      initClient()
    }
  }

  // 保存设置
  const saveSettings = (settings: { apiKey: string; temperature: number }) => {
    apiKey.value = settings.apiKey
    temperature.value = settings.temperature
    localStorage.setItem('chat-settings', JSON.stringify(settings))
    initClient()
  }

  // 发送聊天消息
  const sendChatMessage = async (messages: Array<{ role: string; content: string }>) => {
    if (!openaiClient) {
      throw new Error('API 未初始化')
    }

    try {
      const completion = await openaiClient.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个有帮助的AI助手。请以JSON格式输出你的回复。
            
示例输出格式:
{
  "content": "你的回复内容",
  "type": "text|code|suggestion",
  "metadata": {
    "confidence": 0.9,
    "sources": ["可选的来源引用"],
    "tags": ["相关标签"]
  }
}`
          },
          ...messages
        ],
        temperature: temperature.value,
        response_format: {
          type: 'json_object'
        },
        tools: [
          {
            type: "function",
            function: {
              name: "search_knowledge",
              description: "搜索知识库获取相关信息",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "搜索关键词"
                  },
                  limit: {
                    type: "number",
                    description: "返回结果数量限制"
                  }
                },
                required: ["query"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "generate_image",
              description: "生成图片",
              parameters: {
                type: "object",
                properties: {
                  prompt: {
                    type: "string",
                    description: "图片生成提示词"
                  },
                  style: {
                    type: "string",
                    description: "图片风格",
                    enum: ["realistic", "artistic", "cartoon"]
                  }
                },
                required: ["prompt"]
              }
            }
          }
        ]
      })

      const response = completion.choices[0].message

      // 处理函数调用
      if (response.tool_calls) {
        const results = await Promise.all(response.tool_calls.map(async (toolCall) => {
          const functionName = toolCall.function.name
          const args = JSON.parse(toolCall.function.arguments)

          // 这里实现具体的函数调用逻辑
          let result = ''
          if (functionName === 'search_knowledge') {
            result = await searchKnowledge(args.query, args.limit)
          } else if (functionName === 'generate_image') {
            result = await generateImage(args.prompt, args.style)
          }

          return {
            tool_call_id: toolCall.id,
            role: 'tool',
            content: result
          }
        }))

        // 继续对话
        const finalResponse = await openaiClient.chat.completions.create({
          model: "deepseek-chat",
          messages: [
            ...messages,
            response,
            ...results
          ],
          temperature: temperature.value,
          response_format: {
            type: 'json_object'
          }
        })

        return finalResponse.choices[0].message
      }

      return response
    } catch (error: any) {
      throw new Error(error.message || '发送消息失败')
    }
  }

  // 示例函数: 搜索知识库
  const searchKnowledge = async (query: string, limit: number = 5) => {
    // TODO: 实现实际的知识库搜索逻辑
    return JSON.stringify({
      results: [`搜索结果: ${query}`],
      total: 1
    })
  }

  // 示例函数: 生成图片
  const generateImage = async (prompt: string, style: string = 'realistic') => {
    // TODO: 实现实际的图片生成逻辑
    return JSON.stringify({
      url: 'https://example.com/generated-image.jpg',
      style: style
    })
  }

  return {
    apiKey,
    temperature,
    loadSettings,
    saveSettings,
    sendChatMessage
  }
}) 