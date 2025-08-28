<template>
  <div class="bg-white border-b" style="font-family: 'Roboto Condensed', 'Courier New', monospace;">
    <!-- Chat Input Box -->
    <div class="px-3 py-3">
      <div class="border border-gray-300 rounded-lg p-3 bg-gray-50">
        <div class="text-sm leading-relaxed space-y-1">
          <div class="flex">
            <span class="text-gray-700 w-20 flex-shrink-0">Date of birth:</span>
            <input 
              ref="dateInput"
              v-model="inputs.dateOfBirth"
              type="text"
              class="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="30 Nov 1995"
              @keydown="handleKeydown($event, 0)"
            />
          </div>
          <div class="flex">
            <span class="text-gray-700 w-20 flex-shrink-0">Hour of birth:</span>
            <input 
              ref="timeInput"
              v-model="inputs.timeOfBirth"
              type="text"
              class="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="4:00 PM"
              @keydown="handleKeydown($event, 1)"
            />
          </div>
          <div class="flex items-center">
            <span class="text-gray-700 w-20 flex-shrink-0">Gender:</span>
            <input 
              ref="genderInput"
              v-model="inputs.gender"
              type="text"
              class="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
              placeholder="male"
              @keydown="handleKeydown($event, 2)"
            />
            <button 
              @click="handleSubmit"
              :disabled="isProcessing"
              class="ml-3 px-3 py-1.5 bg-gray-800 text-white rounded-full transition-all hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center text-sm leading-none"
            >
              <span>↵</span>
            </button>
          </div>
        </div>
        
        <!-- Error/Processing Messages -->
        <div v-if="isProcessing || error" class="mt-3 text-xs">
          <div v-if="isProcessing" class="text-gray-500">
            > processing...
          </div>
          <div v-if="error" class="text-red-600">
            > {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

// Props
interface Props {
  modelValue: {
    dateOfBirth: string
    timeOfBirth: string  
    gender: string
  }
  isProcessing?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  isProcessing: false,
  error: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: { dateOfBirth: string, timeOfBirth: string, gender: string }]
  'submit': [value: { dateOfBirth: string, timeOfBirth: string, gender: string }]
}>()

// Input refs for navigation
const dateInput = ref<HTMLInputElement>()
const timeInput = ref<HTMLInputElement>()
const genderInput = ref<HTMLInputElement>()

// Local inputs
const inputs = reactive({
  dateOfBirth: props.modelValue.dateOfBirth || '30 Nov 1995',
  timeOfBirth: props.modelValue.timeOfBirth || '4:00 PM',
  gender: props.modelValue.gender || 'male'
})

// Input navigation array
const inputRefs = computed(() => [dateInput.value, timeInput.value, genderInput.value])

// Handle input changes
const updateModel = () => {
  emit('update:modelValue', {
    dateOfBirth: inputs.dateOfBirth,
    timeOfBirth: inputs.timeOfBirth,
    gender: inputs.gender
  })
}

// Handle keyboard navigation with cursor position preservation
const handleKeydown = (event: KeyboardEvent, currentIndex: number) => {
  const input = event.target as HTMLInputElement
  
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : 2
      const targetUpInput = inputRefs.value[prevIndex]
      if (targetUpInput) {
        const cursorPos = input.selectionStart || 0
        targetUpInput.focus()
        // Set cursor position, or end of text if position exceeds length
        const targetPos = Math.min(cursorPos, targetUpInput.value.length)
        targetUpInput.setSelectionRange(targetPos, targetPos)
      }
      break
      
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < 2 ? currentIndex + 1 : 0
      const targetDownInput = inputRefs.value[nextIndex]
      if (targetDownInput) {
        const cursorPos = input.selectionStart || 0
        targetDownInput.focus()
        // Set cursor position, or end of text if position exceeds length
        const targetPos = Math.min(cursorPos, targetDownInput.value.length)
        targetDownInput.setSelectionRange(targetPos, targetPos)
      }
      break
      
    case 'Enter':
      event.preventDefault()
      handleSubmit()
      break
  }
}

// Handle submit
const handleSubmit = () => {
  if (props.isProcessing) return
  
  updateModel()
  emit('submit', {
    dateOfBirth: inputs.dateOfBirth,
    timeOfBirth: inputs.timeOfBirth,
    gender: inputs.gender
  })
}

// Watch for changes and update model
watch(inputs, updateModel, { deep: true })
</script>