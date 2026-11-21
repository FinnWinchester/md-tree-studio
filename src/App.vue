<script setup lang="ts">
import AppHeader from '@/components/organisms/AppHeader.vue'
import EditorPane from '@/components/organisms/EditorPane.vue'
import ExamplesPane from '@/components/organisms/ExamplesPane.vue'
import PreviewPane from '@/components/organisms/PreviewPane.vue'
import StudioLayout from '@/components/templates/StudioLayout.vue'
</script>

<template>
  <StudioLayout>
    <template #header>
      <AppHeader />
    </template>
    <ExamplesPane />
    <EditorPane />
    <PreviewPane />
  </StudioLayout>
</template>
