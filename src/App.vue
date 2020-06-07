<template>
  <form>
    <input v-model="form.username.ref" />
    <div v-if="form.username.error">{{ form.username.error }}</div>

    <input v-model="form.password.ref" />
    <div v-if="form.password.error">{{ form.password.error }}</div>

    <button :disabled="!form.valid">submit</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isRequired, hasMinMax, useForm } from './vue-validate'

export default defineComponent({
  name: 'App',

  setup() {

    const { form } = useForm([
      {
        name: 'username',
        value: '',
        rules: [isRequired(), hasMinMax({ min: 5, max: 10 })]
      },
      {
        name: 'password',
        value: '',
        rules: [isRequired(), hasMinMax({ min: 5, max: 10 })]
      }
    ])

    return {
      form
    }
  }
})
</script>
