<template>
  <order-detail :is-edit="false" />
</template>

<script>
import OrderDetail from './components/order'

export default {
  name: 'EditForm',
  components: { OrderDetail }
}
</script>

