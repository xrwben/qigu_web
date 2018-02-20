<template>
  <div id="OrderBuy">
    <el-tabs v-model="activeName" @tab-click="clickTab">
      <el-tab-pane label="当前服务" name="CurrentService">
        <current-service v-if="activeName === 'CurrentService'"></current-service>
      </el-tab-pane>
      <el-tab-pane label="续费及购买" name="RenewAndBuy">
        <renew-and-buy v-if="activeName === 'RenewAndBuy'"></renew-and-buy>
      </el-tab-pane>
      <el-tab-pane label="订单列表" name="OrderList">
        <order-list v-if="activeName === 'OrderList'"></order-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import CurrentService from '../views/orderAndBuy/CurrentService.vue'
  import RenewAndBuy from '../views/orderAndBuy/RenewAndBuy.vue'
  import OrderList from '../views/orderAndBuy/OrderList.vue'
  export default{
    data () {
      return {
        activeName: 'CurrentService'
      }
    },
    components: {
      CurrentService,
      RenewAndBuy,
      OrderList
    },
    mounted () {
      this.$router.replace('/orderbuy?index=0')
//      if (!this.$route.query.index) {
//        this.$router.replace('/orderbuy?index=0')
//      }
    },
    methods: {
      clickTab (tab) {
        // tab切换
        if (tab.index === '0') {
          this.$router.replace('/orderbuy?index=0')
        } else if (tab.index === '1') {
          this.$router.replace('/orderbuy?index=1')
        } else if (tab.index === '2') {
          this.$router.replace('/orderbuy?index=2')
        }
      }
    },
    watch: {
      '$route': {
        handler (val, oval) {
          if (val.fullPath === '/orderbuy?index=1') {
            this.activeName = 'RenewAndBuy'
          }
        }
      }
    }
  }
</script>

<style>

</style>
