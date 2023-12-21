<template>
  <order-detail :is-edit="true" />
</template>

<script>
import OrderDetail from './components/order'

export default {
  name: 'EditForm',
  components: { OrderDetail }
}
</script>

