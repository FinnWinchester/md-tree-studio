<script setup lang="ts">
import { computed } from 'vue'
import PackIcon from '@/components/atoms/PackIcon.vue'
import { useTheme } from '@/composables/useTheme'
import { resolveFolderIcon } from '@/icon-packs'

const props = defineProps<{ name: string }>()
const theme = useTheme()
const src = computed(() => resolveFolderIcon(props.name, theme.isDark.value))
</script>

<template>
  <PackIcon :src="src" />
</template>
