<template>
  <div id="AppHome">
    <transition name="fade" mode="out-in">
      <router-view v-if="status !== 1 && !isCompanyCertification"></router-view>
      <active-mail-box v-if="status === 1"></active-mail-box>
      <!-- 企业认证中 -->
      <certification v-if="isCompanyCertification"></certification>
    </transition>
  </div>
</template>

<script>
  import ActiveMailBox from '../../components/ActiveMailBox.vue'
  import Certification from '../../components/Certification.vue' // 认证中组件
  export default {
    data () {
      return {
        status: JSON.parse(sessionStorage.getItem('companyUser')).status,
        isCompanyCertification: false
      }
    },
    components: {
      ActiveMailBox,
      Certification
    },
    created () {
      this.getInfo()
    },
    methods: {
      getInfo () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/findOwnInfo',
          params: {
            companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId
          }
        }).then((result) => {
          let company = result.data.company
          let companyUser = result.data.companyUser
          let thisOrder = result.data.thisOrder
          this.status = companyUser.status
          if (thisOrder && thisOrder.status === 2 && company.approveStatus === 2) {
            this.isCompanyCertification = true
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #AppHome{
    height: calc(100% - 80px);
    overflow-y: auto;
    padding: 0 30px;
  }

  @media screen and (max-width: 1366px){
    #AppHome{
      height: calc(100% - 60px);
    }
  }
</style>
