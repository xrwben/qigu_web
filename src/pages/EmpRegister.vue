<template>
  <div id="EmpRegister">
    <div class="logo">
      <img src="../assets/logoColor.png">
    </div>
    <div class="register_wrapper">
      <div class="register_title">
        <h2>注册企股账号</h2>
      </div>
      <div class="register_input">
        <ul>
          <li>
            <input type="text" v-model.trim="registerForm.phone" placeholder="输入手机号" value="" >
          </li>
          <li>
            <input type="text" v-model.trim="registerForm.captcha" placeholder="输入验证码" value="">
            <p class="verificationCode">
              <a v-if="!showInterval" href="javascript:void(0)" @click="getPhoneVerification">获取验证码</a>
              <a v-if="showInterval" href="javascript:void(0)">{{ second }}s</a>
            </p>
          </li>
          <li>
            <input type="password" v-model.trim="registerForm.password" placeholder="请设置六位数及以上的登录密码" value="" >
          </li>
          <li>
            <input type="password" v-model.trim="registerForm.confirmPassword" placeholder="请确认登录密码" value="" >
          </li>
          <li class="agree">
            <input id="agreeCheckbox" v-model.trim="registerForm.agree" type="checkbox"><label for="agreeCheckbox">已阅读并同意</label>
            <a href="http://www.keygood.cn/provision.html" target="_blank">《企股用户隐私权政策》</a>
          </li>
          <li>
            <button @click="submit">完成注册</button>
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
        registerForm: {
          phone: '',
          captcha: '',
          password: '',
          confirmPassword: '',
          rank: '',
          agree: false
        },
        second: 60,
        showInterval: false
      }
    },
    methods: {
      // 获取短信验证码
      getPhoneVerification () {
        if (!this.registerForm.phone) {
          this.$message.warning('请先输入手机号！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.registerForm.phone)) {
          this.$message.warning('请先输入正确格式的手机号！')
        } else {
          this.showInterval = true
          let timer = setInterval(() => {
            this.second = this.second - 1
            if (this.second === 0) {
              clearInterval(timer)
              this.showInterval = false
              this.second = 60
            }
          }, 1000)
          this.axios({
            method: 'POST',
            url: '/keygood/web/captcha/sendPhoneCaptcha',
            data: this.toFormData({
              phone: this.registerForm.phone
            })
          }).then((result) => {
            if (result.data.code === 0) {
            } else {
              this.$message({
                message: result.data.msg,
                type: 'error'
              })
            }
          })
        }
      },
      // 注册
      submit () {
        if (!this.registerForm.phone || !this.registerForm.captcha || !this.registerForm.password) {
          this.$message.warning('请完善信息！')
        } else if (this.registerForm.password.length < 6) {
          this.$message.warning('密码长度必须六位数及以上！')
        } else if (this.registerForm.agree === false) {
          this.$message.warning('注册必须同意企业用户隐私权政策！')
        } else {
          var level = 0
          // 包含数字
          if (/[0-9]/.test(this.registerForm.password)) {
            level++
          }
          // 包含大小写字母
          if (/[a-zA-Z]/.test(this.registerForm.password)) {
            level++
          }
          // 包含特殊字符
          if (/\W/.test(this.registerForm.password)) {
            level++
          }
          if (level === 1) {
            this.registerForm.rank = '低'
          } else if (level === 2) {
            this.registerForm.rank = '中'
          } else if (level === 3) {
            this.registerForm.rank = '高'
          }
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/empRegister',
            data: this.toFormData({
              companyUserId: window.location.href.substring(window.location.href.lastIndexOf('=') + 1),
              phone: this.registerForm.phone,
              captcha: this.registerForm.captcha,
              password: this.registerForm.password,
              newPassword: this.registerForm.confirmPassword,
              rank: this.registerForm.rank
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$router.push('/login')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #EmpRegister{
    height: 100%;
    /*background: url("../assets/loginBg.png") center;*/
    /*background-size: 100% 100%;*/
    overflow: hidden;
  }
  .logo{
    width: 256px;
    height: 72px;
    margin: 103px auto 0;
    img{
      width: 100%;
    }
  }

  /* 表单 */
  .register_wrapper{
    width: 510px;
    background: #fff;
    box-shadow: 0px 0px 20px rgba(51,51,51,0.23);
    border-radius: 4px ;
    margin: 42px auto 0;
    .register_title{
      height: 94px;
      border-radius: 4px 4px 0px 0px;
      h2{
        line-height: 94px;
        text-align: center;
        font-size: 24px;
        color: #333;
        font-weight: normal;
      }
    }
    .register_notice{
      width: 425px;
      margin: 0 auto 10px;
      color: #333;
      font-size: 18px;
      line-height: 30px;
    }
    .register_input{
      margin-top: 24px;
      ul li{
        width:425px;
        height:50px;
        border-radius: 4px ;
        margin: 0 auto;
        padding-bottom: 24px;
        line-height: 50px;
        position: relative;
        input[type='text'],input[type='password']{
          width: 100%;
          height: 100%;
          border: 1px solid #c5c5c5;
          border-radius: 4px;
          text-indent: 10px;
          /*font-size: 16px;*/
        }
        .verificationCode{
          position: absolute;
          right: -1px;
          top: 0;
          /*background: #fff;*/
          margin-top: 2px;
          height: 50px;
          overflow: hidden;
          #canvas{
            border-radius: 0px 4px 4px 0;
          }
          a{
            color: #333;
            font-size: 16px;
            border-left: 1px solid #999;
            padding: 0 10px;
            outline: none;
          }
        }
        .el-select{
          width: 100%;
          height: 100%;
          border-radius: 4px;
          color: #999;
        }
        button{
          width: 100%;
          height: 100%;
          background: #62aeff;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          color: #fff;
          font-size: 18px;
          letter-spacing: 5px;
        }
      }
      ul li.agree{
        height: 30px;
        line-height: 30px;
        margin-top: -14px;
        font-size: 14px;
        label{
          display: inline-block;
          vertical-align: middle;
        }
        input{
          margin-right: 3px;
          vertical-align: middle;
        }
        a{
          color: #62aeff;
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    .loginTips{
      font-size: 14px;
      a{
        color: #fff;
      }
    }
    .logo{
      width: 200px;
      height: 50px;
      margin: 73px auto 0;
    }
    .stepRegister{
      margin-top: 25px;
    }
    .register_wrapper{
      width: 410px;
      /*min-height: 325px;*/
      margin: 32px auto 0;
      .register_title{
        height: 64px;
        h2{
          line-height: 64px;
          font-size: 20px;
        }
      }
      .register_notice{
        width: 325px;
        font-size: 16px;
        line-height: 20px;
      }
      .register_input{
        margin-top: 0px;
        ul li{
          width:325px;
          height:35px;
          margin: 0 auto;
          padding-bottom: 20px;
          line-height: 35px;
          .verificationCode{
            height: 35px;
            #canvas{

            }
            a{
              font-size: 14px;
            }
          }
          button{
            font-size: 14px;
          }
        }
        ul li.agree{
          height: 30px;
          line-height: 30px;
          margin-top: -14px;
          font-size: 14px;
          padding-bottom: 10px;
          a{
            color: #62aeff;
          }
        }
      }
    }
  }
</style>
