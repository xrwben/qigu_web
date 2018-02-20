<template>
  <div id="SetPhone">
    <div class="wrapper">
      <div class="title">手机绑定<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div>
          <input type="text" v-model="phone" placeholder="请输入您的手机号码">
        </div>
        <div class="password">
          <input type="text" v-model="captcha" placeholder="请输入验证码">
          <p class="verificationCode">
            <a v-if="!showInterval" href="javascript:void(0)" @click="getPhoneVerification">获取验证码</a>
            <a v-if="showInterval" href="javascript:void(0)">{{ second }}s</a>
          </p>
        </div>
        <div class="btn">
          <button @click="close()">取消</button>
          <button @click="submit()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        phone: '',
        captcha: '',
        second: 60,
        showInterval: false
      }
    },
    methods: {
      // 获取短信验证码
      getPhoneVerification () {
        if (!this.phone.trim()) {
          this.$message.warning('请先输入手机号！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.phone.trim())) {
          this.$message.warning('请先输入正确格式的手机号！')
        } else {
          this.showInterval = true
          let timer = setInterval(() => {
            this.second = this.second - 1
            if (this.second === 0) {
              clearInterval(timer)
              this.second = 60
              this.showInterval = false
            }
          }, 1000)
          this.axios({
            method: 'POST',
            url: '/keygood/web/captcha/sendPhoneCaptcha',
            data: this.toFormData({
              phone: this.phone
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
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 绑定手机
      submit () {
        if (!this.phone.trim() && !this.captcha.trim()) {
          this.$message.warning('信息不能为空！')
        } else if (!/^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(this.phone.trim())) {
          this.$message.warning('请先输入正确格式的手机号！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/bindPhone',
            data: this.toFormData({
              companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
              phone: this.phone,
              captcha: this.captcha
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$emit('isShow', 'update')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetPhone{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 280px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #62AEFF;
        text-align: center;
        color: #fff;
        font-size: 24px;
        position: relative;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        margin-top: 25px;
        text-align: center;
        font-size: 0;
        div{
          width: 372px;
          height: 40px;
          margin: 0 auto 15px;
          font-size: 0;
        }
        .password{
          position: relative;
        }
        input{
          width: 100%;
          height: 100%;
          border: 1px solid #c5c5c5;
          text-indent: 15px;
          display: inline-block;
        }
        .verificationCode{
          height: 100%;
          line-height: 40px;
          position: absolute;
          right: 0;
          top: 0;
          margin-top: 1px;
          a{
            color: #333;
            font-size: 14px;
            border-left: 1px solid #999;
            padding: 0 10px;
          }
        }
        .btn{
          margin-top: 25px;
          button{
            width: 106px;
            height: 38px;
            border: 1px solid #E3E3E3;
            border-radius: 4px;
            margin: 0 15px;
            background: #fff;
            color: #666;
            font-size: 16px;
          }
          button:last-of-type{
            background: #62AEFF;
            color: #fff;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #SetPhone{
      .wrapper{
        width: 500px;
        height: 235px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 25px;
          div{
            width: 300px;
            height: 35px;
          }
          input{
            text-indent: 10px;
          }
          .verificationCode{
            line-height: 35px;
          }
          .btn{
            margin-top: 25px;
            button{
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
