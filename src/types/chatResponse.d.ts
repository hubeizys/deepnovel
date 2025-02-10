export interface ChatResponse {
    content: string
    type: 'text' | 'code' | 'suggestion'
    metadata: {
      confidence: number
      sources?: string[]
      tags?: string[]
    }
  }
  