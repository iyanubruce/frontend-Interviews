<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['toggle']);
</script>

<template>
  <li>
    <label class="checkbox">
      <input
        type="checkbox"
        :checked="item.checked === true"
        :indeterminate="item.checked === 'indeterminate'"
        @change="
          emit('toggle', {
            checked: $event.currentTarget.checked,
            path: [],
          })
        " />
      {{ item.name }}
    </label>

    <ul v-if="item.children?.length">
      <CheckboxNode
        v-for="(child, index) in item.children"
        :key="child.id"
        :item="child"
        @toggle="
          emit('toggle', {
            checked: $event.checked,
            path: [index, ...$event.path],
          })
        " />
    </ul>
  </li>
</template>
