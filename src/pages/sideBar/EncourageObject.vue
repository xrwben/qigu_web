<template>
  <div id="EncourageObject">
    <el-tabs v-model="activeName">
      <el-tab-pane label="激励对象名称" name="EncourageObjectName">
        <encourage-object-name v-if="activeName === 'EncourageObjectName'"></encourage-object-name>
      </el-tab-pane>
      <el-tab-pane label="持股平台" name="StockHoldPlatform">
        <stock-hold-platform v-if="activeName === 'StockHoldPlatform'"></stock-hold-platform>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import StockHoldPlatform from '../views/encourageObject/StockHoldPlatform.vue'
  import EncourageObjectName from '../views/encourageObject/EncourageObjectName.vue'
  export default{
    data () {
      return {
        activeName: 'EncourageObjectName'
      }
    },
    components: {
      StockHoldPlatform,
      EncourageObjectName
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #EncourageObject{
    height: 100%;
  }
</style>
