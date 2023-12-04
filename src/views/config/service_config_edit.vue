<template>
  <DetailPage :is-edit="true" />
</template>

<script>
import DetailPage from './components/service_config'

export default {
  name: 'EditForm',
  components: { DetailPage }
}
</script>

