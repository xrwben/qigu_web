<template>
  <div id="StockManagement">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="分红股" name="ShareStock">
          <share-stock v-if="activeName === 'ShareStock'"></share-stock>
        </el-tab-pane>
        <el-tab-pane label="受限股" name="RestrictedStock">
          <restricted-stock v-if="activeName === 'RestrictedStock'"></restricted-stock>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  import ShareStock from '../views/stockManagement/ShareStock.vue'
  import RestrictedStock from '../views/stockManagement/RestrictedStock.vue'
  export default{
    data () {
      return {
        activeName: 'ShareStock'
      }
    },
    components: {
      ShareStock,
      RestrictedStock
    }
  }
</script>

<style type="text/css" lang="scss">
  .noPlan{
    width: calc(100% - 250px);
    height: calc(100% - 80px);
    text-align: center;
    position: fixed;
    top: 80px;
    left: 250px;
    background: #fff;
    z-index: 11;
    .icon{
      width: 148px;
      height: 148px;
      background: url("../../assets/activeMailBox.png") no-repeat;
      background-size: cover;
      margin: 140px auto 0;
    }
    p{
      margin-top: 45px;
      font-size: 18px;
    }
    button{
      width: 220px;
      height: 38px;
      background: #fff;
      border: 1px solid #5090D3;
      border-radius: 4px;
      margin-top: 40px;
      color: #5090D3;
      i{
        margin-right: 25px;
        font-size: 18px;
      }
    }
  }

  @media screen and (max-width: 1366px){
    .noPlan{
      width: calc(100% - 200px);
      height: calc(100% - 60px);
      position: fixed;
      top: 60px;
      left: 200px;
      .icon{
        margin: 100px auto 0;
      }
      p{
        margin-top: 40px;
        font-size: 16px;
      }
      button{
        width: 200px;
        height: 35px;
        margin-top: 30px;
        i{
          margin-right: 20px;
          font-size: 16px;
        }
      }
    }
  }
</style>
