import { ref, watch, reactive } from 'vue'
import { validate, isRequired, hasMinMax, Status, Rule } from '../validate'

export * from '../validate'

interface FormField {
  name: string
  value: string
  rules: Rule[]
}

export const useForm = (fields: FormField[]) => {
  const form = {
    valid: ref(false)
  }

  const errors = reactive(
    fields.reduce<Record<string, boolean>>((acc, curr) => {
      acc[curr.name] = false
      return acc
    }, {})
  )

  for (const field of fields) {
    form[field.name] = {
      ref: ref(''),
      error: ref<string | null>(null)
    }

    watch(form[field.name].ref, val => {
      const status = validate(val, fields[0].rules)

      if (!status.valid) {
        form[field.name].error.value = status.message
        errors[field.name] = false
      } else {
        form[field.name].error.value = null
        errors[field.name] = true
      }
    })
  }

  watch(errors, val => {
    form.valid.value = Object.values(val).every(valid => valid)
  })

  return {
    form
  }
}
