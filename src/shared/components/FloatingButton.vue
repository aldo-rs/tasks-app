<script setup>
defineProps({
  ariaLabel: {
    type: String,
    default: 'Acción principal',
  },
})

defineEmits(['click'])
</script>

<template>
  <button class="fab" :aria-label="ariaLabel" @click="$emit('click')">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(137, 0, 242, 0.35);
  transition: background-color 0.2s, transform 0.15s;
  z-index: 100;
}

.fab:hover {
  background-color: var(--color-primary-hover);
}

.fab:active {
  transform: scale(0.95);
}

.fab svg {
  width: 28px;
  height: 28px;
}
</style>
