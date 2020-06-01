import { hasLength, validate, Status } from './'

describe('validate', () => {
  it('validates max length' , () => {
    const expected: Status = {
      valid: false,
      message: 'Value is too long'
    }
    const actual = validate('aaaaa', [hasLength({ min: 0, max: 4 })])

    expect(actual).toEqual(expected)
  })

  it('validates min length' , () => {
    const expected: Status = {
      valid: false,
      message: 'Value is too short'
    }
    const actual = validate('a', [hasLength({ min: 2, max: 4 })])

    expect(actual).toEqual(expected)
  })
})
