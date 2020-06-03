<template>
  <Alert :show="show" />
  <button @click="toggle">Toggle</button>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Alert from './Alert.vue'

export default defineComponent({
  name: 'App',
  components: {
    Alert
  },
  setup() {
    const show = ref(false)
    return {
      show,
      toggle: () => show.value = !show.value
    }
  }
})
</script>
