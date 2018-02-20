<template>
  <div id="MyAsset">
    <el-tabs v-model="activeName" v-if="isShowPopup === 1">
      <el-tab-pane label="当前分红股" name="CurrentShareStock">
        <current-share-stock v-if="activeName === 'CurrentShareStock'"></current-share-stock>
      </el-tab-pane>
      <el-tab-pane label="当前受限股" name="CurrentRestrictedStock">
        <current-restricted-stock v-if="activeName === 'CurrentRestrictedStock'"></current-restricted-stock>
      </el-tab-pane>
    </el-tabs>

    <!-- 实名认证 -->
    <set-certification v-if="isShowPopup === 2" v-on:isShow="closePopup"></set-certification>

    <!-- 等待认证中 -->
    <certification v-if="isShowPopup === 3"></certification>

  </div>
</template>

<script>
  import CurrentShareStock from '../views/personal/CurrentShareStock.vue'
  import CurrentRestrictedStock from '../views/personal/CurrentRestrictedStock.vue'
  import SetCertification from '../../components/popup/SetCertification.vue'
  import Certification from '../../components/Certification.vue'
  export default{
    data () {
      return {
        activeName: 'CurrentShareStock',
        isShowPopup: 0
      }
    },
    components: {
      CurrentShareStock,
      CurrentRestrictedStock,
      SetCertification,
      Certification
    },
    mounted () {
      let timer = Math.ceil(((JSON.parse(sessionStorage.getItem('companyUser')).activateTime + 7 * 24 * 60 * 60 * 1000) - new Date().getTime()) / (24 * 60 * 60 * 1000))
      let historyOrder = JSON.parse(sessionStorage.getItem('historyOrder'))
      let thisOrder = JSON.parse(sessionStorage.getItem('thisOrder'))
      if (!((!thisOrder && timer <= 0) || (thisOrder && thisOrder.status === 1 && historyOrder && historyOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 2 && thisOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 1 && !historyOrder && timer <= 0))) {
        if (JSON.parse(sessionStorage.getItem('companyUser')).status === 2 || JSON.parse(sessionStorage.getItem('companyUser')).status === 5) {
          this.isShowPopup = 2
        } else if (JSON.parse(sessionStorage.getItem('companyUser')).status === 3) {
          this.isShowPopup = 3
        } else {
          this.isShowPopup = 1
        }
      }
    },
    methods: {
      closePopup () {
        this.isShowPopup = 0
      }
    }
  }
</script>

<style>

</style>
