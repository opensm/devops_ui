<template>
  <article-detail :is-edit="true" />
</template>

<script>
import ArticleDetail from './components/service.vue'

export default {
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>

