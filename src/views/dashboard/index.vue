<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ names }} {{ publickey }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name', 'publickey'
    ])
  },
  data(){
    return{
      names:window.localStorage.getItem('loginnames')
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
