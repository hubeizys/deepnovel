import { defineStore } from 'pinia'

interface Character {
  id: string
  basicInfo: string
  personality: string
  appearance: string
  background: string
}

interface World {
  id: string
  name: string
  description: string
  geography: string
  civilization: string
  magic: string
}

interface Plot {
  id: string
  title: string
  acts: {
    title: string
    scenes: {
      description: string
      elements?: {
        characters?: string
        location?: string
        conflict?: string
      }
    }[]
  }[]
}

interface Scene {
  id: string
  content: string
  analysis: {
    emotion: string
    imagery: string
    interaction: string
  }
  suggestions: {
    type: 'primary' | 'success' | 'warning' | 'danger'
    content: string
  }[]
}

interface NovelState {
  characters: Character[]
  worlds: World[]
  plots: Plot[]
  scenes: Scene[]
}

export const useNovelStore = defineStore('novel', {
  state: (): NovelState => ({
    characters: [],
    worlds: [],
    plots: [],
    scenes: []
  }),

  getters: {
    getCharacterById: (state) => (id: string) => {
      return state.characters.find(char => char.id === id)
    },
    getWorldById: (state) => (id: string) => {
      return state.worlds.find(world => world.id === id)
    },
    getPlotById: (state) => (id: string) => {
      return state.plots.find(plot => plot.id === id)
    },
    getSceneById: (state) => (id: string) => {
      return state.scenes.find(scene => scene.id === id)
    }
  },

  actions: {
    addCharacter(character: Character) {
      this.characters.push(character)
    },
    updateCharacter(id: string, character: Partial<Character>) {
      const index = this.characters.findIndex(char => char.id === id)
      if (index !== -1) {
        this.characters[index] = { ...this.characters[index], ...character }
      }
    },
    deleteCharacter(id: string) {
      this.characters = this.characters.filter(char => char.id !== id)
    },

    addWorld(world: World) {
      this.worlds.push(world)
    },
    updateWorld(id: string, world: Partial<World>) {
      const index = this.worlds.findIndex(w => w.id === id)
      if (index !== -1) {
        this.worlds[index] = { ...this.worlds[index], ...world }
      }
    },
    deleteWorld(id: string) {
      this.worlds = this.worlds.filter(world => world.id !== id)
    },

    addPlot(plot: Plot) {
      this.plots.push(plot)
    },
    updatePlot(id: string, plot: Partial<Plot>) {
      const index = this.plots.findIndex(p => p.id === id)
      if (index !== -1) {
        this.plots[index] = { ...this.plots[index], ...plot }
      }
    },
    deletePlot(id: string) {
      this.plots = this.plots.filter(plot => plot.id !== id)
    },

    addScene(scene: Scene) {
      this.scenes.push(scene)
    },
    updateScene(id: string, scene: Partial<Scene>) {
      const index = this.scenes.findIndex(s => s.id === id)
      if (index !== -1) {
        this.scenes[index] = { ...this.scenes[index], ...scene }
      }
    },
    deleteScene(id: string) {
      this.scenes = this.scenes.filter(scene => scene.id !== id)
    }
  }
}) 