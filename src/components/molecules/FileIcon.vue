<script setup lang="ts">
import { computed } from 'vue'
import PackIcon from '@/components/atoms/PackIcon.vue'
import { useTheme } from '@/composables/useTheme'
import { resolveFileIcon } from '@/icon-packs'

const props = defineProps<{ name: string }>()
const theme = useTheme()
const src = computed(() => resolveFileIcon(props.name, theme.isDark.value))
</script>

<template>
  <PackIcon :src="src" />
</template>
