<script setup lang="ts">
import { useStudio } from '@/composables/useStudio'
import PaneHead from '@/components/atoms/PaneHead.vue'
import PaneShell from '@/components/atoms/PaneShell.vue'
import PaneTitle from '@/components/atoms/PaneTitle.vue'
import TreeStats from '@/components/molecules/TreeStats.vue'
import ExplorerToolbar from '@/components/organisms/ExplorerToolbar.vue'
import TreeExplorer from '@/components/organisms/TreeExplorer.vue'

const studio = useStudio()
</script>

<template>
  <PaneShell label="Preview">
    <PaneHead>
      <PaneTitle>Preview</PaneTitle>
      <TreeStats :folders="studio.stats.value.folders" :files="studio.stats.value.files" />
    </PaneHead>
    <ExplorerToolbar />
    <TreeExplorer />
  </PaneShell>
</template>
