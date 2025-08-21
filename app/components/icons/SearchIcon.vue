<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" viewBox="0 0 19 19" fill="none">
    <path
      d="M8.43555 15.2183C11.7493 15.2183 14.4355 12.532 14.4355 9.21826C14.4355 5.90455 11.7493 3.21826 8.43555 3.21826C5.12184 3.21826 2.43555 5.90455 2.43555 9.21826C2.43555 12.532 5.12184 15.2183 8.43555 15.2183Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15.9356 16.7182L12.6731 13.4557"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  width: {
    type: [String, Number],
    default: 19
  },
  height: {
    type: [String, Number],
    default: 19
  },
  color: {
    type: String,
    default: '#FF6F00'
  }
})
</script>

<style></style>
