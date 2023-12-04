<template>
  <DetailPage :is-edit="false" />
</template>

<script>
import DetailPage from './components/service_config'

export default {
  name: 'EditForm',
  components: { DetailPage }
}
</script>

