import { validate, isRequired, hasMinMax, Status } from './validate'

describe('validate', () => {
  test('isRequired', () => {
    const actual = validate('', [isRequired()])
    const expected: Status = {
      valid: false,
      message: 'Required'
    }

    expect(actual).toEqual(expected)
  })

  test('hasMinMax', () => {
    const actual = validate('asasdfasdf', [hasMinMax({ min: 0, max: 5 })])
    const expected: Status = {
      valid: false,
      message: 'Max length is 5'
    }

    expect(actual).toEqual(expected)
  })
})
