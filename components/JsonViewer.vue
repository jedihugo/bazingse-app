<template>
  <div class="json-viewer-container flex flex-col h-full bg-gray-900">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div class="flex items-center gap-2">
        <button
          @click="toggleAll"
          class="px-3 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          title="Expand/Collapse All"
        >
          {{ allExpanded ? 'Collapse All' : 'Expand All' }}
        </button>
        <button
          @click="copyToClipboard"
          class="px-3 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center gap-1"
          title="Copy JSON"
        >
          <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
      
      <!-- Search Box -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search keys..."
          class="px-3 py-1 text-xs bg-gray-700 text-gray-100 border border-gray-600 rounded focus:outline-none focus:border-blue-500 w-48"
        />
        <svg 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-200"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
    </div>

    <!-- JSON Content -->
    <div 
      ref="contentRef"
      class="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed"
      style="max-height: calc(100vh - 200px);"
    >
      <JsonNode 
        v-if="data"
        :data="data" 
        :path="'root'"
        :level="0"
        :search-query="searchQuery"
        :force-expand="allExpanded"
      />
      <div v-else class="text-gray-500 italic">No data available</div>
    </div>

    <!-- Status Bar -->
    <div class="px-4 py-1.5 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
      <span>{{ totalKeys }} keys | {{ totalItems }} items</span>
      <span v-if="searchQuery && matchCount >= 0" class="text-yellow-400">{{ matchCount }} matches</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, h } from 'vue'

const props = defineProps({
  data: {
    type: [Object, Array, String, Number, Boolean],
    required: true
  }
})

const searchQuery = ref('')
const copied = ref(false)
const allExpanded = ref(false)
const contentRef = ref(null)
const matchCount = ref(0)

const totalKeys = computed(() => {
  const countKeys = (obj, count = 0) => {
    if (obj && typeof obj === 'object') {
      count += Object.keys(obj).length
      for (const value of Object.values(obj)) {
        if (value && typeof value === 'object') {
          count = countKeys(value, count)
        }
      }
    }
    return count
  }
  return countKeys(props.data)
})

const totalItems = computed(() => {
  const countItems = (obj) => {
    if (Array.isArray(obj)) {
      let count = obj.length
      obj.forEach(item => {
        if (item && typeof item === 'object') {
          count += countItems(item)
        }
      })
      return count
    } else if (obj && typeof obj === 'object') {
      let count = 0
      Object.values(obj).forEach(value => {
        if (value && typeof value === 'object') {
          count += countItems(value)
        }
      })
      return count
    }
    return 0
  }
  return countItems(props.data)
})

