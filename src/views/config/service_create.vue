<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/service.vue'

export default {
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>

