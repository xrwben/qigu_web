<template>
  <div id="ForgetPassword">
    <div class="forgetPass">
      <img src="../assets/logo.png">
    </div>
    <div class="forget_wrapper">
      <div class="forget_title">
        <h2>您正在找回密码</h2>
      </div>
      <div class="forget_input">
        <ul>
          <li>
            <i class="iconfont icon-xinxi-"></i>
            <input type="text" v-model="forget.email" placeholder="请输入邮箱">
          </li>
          <li>
            <i class="iconfont icon-baohu"></i>
            <input type="password" v-model="forget.captcha" placeholder="请输入验证码">
            <p class="verificationCode">
              <a v-if="!showInterval" href="javascript:void(0)" @click="getCaptcha">获取验证码</a>
              <a v-if="showInterval" href="javascript:void(0)">{{ second }}s</a>
            </p>
          </li>
          <li>
            <i class="iconfont icon-suo1"></i>
            <input type="password" v-model="forget.password" @keyup="checkDegree" placeholder="请输入您的新密码">
          </li>
          <li>
            <button @click="submitForm">提交</button>
          </li>
          <li class="clearfix">
            <span><router-link :to="{name: 'Login'}">登录>></router-link></span>
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
        forget: {
          email: '',
          captcha: '',
          password: '',
          rank: ''
        },
        showInterval: false,
        second: 60
      }
    },
    methods: {
      // 获取邮箱验证码
      getCaptcha () {
        if (!this.forget.email.trim()) {
          this.$message.warning('请先输入邮箱地址！')
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.forget.email.trim())) {
          this.$message.warning('请输入正确的邮箱地址！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/captcha/sendEmailCaptcha',
            data: this.toFormData({
              email: this.forget.email.trim()
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.showInterval = true
              let timer = setInterval(() => {
                this.second = this.second - 1
                if (this.second === 0) {
                  clearInterval(timer)
                  this.showInterval = false
                }
              }, 1000)
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          })
        }
      },
      // 检测密码等级
      checkDegree () {
        var level = -1
        if (this.forget.password.trim().length < 6) {
          return false
        }
        // 包含数字
        if (/[0-9]/.test(this.forget.password.trim())) {
          level++
        }
        // 包含大小写字母
        if (/[a-zA-Z]/.test(this.forget.password.trim())) {
          level++
        }
        // 包含特殊字符
        if (/\W/.test(this.forget.password.trim())) {
          level++
        }
        if (level === 0) {
          this.forget.rank = '低'
        } else if (level === 1) {
          this.forget.rank = '中'
        } else if (level === 2) {
          this.forget.rank = '高'
        }
      },
      // 提交
      submitForm () {
        if (!this.forget.email.trim() || !this.forget.captcha.trim() || !this.forget.password.trim()) {
          this.$message.warning('请完善信息！')
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.forget.email.trim())) {
          this.$message.warning('请输入正确的邮箱地址！')
        } else if (this.forget.password.trim().length < 6) {
          this.$message.warning('请输入六位数及以上的密码！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/findPassword',
            data: this.toFormData({
              email: this.forget.email.trim(),
              captcha: this.forget.captcha.trim(),
              password: this.forget.password.trim(),
              rank: this.forget.rank.trim()
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message({
                message: '密码修改成功，请登录！',
                type: 'success'
              })
              this.$router.push('/login')
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ForgetPassword{
    height: 100%;
    background: url("../assets/loginBg.png") center;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .forgetPass{
    width: 256px;
    height: 72px;
    margin: 10% auto 0;
  }
  .forget_wrapper{
    width: 510px;
    background: rgba(255,255,255,1);
    border-radius: 4px ;
    margin: 42px auto 0;
    .forget_title{
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
    .forget_input{
      margin-top: 30px;
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
        .verificationCode{
          position: absolute;
          right: 0;
          top: 0;
          /*background: #fff;*/
          margin-top: 2px;
          a{
            color: #333;
            font-size: 16px;
            border-left: 1px solid #999;
            padding: 0 10px;
            outline: none;
          }
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
      ul li:nth-child(4){
        margin-bottom: 0;
        border: 0;
      }
    }
  }
  @media screen and (max-width: 1366px){
    .forgetPass{
      width: 200px;
      height: 50px;
      margin: 100px auto 0;
      img{
        width: 100%;
      }
    }
    .forget_wrapper{
      width: 410px;
      min-height: 340px;
      .forget_title{
        height: 64px;
        h2{
          line-height: 64px;
          font-size: 20px;
        }
      }
      .forget_input{
        margin-top: 30px;
        ul li{
          width:325px;
          height:35px;
          margin: 0 auto 20px;
          line-height: 35px;
          i{
            font-size: 16px;
          }
          .verificationCode{
            margin-top: 2px;
            a{
              font-size: 14px;
            }
          }
          input{
            text-indent: 40px;
          }
          button{
            font-size: 16px;
          }
        }
      }
    }
  }
</style>