const toggleAll = () => {
  allExpanded.value = !allExpanded.value
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(props.data, null, 2))
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// JSON Node Component (recursive)
const JsonNode = {
  name: 'JsonNode',
  props: {
    data: [Object, Array, String, Number, Boolean, null],
    path: String,
    level: Number,
    searchQuery: String,
    forceExpand: Boolean
  },
  setup(props) {
    const collapsed = ref(props.level > 2)
    
    watch(() => props.forceExpand, (newVal) => {
      collapsed.value = !newVal
    })
    
    const getType = (val) => {
      if (val === null) return 'null'
      if (Array.isArray(val)) return 'array'
      return typeof val
    }
    
    const matchesSearch = (key) => {
      if (!props.searchQuery) return false
      return key.toLowerCase().includes(props.searchQuery.toLowerCase())
    }
    
    const hasMatchInChildren = (obj) => {
      if (!props.searchQuery) return false
      
      const search = (val, path = '') => {
        if (val && typeof val === 'object') {
          for (const [key, value] of Object.entries(val)) {
            if (key.toLowerCase().includes(props.searchQuery.toLowerCase())) {
              return true
            }
            if (search(value, `${path}.${key}`)) {
              return true
            }
          }
        }
        return false
      }
      
      return search(obj)
    }
    
    const shouldExpand = computed(() => {
      if (props.forceExpand) return true
      if (!props.searchQuery) return !collapsed.value
      
      // Auto-expand if this node or children match search
      if (props.data && typeof props.data === 'object') {
        for (const key of Object.keys(props.data)) {
          if (matchesSearch(key) || hasMatchInChildren(props.data[key])) {
            return true
          }
        }
      }
      
      return !collapsed.value
    })
    
    return { collapsed, getType, matchesSearch, hasMatchInChildren, shouldExpand }
  },
  render() {
    const { data, level = 0, searchQuery } = this
    const type = this.getType(data)
    const paddingLeft = `${level * 20}px`
    
    const getValueColor = (type) => {
      const colors = {
        string: 'text-emerald-400',
        number: 'text-blue-400',
        boolean: 'text-purple-400',
        null: 'text-gray-500'
      }
      return colors[type] || 'text-gray-300'
    }
    
    const formatValue = (val) => {
      const type = this.getType(val)
      if (type === 'string') return `"${val}"`
      if (type === 'null') return 'null'
      return String(val)
    }
    
    const getCount = (val) => {
      if (Array.isArray(val)) return val.length
      if (typeof val === 'object' && val !== null) return Object.keys(val).length
      return 0
    }
    
    // Handle objects
    if (type === 'object' && data !== null) {
      const keys = Object.keys(data)
      const isExpanded = this.shouldExpand
      
      return h('div', { style: { paddingLeft } }, [
        // Opening brace with toggle
        h('div', {
          class: 'flex items-center cursor-pointer hover:bg-gray-800 rounded px-1 py-0.5 -mx-1 group',
          onClick: () => {
            this.collapsed = !this.collapsed
          }
        }, [
          h('span', { 
            class: 'text-gray-500 select-none w-4 transition-transform',
            style: { transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }
          }, '▶'),
          h('span', { class: 'text-pink-400 font-bold mx-1' }, '{'),
          isExpanded ? null : h('span', { class: 'text-gray-500 text-[10px]' }, `${getCount(data)} keys`),
          isExpanded ? null : h('span', { class: 'text-pink-400 font-bold ml-1' }, '}'),
        ]),
        
        // Object keys
        isExpanded && keys.map(key => {
          const highlight = this.matchesSearch(key)
          return h('div', { 
            key,
            class: 'flex items-start py-0.5 hover:bg-gray-800 rounded px-1 -mx-1',
            style: { paddingLeft: '4px' }
          }, [
            h('span', { 
              class: highlight ? 'text-yellow-300 font-semibold bg-yellow-900/30 px-1 rounded' : 'text-cyan-300',
            }, `"${key}"`),
            h('span', { class: 'text-gray-500 mx-1' }, ':'),
            h('div', { class: 'flex-1' }, [
              (this.getType(data[key]) === 'object' || this.getType(data[key]) === 'array')
                ? h(JsonNode, { 
                    data: data[key], 
                    path: `${this.path}.${key}`,
                    level: level + 1,
                    searchQuery: searchQuery,
                    forceExpand: this.forceExpand
                  })
                : h('span', { class: getValueColor(this.getType(data[key])) }, formatValue(data[key]))
            ])
          ])
        }),
        
        // Closing brace
        isExpanded && h('div', { 
          class: 'text-pink-400 font-bold',
          style: { paddingLeft: '0px' }
        }, '}')
      ])
    }
    
    // Handle arrays
    if (type === 'array') {
      const isExpanded = this.shouldExpand
      
      return h('div', { style: { paddingLeft } }, [
        // Opening bracket with toggle
        h('div', {
          class: 'flex items-center cursor-pointer hover:bg-gray-800 rounded px-1 py-0.5 -mx-1',
          onClick: () => {
            this.collapsed = !this.collapsed
          }
        }, [
          h('span', { 
            class: 'text-gray-500 select-none w-4 transition-transform',
            style: { transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }
          }, '▶'),
          h('span', { class: 'text-orange-400 font-bold mx-1' }, '['),
          isExpanded ? null : h('span', { class: 'text-gray-500 text-[10px]' }, `${getCount(data)} items`),
          isExpanded ? null : h('span', { class: 'text-orange-400 font-bold ml-1' }, ']'),
        ]),
        
        // Array items
        isExpanded && data.map((item, index) =>
          h('div', { 
            key: index,
            class: 'flex items-start py-0.5 hover:bg-gray-800 rounded px-1 -mx-1',
            style: { paddingLeft: '4px' }
          }, [
            h('span', { class: 'text-gray-500 mr-2' }, `[${index}]`),
            h('div', { class: 'flex-1' }, [
              (this.getType(item) === 'object' || this.getType(item) === 'array')
                ? h(JsonNode, { 
                    data: item, 
                    path: `${this.path}[${index}]`,
                    level: level + 1,
                    searchQuery: searchQuery,
                    forceExpand: this.forceExpand
                  })
                : h('span', { class: getValueColor(this.getType(item)) }, formatValue(item))
            ])
          ])
        ),
        
        // Closing bracket
        isExpanded && h('div', { 
          class: 'text-orange-400 font-bold',
          style: { paddingLeft: '0px' }
        }, ']')
      ])
    }
    
    // Handle primitive values
    return h('span', { class: getValueColor(type) }, formatValue(data))
  }
}
</script>

<style scoped>
.json-viewer-container {
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
}

.json-viewer-container ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.json-viewer-container ::-webkit-scrollbar-track {
  background: #1f2937;
}

.json-viewer-container ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

.json-viewer-container ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
