<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String
    },
    inputAttrs: {
      type: Object
    }
  },

  setup(props, ctx) {
    const slotNames = Object.keys(ctx.slots).filter(x => x !== '_')
    const slots = []

    for (const name of slotNames) {
      if (name === 'input') {
        slots.push(() => h('input', { value: 'asdf', ...props.inputAttrs }))
      } else {
        slots.push(() => h(ctx.slots[name]))
      }
    }

    return () => h('div',
      slots.map(x => h(x))
    )
  }
})
</script>
