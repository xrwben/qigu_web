<template>
  <div id="NavBar">
    <el-row class="wrapper">
      <el-col :span="12">
        <div class="nav_left">{{ company.companyName }}<span v-if="company.currency">（{{ company.currency }}）</span></div>
      </el-col>
      <el-col :span="12">
        <div class="nav_right">
          <span>
            <i class="iconfont icon-help"></i>
            <router-link to="/helpcenter">帮助</router-link>
          </span>
          <span>
            <img v-if="!companyUser.headImg" src="../../assets/headerImg.png">
            <img v-if="companyUser.headImg" :src="companyUser.headImg">
            <router-link to="/my/myinfo">您好，{{ companyUser.realName }}</router-link>
          </span>
          <span @click="loginOut()"><i class="iconfont icon-tuichu"></i></span>
        </div>
      </el-col>
    </el-row>

    <!-- 付费倒计时提醒 -->
    <div class="tips" v-if="this.day">
      您的免费使用时间还剩下<i>{{ day }}</i>天
      <router-link to="/orderbuy?index=1">
        <a href="javascript:void(0)">我要付费</a>
      </router-link>
    </div>

    <!-- 付费通知 -->
    <pay-note v-if="this.isShowPay"></pay-note>

    <!-- 企业认证 -->
    <company-certification v-if="this.isCompanyCertification" v-on:isShow="closePopup"></company-certification>
  </div>
</template>

<script>
  import PayNote from '../../components/popup/PayNote.vue'
  import CompanyCertification from '../../components/popup/CompanyCertification.vue'
  export default {
    data () {
      return {
        day: 0,
        isShowPay: false,
        isCompanyCertification: false,
        company: JSON.parse(sessionStorage.getItem('company')) || null,
        companyUser: JSON.parse(sessionStorage.getItem('companyUser')) || null
      }
    },
    components: {
      PayNote,
      CompanyCertification
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
          // 把数据保存在本地
          sessionStorage.setItem('company', JSON.stringify(result.data.company))
          sessionStorage.setItem('companyUser', JSON.stringify(result.data.companyUser))
          sessionStorage.setItem('historyOrder', JSON.stringify(result.data.historyOrder))
          sessionStorage.setItem('thisOrder', JSON.stringify(result.data.thisOrder))
          this.hideBuyPopup()
        })
      },
      hideBuyPopup () {
        let company = JSON.parse(sessionStorage.getItem('company'))
        let companyUser = JSON.parse(sessionStorage.getItem('companyUser'))
        let historyOrder = JSON.parse(sessionStorage.getItem('historyOrder'))
        let thisOrder = JSON.parse(sessionStorage.getItem('thisOrder'))
        let timer = Math.ceil(((companyUser.activateTime + 7 * 24 * 60 * 60 * 1000) - new Date().getTime()) / (24 * 60 * 60 * 1000))
        this.day = timer <= 0 ? 0 : timer

        // 判断是否显示倒计时弹框
        if ((!thisOrder && timer > 0) || (thisOrder && thisOrder.status === 1 && !historyOrder && timer > 0)) {
          this.day = timer
        } else if ((thisOrder && thisOrder.status === 2) || historyOrder) {
          this.day = 0
        }
        // 判断是否显示付费通知弹框
        if (companyUser.status === 1) {
          this.isShowPay = false
        } else if ((!thisOrder && timer <= 0) || (thisOrder && thisOrder.status === 1 && historyOrder && historyOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 2 && thisOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 1 && !historyOrder && timer <= 0)) {
          this.isShowPay = true
          console.log(111)
          if (window.location.href.indexOf('orderbuy') > -1) {
            this.isShowPay = false
            console.log(444)
          } else {
            this.isShowPay = true
            console.log(555)
          }
          console.log(222)
        } else if (thisOrder && thisOrder.status === 2 && (company.approveStatus === 1 || company.approveStatus === 4)) {
          this.isCompanyCertification = true
        } else {
          this.isShowPay = false
          this.isCompanyCertification = false
          console.log(333)
        }
      },
      // 退出登录
      loginOut () {
        this.$confirm('确认退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
          sessionStorage.clear()
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出！'
          })
        })
      },
      closePopup () {
        console.log('认证关闭')
        this.isCompanyCertification = false
        this.$router.go(0)
      }
    },
    watch: {
      '$route': 'getInfo'
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NavBar{
    position: relative;
    .wrapper{
      height: 80px;
      background: #62AEFF;
      line-height: 80px;
      padding: 0 30px;
      color: #fff;
      .nav_right{
        height: 80px;
        text-align: right;
        font-size: 0;
        span{
          margin: 0 10px;
          display: inline-block;
          font-size: 16px;
          cursor: pointer;
          i{
            margin-right: 5px;
            display: inline-block;
            vertical-align: middle;
            font-size: 18px;
          }
          a{
            color: #fff;
          }
          img{
            width: 50px;
            height: 50px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
            border: 1px solid #fff;
            border-radius: 50%;
          }
        }
        span:nth-child(1){
          margin-right: 80px;
        }
      }
    }
  }
  .tips{
    width: 472px;
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #666;
    box-shadow: 0 0 10px rgba(102,102,102,0.57);
    background: #fff;
    text-align: center;
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 101;
    i{
      color: #EE601A;
      margin: 0 5px;
    }
    a{
      color: #5090D3;
      margin-left: 60px;
      text-decoration: underline;
    }
  }

  @media screen and (max-width: 1366px){
    #NavBar{
      .wrapper{
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        .nav_right{
          height: 60px;
          span{
            font-size: 14px;
            i{
              font-size: 16px;
            }
            img{
              width: 35px;
              height: 35px;
            }
          }
          span:nth-child(1){
            margin-right: 60px;
          }
        }
      }
    }
    .tips{
      width: 400px;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      top: 60px;
      a{
        margin-left: 35px;
        font-size: 14px;
      }
    }
  }
</style>
