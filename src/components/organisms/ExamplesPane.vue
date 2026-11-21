<script setup lang="ts">
import { computed } from 'vue'
import { parse } from '@/core/parse'
import { countAll } from '@/core/tree'
import { useStudio } from '@/composables/useStudio'
import BaseButton from '@/components/atoms/BaseButton.vue'
import PaneHead from '@/components/atoms/PaneHead.vue'
import PaneShell from '@/components/atoms/PaneShell.vue'
import PaneTitle from '@/components/atoms/PaneTitle.vue'
import ExampleListItem from '@/components/molecules/ExampleListItem.vue'

const studio = useStudio()
const rows = computed(() =>
  studio.items.value.map((item) => ({ item, stats: countAll(parse(item.md)) })),
)
</script>

<template>
  <PaneShell label="Examples">
    <PaneHead>
      <PaneTitle>Examples</PaneTitle>
    </PaneHead>
    <div class="list">
      <ExampleListItem
        v-for="row in rows"
        :key="row.item.id"
        :title="row.item.title"
        :folders="row.stats.folders"
        :files="row.stats.files"
        :active="row.item.id === studio.active.value.id"
        @select="studio.select(row.item.id)"
      />
    </div>
    <div class="foot">
      <BaseButton variant="primary" class="wide" @click="studio.create()">New example</BaseButton>
    </div>
  </PaneShell>
</template>

<style scoped>
.list {
  overflow: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 220px;
}
@media (min-width: 900px) {
  .list {
    max-height: none;
    flex: 1;
  }
}
.foot {
  padding: 8px;
  border-top: 1px solid var(--line);
}
.wide {
  width: 100%;
}
</style>
