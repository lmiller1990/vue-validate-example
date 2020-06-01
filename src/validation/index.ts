/**
 *  import { length, email, v-input } from 'vue-validation'
 *
 * <v-input @change="change" v-model="email" :validation="validations" />
 *
 * interface Meta {
 *   valid: boolean
 *   value: ...
 * }
 *
 * function change(state: ValidationState, prevState: ValidationState) {
 *
 * }
 */

import { reactive, watch, ref } from "vue"

interface LengthConstraints {
  min: number
  max: number
}

interface LengthRule {
  type: 'length'
  constraints: LengthConstraints
  validator: (value: string) => Status
}

export type Rule = LengthRule

export const hasLength = (constraints: LengthConstraints): LengthRule => ({
  type: 'length',
  constraints,
  validator: (value: string) => {
    if (value.length > constraints.max) {
      return {
        valid: false,
        message: 'Value is too long',
      }
    }

    if (value.length < constraints.min) {
      return {
        valid: false,
        message: 'Value is too short',
      }
    }


    return {
      valid: true
    }
  }
})

export interface Status {
  valid: boolean
  message?: string
}

export function validate(value: string, rules: Rule[]): Status {
  for (const rule of rules) {
    const result = rule.validator(value)
    if (!result.valid) {
      return result
    }
  }

  return {
    valid: true
  }
}

interface FormInput {
  name: string
  value: string
  rules: Rule[]
}

export function useForm(inputs: FormInput[]) {
  const form = {
    valid: ref(true),
    // username: {
    //   value: username,
    //   error: usernameError
    // }
  }

  const errors: Record<string, any> = {}

  for (const input of inputs) {
    errors[input.name] = null
    form[input.name] = {
      value: ref(input.value),
      error: ref()
    }

    watch(form[input.name].value, (val) => {
      const v = validate(val, input.rules)
      if (!v.valid) {
        form[input.name].error.value = v.message
        errorBag[input.name] = true
      } else {
        form[input.name].error.value = undefined
        errorBag[input.name] = false
      }
    })
  }

  const errorBag = reactive(errors)

  watch(errorBag, val => {
    form.valid.value = !(Object.values(val).every(val => val))
  })

  return {
    form
  }
}
