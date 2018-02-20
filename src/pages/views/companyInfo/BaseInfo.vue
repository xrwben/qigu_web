<template>
  <div id="BaseInfo">
    <p><span>企业全称：</span> {{ companyDetails.companyName }}</p>
    <p><span>企业简称：</span> {{ companyDetails.companyAbbreviation }}</p>
    <p><span>企业类型：</span> {{ companyDetails.type | companyType }}</p>
    <p><span>资本币种：</span> {{ companyDetails.currency }}</p>
    <p><span>营业执照：</span> </p>
    <div>
      <img :src="companyDetails.license">
    </div>
  </div>
</template>

<script>
 export default {
   data () {
     return {
       companyDetails: {}
     }
   },
   mounted () {
     this.getDatas()
   },
   methods: {
     // 获取公司信息
     getDatas () {
       this.axios({
         method: 'GET',
         url: '/keygood/web/company/findOne',
         params: {
           companyId: JSON.parse(sessionStorage.getItem('company')).companyId
         }
       }).then((result) => {
         if (result.data.code === 0) {
           this.companyDetails = result.data.company
         }
       })
     }
   }
 }
</script>

<style type="text/css" lang="scss" scoped>
  #BaseInfo{
    width: 410px;
    height: 470px;
    box-shadow: 0 0 10px rgba(102,102,102,0.57);
    padding: 20px 30px;
    color: #666;
    p{
      line-height: 45px;
      span{
        color: #333;
      }
    }
    div{
      width: 410px;
      height: 240px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }

  @media screen and (max-width: 1366px){
    #BaseInfo{
      width: 310px;
      height: 370px;
      padding: 20px 30px;
      color: #666;
      font-size: 14px;
      p{
        line-height: 35px;
        span{
          color: #333;
        }
      }
      div{
        width: 310px;
        height: 180px;
        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
