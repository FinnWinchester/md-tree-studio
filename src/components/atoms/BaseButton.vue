<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'danger' | 'subtle' | 'subtle-danger'
    size?: 'md' | 'sm'
    type?: 'button' | 'submit'
  }>(),
  { variant: 'default', size: 'md', type: 'button' },
)
</script>

<template>
  <button :type="type" class="btn" :class="[variant, size]">
    <slot />
  </button>
</template>

<style scoped>
.btn {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--text);
  border-radius: 7px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 500;
}
.btn:hover:not(:disabled) {
  border-color: var(--accent);
}
.btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.sm {
  padding: 1px 7px;
  font-size: 11.5px;
  line-height: 1.5;
  border-radius: 5px;
}
.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-contrast);
}
.danger {
  border-color: var(--danger);
  color: var(--danger);
}
.subtle,
.subtle-danger {
  color: var(--muted);
}
.subtle:hover:not(:disabled) {
  color: var(--text);
}
.subtle-danger:hover:not(:disabled) {
  color: var(--danger);
  border-color: var(--danger);
}
</style>
