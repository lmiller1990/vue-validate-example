<template>
  <div>
    <input :value="modelValue" @input="input" />
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { validate, Rule } from './validation'

export default defineComponent({
  props: {
    rules: {
      type: Array as () => Rule[]
    },

    modelValue: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const error = ref('')

    const input = (event: any) => {
      const { valid, message = undefined } = validate(event.target.value, props.rules)
      error.value = message
      emit('update:modelValue', event.target.value)
    }

    return {
      input,
      error
    }
  }
})
</script>
