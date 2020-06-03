<template>
  <div v-if="show && !isDismissed">
    <button type="button" @click="dismiss()">X</button>
    <div>Hello</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, ref } from 'vue'

export default defineComponent({

  name: 'Alert',
  props: {
    show: {
      type: Boolean,
      required: false
    }
  },

  setup(props) {
    const isDismissed = ref(false)
    function dismiss() {
      isDismissed.value = true
    }

    watchEffect(() => {
      if (props.show) {
        isDismissed.value = false
      }
    })

    return { isDismissed, dismiss }
  }
})
</script>
