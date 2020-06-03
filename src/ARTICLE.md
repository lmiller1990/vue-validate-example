Over the next few articles, I will be building a simple validation framework and integrating it with Vue. In doing so, I'll discuss how I like to design libraries and the process I like to follow, while pointing to some other libraries which exhibit what I consider to be best practices.

You can find the source code [here](https://github.com/lmiller1990/vue-validate-example).

## Design Choices

I like to separate my business logic and UI logic as much possible. Since Vue a library for building user interfaces, anything that isn't related to that should be kept separate. As such, when I build applications, I usually have two layers, each with their own set of responsibilities.

Layer | Responsibility | Language | Tests
----- | ------ | ------- | ------- |
Business | Encapsulate the intelligence and complexity | TypeScript | Jest
UI | Describe current state visually | Vue, TypeScript | Jest/Cypress

There are several things I'd like to touch on here.

## Business layer is pure TypeScript

When I'm writing a non-trivial app, this is where I spend about 80% of my time. Vue makes building UIs easy, so I don't spend a lot of time there. It is also much easier to test complex business logic when it is decoupled from your framework. A validation framework, for example, is just validating whether strings, numbers of arrays meet some criteria.

## The UI layer is just a representation of your business logic

Vue, and web UIs in general, are just one way to **represent the state of your application**. The vast majority of web apps are just a visualization of some data. In the validation framework example, we are visualizing the state of an input or form. The less intelligence in the Vue component, the less likely we are to have bugs.

## API Design

With this in mind, let's get started. This article focuses on the first layer - the business logic. The eventual goal is to build some generic, framework agnostic validations, then add a thin layer for Vue (and maybe other frameworks?) compatibility.

For the business layer, I would like to model my forms using a simple object structure. A simple example might be:

```js
const form = [
  {
    name: 'username',
    value: '',
    rules: [
      hasLength({ min: 5, max: 10 }),
      isRequired()
    ],
  }
]
```

No fancy stuff. The Vue integration could be a `useForm` or `createForm` function:

```html
<template>
  <v-input :rules="form.username.rules" v-model="form.username.value" />
</template>

<script lang="ts">
import { hasLength, isRequired, vInput, useForm } from '@some-validation-package/vue'

export default {
  setup() {
    const form = useForm([
      {
        name: 'username',
        value: '',
        rules: [
          hasLength({ min: 5, max: 10 }),
          isRequired()
        ],
      }
    ])

    return {
      form
    }
  }
}
</script>
```

You can see the API is more or less the same - we just pass our plain old data structure to the Vue integration layer, and let it figure out what to do.

This unnamed framework should separate the validation rules from the Vue integration, so you can use it separately. You should be able to compose validations, which will allow composing complex validations from a handful of fundamental rules. Finally, the framework should be extendable; users can add their own rules or add-ons.

For the Vue integration, or the UI layer, we will expose a style-less `<v-input>` that emits some useful events.

## Defining the Types and Logic

Now we know what we are building, things are much easier! Let's start defining some types and rules - to keep things simple, let's start with `hasLength`, which will validate that the value has a minimum and maximum length. One simple implementation might be:

```ts
interface LengthConstraints {
  min: number
  max: number
}

interface LengthRule {
  type: 'length'
  constraints: LengthConstraints
}

export interface Status {
  valid: boolean
  message?: string
}

type Rule = LengthRule

export const hasLength = (constraints: LengthConstraints): LengthRule => ({
  type: 'length',
  constraints
})

export function validate(value: string, rules: Rule[]): Status {
  for (const rule of rules) {
    if (rule.type === 'length' && value.length > rule.constraints.max) {
      return {
        valid: false,
        message: 'Value is too long',
      }
    }
  }

  return {
    valid: true
  }
}
```

This is a minimal implementation that would work. You create a new rule by calling `hasLength({ min: 5, max: 10 })`, then whenever you want to validate the form, just call `validate`, and loop over rules. There is a problem, though - which we will see soon. Before we start changing the implementation, we should make sure this actually works with a test.

```ts
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
})
```

## Making it Extendable

We need to address a design problem. By hard-coding the check for each rule inside the `validate` function, users will not be able to add their own validations - there would be no way to add additional conditionals to the `validate` function, if we shipping this as a module on npm. Instead, let's move the validation check to the rule itself:

```ts
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

    return {
      valid: true
    }
  }
})
```

Now the user can easily provide their own rules - they will just pass them into the `validate` function. Update `validate`:

```ts
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
```

Tests are still passing ✅ Adding the `min` rule is an exercise for the reader - see the repo for the implementation.

## Discussion and Conclusion

We have not written any Vue code yet, we have done the hard work in designing our API, and writing the business logic. We also saw two ways to implement the validation. The more extensible one is the one that takes the rules as arguments. By thinking our design through, we were able to come up with an API that satisfies all our goals before we wrote too much code.

The next article will focus on building the integration layer between the validation business logic and Vue.
