<template>
  <div id="Register">
    <div class="loginTips">
      已有账户?<router-link :to="{name: 'Login'}">马上登陆>></router-link>
    </div>
    <div class="logo">
      <img src="../assets/logo.png">
    </div>
    <!-- 步骤进度条 -->
    <div class="stepRegister">
      <steps :stepCon="['1.填写企业名称', '2.填写联系方式', '3.填写个人信息']" :step="activeIndex" v-on:stepIndex="stepIndex"></steps>
    </div>

    <!--step1-->
    <div class="register_wrapper" v-show="activeIndex === 0">
      <div class="register_title">
        <h2>首先我们需要知道贵公司的全称</h2>
      </div>
      <div class="register_notice">
        <p>企业全称将用于股权激励计划相关的法律文件中，为确保协议的合规有效，请选择贵公司在工商登记时的全称。</p>
      </div>
      <div class="register_input">
        <ul>
          <li>
            <input type="text" v-model.trim="registerForm.companyName" placeholder="请输入企业全称" value="">
          </li>
          <li>
            <el-select v-model.trim="registerForm.companyType" placeholder="请选择企业类型">
              <el-option label="有限责任公司" value="1"></el-option>
              <el-option label="股份有限公司" value="2"></el-option>
            </el-select>
          </li>
          <li>
            <button @click="next()">下一步</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="register_wrapper" v-show="activeIndex === 1">
      <div class="register_title">
        <h2>请提供您的常用邮箱地址，方便我们联系您</h2>
      </div>
      <div class="register_notice">
        <p>您的邮箱将用于登录系统和接收系统发送的重要通知（协议签署邀请，股权认购通知等），您的真实姓名将用于系统生成的相关法律文件中，为确认协议的合规有效和系统正常使用，请您规范填写。</p>
      </div>
      <div class="register_input">
        <ul>
          <li>
            <input type="text" v-model.trim="registerForm.email" spellcheck="false" placeholder="您的常用邮箱" value="" >
          </li>
          <li>
            <input type="text" v-model.trim="registerForm.realName" placeholder="您的真实姓名" value="" >
          </li>
          <li>
            <button @click="next()">下一步</button>
          </li>
        </ul>
      </div>
    </div>

    <!--step3-->
    <div class="register_wrapper register_wrapper3"  v-show="activeIndex === 2">
      <div class="register_title">
        <h2>我们希望知道您的基本信息，以便更好的为您服务</h2>
      </div>
      <div class="register_input">
        <ul>
          <li>
            <input type="text" v-model.trim="registerForm.picCod" placeholder="图形验证码" value="">
            <p class="verificationCode">
              <canvas id='canvas' width='120' @click="repanitCode"></canvas>
            </p>
          </li>
          <li>
            <input type="text" v-model.trim="registerForm.phone" placeholder="你的手机号" value="" >
          </li>
          <li>
            <input type="text" v-model.trim="registerForm.captcha" placeholder="手机验证码" value="">
            <p class="verificationCode">
              <a v-if="!showInterval" href="javascript:void(0)" @click="getPhoneVerification">获取验证码</a>
              <a v-if="showInterval" href="javascript:void(0)">{{ second }}s</a>
            </p>
          </li>
          <li>
            <input type="password" v-model.trim="registerForm.password" placeholder="请您设置六位数以上的登录密码" value="" >
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
  import Steps from '../components/Steps.vue'
  export default {
    data () {
      return {
        registerForm: {
          companyName: '',
          companyType: '',
          email: '',
          realName: '',
          picCod: '',
          phone: '',
          captcha: '',
          password: '',
          rank: '',
          agree: false
        },
        txt: '',
        activeIndex: 0,
        second: 60,
        showInterval: false
      }
    },
    components: {
      Steps
    },
    mounted () {
      this.drawPic()
    },
    methods: {
      // 下一步按钮
      next () {
        if (this.activeIndex === 0) {
          if (this.registerForm.companyName && this.registerForm.companyType) {
            this.activeIndex ++
          } else {
            this.$message.warning('信息不能为空！')
          }
        } else if (this.activeIndex === 1) {
          if (!this.registerForm.email || !this.registerForm.realName) {
            this.$message.warning('信息不能为空！')
          } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/.test(this.registerForm.email)) {
            this.$message.warning('请输入正确的邮箱！')
          } else {
            this.activeIndex ++
          }
        }
      },
      stepIndex (value) {
        if (value < this.activeIndex) {
          this.activeIndex = value
        }
      },
      // 重新绘制图形验证码
      repanitCode () {
        this.txt = ''
        this.drawPic()
      },
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
              this.second = 60
              this.showInterval = false
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
        if (!this.registerForm.picCod || !this.registerForm.phone || !this.registerForm.captcha || !this.registerForm.password) {
          this.$message.warning('请完善信息！')
        } else if (this.txt !== this.registerForm.picCod.toUpperCase()) {
          this.$message.warning('请先输入正确的验证码！')
          this.txt = ''
          this.drawPic()
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
            url: '/keygood/web/companyuser/register',
            data: this.toFormData({
              companyName: this.registerForm.companyName,
              type: this.registerForm.companyType,
              email: this.registerForm.email,
              realName: this.registerForm.realName,
              phone: this.registerForm.phone,
              captcha: this.registerForm.captcha,
              password: this.registerForm.password,
              rank: this.registerForm.rank
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('注册成功！')
              this.$router.push('/login')
            }
          })
        }
      },
      // 绘制图形码
      drawPic () {
        var canvas = document.getElementById('canvas')
        var width = canvas.width
        var height = canvas.height
        var ctx = canvas.getContext('2d')
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = this.randomColor(180, 240)
        ctx.fillRect(0, 0, width, height)
        var str = 'ABCEFGHJKLMNPQRSTWXY123456789'
        for (var i = 0; i < 4; i++) {
          var txt = str[this.randomNum(0, str.length)]
          this.txt += txt
          // 随机生成字体颜色
          ctx.fillStyle = this.randomColor(50, 160)
          // 随机生成字体大小
          ctx.font = this.randomNum(25, 40) + 'px SimHei'
          var x = 10 + i * 25
          var y = this.randomNum(25, 40)
          var deg = this.randomNum(-45, 45)
          ctx.translate(x, y)
          ctx.rotate(deg * Math.PI / 180)
          ctx.fillText(txt, 0, 0)
          // 恢复坐标原点和旋转角度
          ctx.rotate(-deg * Math.PI / 180)
          ctx.translate(-x, -y)
          // 绘制干扰线
          for (var j = 0; j < 1; j++) {
            ctx.strokeStyle = this.randomColor(40, 180)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height))
            ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height))
            ctx.stroke()
          }
          // 绘制干扰点
          for (var k = 0; k < 20; k++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI)
            ctx.fill()
          }
        }
      },
      randomColor (min, max) {
        var r = this.randomNum(min, max)
        var g = this.randomNum(min, max)
        var b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      },
      randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Register{
    height: 100%;
    background: url("../assets/loginBg.png") center;
    background-size: 100% 100%;
    overflow: auto;
  }
  .loginTips{
    font-size: 16px;
    color: #333;
    position: absolute;
    right: 20px;
    top: 20px;
    a{
      color: #fff;
    }
  }
  .logo{
    width: 256px;
    height: 72px;
    margin: 103px auto 0;
    img{
      width: 100%;
    }
  }

  /* 步骤条 */
  .stepRegister{
    margin-top: 33px;
  }

  /* 表单 */
  .register_wrapper{
    width: 510px;
    /*min-height: 535px;*/
    background: #fff;
    border-radius: 4px ;
    margin: 42px auto 0;
    .register_title{
      height: 94px;
      border-radius: 4px 4px 0px 0px;
      h2{
        line-height: 94px;
        text-align: center;
        font-size: 24px;
        color: #62AEFF;
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


  @media screen and (max-width: 1600px){
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
            margin-top: 1px;
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
    .register_wrapper3{
      width: 490px;
    }
  }
</style>
