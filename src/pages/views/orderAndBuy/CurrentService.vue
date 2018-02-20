<template>
  <div id="CurrentService">
    <div class="havaService" v-if="isShow === 1">
      <div class="wrapper">
        <p>支持激励人员数量：{{ peopleNum }}人</p>
        <div class="circle">
          <el-progress type="circle" :show-text="false" :percentage="peoplePercent" :stroke-width="12"></el-progress>
          <div class="text">
            <span>剩余激励人员数量</span>
            <span>{{ residueCompanyUserCount }}人</span>
          </div>
        </div>
      </div>
      <div class="wrapper">
        <p>使用截止日期：{{ endTime | dateFormat }}</p>
        <div class="circle">
          <el-progress type="circle" :show-text="false" :percentage="dayPercent" :stroke-width="12"></el-progress>
          <div class="text">
            <span>剩余使用天数</span>
            <span>{{ residueDay }}天</span>
          </div>
        </div>
      </div>
      <p v-if="!this.isGoPay">当前服务不满足您的需求时可进行升级，仅需补齐差价，如有疑问，请联系客服<span @click="clickGoBuy">升级</span></p>
      <p v-if="this.isGoPay">您当前有待支付的订单，请前往支付<span @click="clickGoBuy">去支付</span></p>
    </div>

    <div class="noServiece" v-if="isShow === 2 || isShow === 3">
      <div class="icon"></div>
      <p v-if="isShow === 2">您还未购买服务</p>
      <p v-if="isShow === 3">您有未支付的订单，支付继续体验服务</p>
      <button v-if="isShow === 2" @click="clickGoBuy">购买</button>
      <button v-if="isShow === 3" @click="clickGoBuy">去支付</button>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        peopleNum: '',
        residueCompanyUserCount: '',
        peoplePercent: 0,
        endTime: '',
        residueDay: '',
        dayPercent: 0,
        isShow: 0, // 当前服务显示的内容
        isGoPay: false // 是否显示去支付按钮
      }
    },
    mounted () {
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
          let historyOrder = result.data.historyOrder
          this.status = companyUser.status
          if (thisOrder && thisOrder.status === 2 && company.approveStatus === 2) {
            this.isCompanyCertification = true
          }
          if (!thisOrder) {
            console.log('购买')
            this.isShow = 2
          } else if (!historyOrder && thisOrder.status === 1) {
            console.log('去支付')
            this.isShow = 3
          } else {
            console.log('当前服务')
            this.getDatas()
            this.isShow = 1
            // 判断显示升级还是去支付按钮
            if (thisOrder.status === 1) {
              this.isGoPay = true
            } else {
              this.isGoPay = false
            }
          }
        })
      },
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/order/findThisService',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.peopleNum = result.data.peopleNum
            this.residueCompanyUserCount = result.data.residueCompanyUserCount
            this.endTime = result.data.endTime
            this.residueDay = result.data.residueDay
            this.peoplePercent = result.data.peoplePercent
            this.dayPercent = result.data.dayPercent
          }
        })
      },
      // 点击购买
      clickGoBuy () {
        this.$router.replace('/orderbuy?index=1')
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #CurrentService{
    .havaService{
      color: #666;
      .wrapper{
        width: 516px;
        height: 308px;
        background: #EFF3F8;
        display: inline-block;
        margin-right: 34px;
        p{
          text-align: center;
          font-size: 18px;
          line-height: 50px;
        }
        .circle{
          width: 200px;
          height: 200px;
          margin: 20px auto 0;
          position: relative;
          .text{
            width: 100%;
            position: absolute;
            left: 0;
            top: 35%;
            span{
              text-align: center;
              display: block;
            }
            span:first-of-type{
              color: #666;
              font-size: 18px;
            }
            span:last-of-type{
              color: #007bff;
              font-size: 24px;
              line-height: 50px;
            }
          }
        }
      }
      p{
        margin-top: 20px;
        span{
          width: 106px;
          height: 38px;
          line-height:38px;
          background: #62AEFF;
          color: #fff;
          display: inline-block;
          text-align: center;
          border-radius: 4px;
          margin-left: 20px;
          cursor: pointer;
        }
      }
    }

    .noServiece{
      text-align: center;
      .icon{
        width: 40px;
        height: 37px;
        background: url("../../../assets/buyCart.png") no-repeat center;
        margin: 300px auto 0;
      }
      p{
        margin-top: 20px;
        color: #666;
      }
      button{
        width: 106px;
        height: 38px;
        border: 1px solid #5090D3;
        border-radius: 4px;
        background: #fff;
        margin-top: 35px;
        color: #5090D3;
        font-size: 16px;
      }
    }
  }

  @media screen and (max-width: 1366px){
    #CurrentService{
      .havaService{
        .wrapper{
          width: 400px;
          height: 258px;
          margin-right: 25px;
          p{
            font-size: 16px;
            line-height: 35px;
          }
          .circle{
            width: 150px;
            height: 150px;
            .text{
              top: 35%;
              span:first-of-type{
                font-size: 14px;
              }
              span:last-of-type{
                font-size: 20px;
                line-height: 35px;
              }
            }
          }
        }
        p{
          span{
            width: 86px;
            height: 35px;
            line-height:35px;
          }
        }
      }

      .noServiece{
        .icon{
          margin: 150px auto 0;
        }
      }
    }
  }
</style>
