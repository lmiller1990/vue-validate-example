<template>
  <form>
    <input v-model="form.username.value" />
    <div v-if="form.username.error">
      {{ form.username.error }}
    </div>
      <button :disabled="!form.valid">submit</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import VInput from './v-input.vue'
import VInputWrapper from './v-input-wrapper.vue'
import { hasLength, useForm } from './validation'

export default defineComponent({
  name: 'App',

  components: {
    VInput,
    VInputWrapper
  },

  setup() {
    const { form } = useForm([
      {
        name: 'username',
        value: 'u',
        rules: [hasLength({ min: 2, max: 3 })],
      }
    ])


    return { form }

    // const form = reactive({
    //   username: {
    //     value: 'username',
    //   },
    //   password: {
    //     value: 'password',
    //     rules: [hasLength({ min: 2, max: 3 })],
    //   },
    // })

    // return {
    //   form
    // }
  }
})
</script>
