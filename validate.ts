/**
 * 1. composable isRequired hasMinMax hasFormat
 * 2. extendable
 *
 * isRequired(), hasMinMax({ min: 0, max: 10 })
 *
 * validate(value: string, rule: Rule[]): Status
 */

export interface Status {
  valid: boolean
  message?: string
}

export interface BaseRule {
  type: string
  validator: (value: string) => Status
}

interface IsRequired extends BaseRule {
  type: 'is-required'
}

interface HasMinMax extends BaseRule {
  type: 'has-min-max'
  options: {
    min: number
    max: number
  }
}

export const isRequired = (): IsRequired => ({
  type: 'is-required',
  validator: (value: string): Status => {
    if (!value) {
      return {
        valid: false,
        message: 'Required'
      }
    }

    return {
      valid: true
    }
  }
})

export const hasMinMax = (options: { min: number, max: number }): HasMinMax => ({
  type: 'has-min-max',
  options,
  validator: (value: string): Status => {
    if (value.length > options.max) {
      return {
        valid: false,
        message: `Max length is ${options.max}`
      }
    }

    return {
      valid: true
    }
  }
})

export type Rule = IsRequired | HasMinMax

export function validate(value: string, rules: Rule[]): Status {
  for (const rule of rules) {
    const status = rule.validator(value)
    if (!status.valid) {
      return status
    }
  }

  return {
    valid: true
  }
}
