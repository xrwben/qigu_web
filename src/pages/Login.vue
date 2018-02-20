<template>
  <div id="Login">
    <div class="logo">
      <img src="../assets/logo.png">
    </div>
    <div class="login_wrapper">
      <div class="login_title">
        <h2>登录</h2>
      </div>
      <div class="login_input">
        <ul>
          <li>
            <i class="iconfont icon-touxiang-copy-copy"></i>
            <input type="text" spellcheck="false" v-model.trim="login.account" @keydown.enter="submitForm" autofocus placeholder="请输入邮箱/手机号码">
          </li>
          <li>
            <i class="iconfont icon-suo1"></i>
            <input type="password" v-model.trim="login.password" @keydown.enter="submitForm" placeholder="请输入密码">
          </li>
          <li class="clearfix">
            <span><router-link :to="{name: 'Register'}">注册</router-link></span>
            <span><router-link :to="{name: 'ForgetPassword'}">忘记密码?</router-link></span>
          </li>
          <li>
            <button @click.prevent="submitForm" :loading="showLoading">{{ loginTxt }}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        login: {
          account: '',
          password: ''
        },
        loginTxt: '登录',
        showLoading: false
      }
    },
    methods: {
      submitForm () {
        if (!this.login.account) {
          this.$message.warning('账号不能为空！')
        } else if (!this.login.password) {
          this.$message.warning('密码不能为空！')
        } else {
          this.loginTxt = '登录中'
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/login',
            data: this.toFormData({
              account: this.login.account.trim(),
              password: this.login.password.trim()
            })
          }).then((result) => {
            if (result.data.code === 0) {
              // 把数据保存在本地
              sessionStorage.setItem('token', result.data.token)
              sessionStorage.setItem('company', JSON.stringify(result.data.company))
              sessionStorage.setItem('companyUser', JSON.stringify(result.data.companyUser))
              sessionStorage.setItem('historyOrder', JSON.stringify(result.data.historyOrder))
              sessionStorage.setItem('thisOrder', JSON.stringify(result.data.thisOrder))
              // 登录跳转
              if (result.data.companyUser.logonMode === 1) {
                this.$router.push('/stock')
              } else {
                if (result.data.companyUser.role) {
                  if (result.data.companyUser.role.charAt(0) === '1') {
                    this.$router.push('/stock')
                  } else if (result.data.companyUser.role.charAt(0) === '2') {
                    this.$router.push('/companymanagement')
                  } else {
                    this.$router.push('/my')
                  }
                } else {
                  this.$router.push('/my')
                }
              }
            }
          }).catch(() => {
            this.loginTxt = '登录'
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Login{
    height: 100%;
    background: url("../assets/loginBg.png") center;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .logo{
    width: 256px;
    height: 72px;
    margin: 217px auto 0;
    img{
      width: 100%;
    }
  }
  .login_wrapper{
    width: 510px;
    min-height: 415px;
    background: rgba(255,255,255,1);
    border-radius: 4px ;
    margin: 42px auto 0;
    .login_title{
      height: 94px;
      background:rgba(98,174,255,1);
      border-radius: 4px 4px 0px 0px;
      h2{
        line-height: 94px;
        text-align: center;
        font-size: 24px;
        color: #fff;
        font-weight: normal;
      }
    }
    .login_input{
      margin-top: 50px;
      ul li{
        width:425px;
        height:50px;
        border-radius: 4px ;
        margin: 0 auto 24px;
        line-height: 50px;
        position: relative;
        i{
          font-size: 20px;
          color: #999;
          position: absolute;
          left: 15px;
          top: 0;
          padding: 0;
          display: block;
        }
        input{
          width: 100%;
          height: 100%;
          border: 1px solid #c5c5c5;
          text-indent: 50px;
          border-radius: 4px;
          /*color: #999;*/
        }
        span a{
          font-size: 14px;
          color: #5090D3;
        }
        span:first-of-type{
          float: left;
          margin-left: 5px;
        }
        span:last-of-type{
          float: right;
          margin-right: 5px;
        }
        button{
          width: 100%;
          height: 100%;
          background: #62aeff;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          color: #fff;
          font-size: 18px;
          letter-spacing: 20px;
        }
      }
      ul li:nth-child(3){
        margin-top: -20px;
        margin-bottom: 24px;
        border: 0;
        height: 30px;
        line-height: 30px;
      }
      ul li:nth-child(4){
        margin-bottom: 0;
        border: 0;
      }
    }
  }

  @media screen and (max-width: 1600px){
    .logo{
      width: 200px;
      height: 50px;
      margin: 100px auto 0;
      img{
        width: 100%;
      }
    }
    .login_wrapper {
      width: 410px;
      min-height: 315px;
      .login_title {
        height: 64px;
        h2 {
          line-height: 64px;
          font-size: 20px;
        }
      }
      .login_input{
        margin-top: 40px;
        ul li{
          width:325px;
          height:35px;
          margin: 0 auto 20px;
          line-height: 35px;
          i{
            font-size: 16px;
          }
          input{
            text-indent: 40px;
          }
          button{
            font-size: 16px;
          }
        }
        ul li:nth-child(3){
          margin-top: -15px;
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
