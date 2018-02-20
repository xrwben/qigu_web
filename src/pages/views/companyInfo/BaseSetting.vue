<template>
  <div id="BaseSetting">
    <p><span>净资产：</span>{{ companyDetails.netEstate }}元人民币<a href="javascript:void(0)" @click="setPopup(1)">修改</a></p>
    <p><span>融资轮次：</span>{{ companyDetails.financing || '--' }}<a href="javascript:void(0)" @click="setPopup(2)">修改</a></p>
    <p><span>公司估值：</span>{{ companyDetails.appraisement }}元人民币<a href="javascript:void(0)" @click="setPopup(3)">修改</a></p>
    <p>
      <span>显示授予名称及邮箱：</span>
      <el-switch class="switch" v-model="showNameEmail" @change="isShowNameEmail" active-color="#62AEFF"></el-switch>
      <i class="showTips iconfont icon-help">
        <label class="tips">
          开启后可显示激励对象名称及邮箱，不开启时系统会进行加密显示
        </label>
      </i>

    </p>
    <p><span>公司对公账号：</span>{{ companyDetails.account || '--' }}<a href="javascript:void(0)" @click="setPopup(4)">修改</a></p>

    <!-- 设置净资产 -->
    <set-net-assets v-if="showSetNetAssets" v-on:isShow="closePopup"></set-net-assets>

    <!-- 修改融资轮次 -->
    <set-finance-times v-if="showSetFinanceTimes" v-on:isShow="closePopup"></set-finance-times>

    <!-- 修改公司估值 -->
    <set-company-value v-if="showSetCompanyValue" v-on:isShow="closePopup"></set-company-value>

    <!-- 完善对公账户 -->
    <set-corporate-account v-if="showSetCorporateAccount" v-on:isShow="closePopup"></set-corporate-account>

  </div>
</template>

<script>
 import SetNetAssets from '../../../components/popup/SetNetAssets.vue'
 import SetFinanceTimes from '../../../components/popup/SetFinanceTimes.vue'
 import SetCompanyValue from '../../../components/popup/SetCompanyValue.vue'
 import SetCorporateAccount from '../../../components/popup/SetCorporateAccount.vue'
 export default {
   data () {
     return {
       companyDetails: {},
       showNameEmail: false, // 授予名称及邮箱开关
       showSetNetAssets: false,  // 是否显示设置净资产弹窗
       showSetFinanceTimes: false,  // 是否显示融资轮次弹窗
       showSetCompanyValue: false,  // 是否显示公司估值弹窗
       showSetCorporateAccount: false // 是否显示对公账户
     }
   },
   components: {
     SetNetAssets,
     SetFinanceTimes,
     SetCompanyValue,
     SetCorporateAccount
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
           this.showNameEmail = result.data.company.showNameEmail
         }
       })
     },
     // 设置弹窗
     setPopup (i) {
       if (i === 1) {
         this.showSetNetAssets = true
       } else if (i === 2) {
         this.showSetFinanceTimes = true
       } else if (i === 3) {
         this.showSetCompanyValue = true
       } else if (i === 4) {
         this.showSetCorporateAccount = true
       }
     },
   // 关闭弹窗
     closePopup (value) {
       if (value && value === 'update') {
         this.getDatas()
       }
       this.showSetNetAssets = false
       this.showSetFinanceTimes = false
       this.showSetCompanyValue = false
       this.showSetCorporateAccount = false
     },
     // 更新显示授予名称及邮箱
     isShowNameEmail () {
       this.axios({
         method: 'POST',
         url: '/keygood/web/company/editShowNameEmail',
         data: this.toFormData({
           showNameEmail: this.showNameEmail,
           companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
           companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
           ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
         })
       }).then((result) => {
         if (result.data.code === 0) {
           this.$message.success('信息修改成功！')
         }
       })
     }
   }
 }
</script>

<style type="text/css" lang="scss" scoped>
  #BaseSetting{
    width: 410px;
    height: 256px;
    box-shadow: 0 0 10px rgba(102,102,102,0.57);
    padding: 20px 30px;
    color: #666;
    p{
      line-height: 50px;
      position: relative;
      span{
        color: #333;
        margin-right: 30px;
        font-size: 18px;
      }
      .switch{
        height: 25px;
      }
      a,i{
        float: right;
        color: #62AEFF;
      }
      i{
        font-size: 22px;
      }
      .tips{
        width: 200px;
        line-height: 20px;
        background: #999;
        color: #fff;
        font-size: 14px;
        padding: 15px 10px;
        position: absolute;
        left: 100%;
        top: 0;
        margin-left: 10px;
        opacity: 0;
        transition: all .5s ease-in-out;
      }
      .tips:before{
        content: '';
        border: 10px solid #999;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid transparent;
        position: absolute;
        left: -20px;
        top: 10px;
      }
      i.showTips:hover{
        color: #666;
        cursor: pointer;
      }
      i.showTips:hover label.tips{
        opacity: 1;
      }
    }
  }

  @media screen and (max-width: 1366px){
    #BaseSetting{
      width: 410px;
      height: 210px;
      font-size: 14px;
      p{
        line-height: 40px;
        span{
          margin-right: 20px;
          font-size: 14px;
        }
        i{
          font-size: 20px;
        }
      }
    }
  }
</style>
