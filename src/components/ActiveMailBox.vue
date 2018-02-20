<template>
  <div id="ActiveMailBox">
    <div class="logo"></div>
    <div>
      <p>激活邮件已发送到<span>{{ email }}</span>邮箱，请在邮件中点击激活按钮</p>
      <p>没有收到邮件？</p>
      <p>检查下是否在垃圾邮件中，如果没有请<span @click="sendEmail">重新发送</span></p>
      <p>依然无法解决？请联系客服</p>
      <p>
        <span><i class="iconfont icon-shouji"></i>400-827-8038</span>
        <span><i class="iconfont icon-xinxi-"></i>service@keygood.cn</span>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        email: JSON.parse(sessionStorage.getItem('companyUser')).email
      }
    },
    methods: {
      // 点击发送激活邮件
      sendEmail () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/sendEmailActivate',
          params: {
            companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('邮件发送成功！')
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ActiveMailBox{
    text-align: center;
    color: #333;
    .logo{
      width: 148px;
      height: 148px;
      margin: 110px auto 0;
      background: url("../assets/activeMailBox.png") no-repeat center;
    }
    p:nth-child(1){
      font-size: 18px;
      margin-top: 55px;
      span{
        color: #62AEFF;
        font-size: 24px;
        margin: 0 10px;
      }
    }
    p:nth-child(2){
      font-size: 16px;
      margin-top: 45px;
    }
    p:nth-child(3){
      font-size: 16px;
      margin-top: 20px;
      span{
        color: #62AEFF;
        font-size: 18px;
        margin: 0 10px;
        cursor: pointer;
      }
    }
    p:nth-child(4){
      font-size: 16px;
      margin-top: 45px;
      padding-top: 25px;
      border-top: 1px solid #E3E3E3;
    }
    p:nth-child(5){
      font-size: 16px;
      margin-top: 28px;
      span{
        margin: 0 40px;
        i{
          margin-right: 10px;
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #ActiveMailBox{
      .logo{
        width: 100px;
        height: 100px;
        margin: 60px auto 0;
        background: url("../assets/activeMailBox.png") no-repeat center;
        background-size: cover;
      }
      p:nth-child(1){
        font-size: 16px;
        margin-top: 35px;
        span{
          font-size: 20px;
        }
      }
      p:nth-child(2){
        font-size: 14px;
        margin-top: 25px;
      }
      p:nth-child(3){
        font-size: 14px;
        margin-top: 10px;
        span{
          font-size: 16px;
        }
      }
      p:nth-child(4){
        font-size: 14px;
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #E3E3E3;
      }
      p:nth-child(5){
        font-size: 14px;
        margin-top: 20px;
        span{
          margin: 0 20px;
          i{
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
