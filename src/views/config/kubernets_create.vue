<template>
  <article-detail :is-edit="false" />
</template>

<script>
import ArticleDetail from './components/kubernetes'

export default {
  name: 'EditForm',
  components: { ArticleDetail }
}
</script>

