<template>
  <div id="CompanyInfo">
    <el-tabs v-model="activeName">
      <el-tab-pane label="企业信息" name="BaseInfo">
        <base-info v-if="activeName === 'BaseInfo'"></base-info>
      </el-tab-pane>
      <el-tab-pane label="基本设置" name="BaseSetting">
        <base-setting v-if="activeName === 'BaseSetting'"></base-setting>
      </el-tab-pane>
      <el-tab-pane label="净资产变更记录" name="ChangeRecord">
        <change-record v-if="activeName === 'ChangeRecord'"></change-record>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import BaseInfo from '../views/companyInfo/BaseInfo.vue'
  import BaseSetting from '../views/companyInfo/BaseSetting.vue'
  import ChangeRecord from '../views/companyInfo/ChangeRecord.vue'
  export default{
    data () {
      return {
        activeName: 'BaseInfo'
      }
    },
    components: {
      BaseInfo,
      BaseSetting,
      ChangeRecord
    }
  }
</script>

<style>

</style>
