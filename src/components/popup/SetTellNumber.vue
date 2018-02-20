<template>
  <div id="SetTellNumber">
    <div class="wrapper" v-if="step===1">
      <div class="title">手机解绑<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>为保障您的账号安全，请输入账号密码进行验证</p>
        <input type="text" v-model="password" placeholder="请输入密码">
        <div class="btn">
          <button @click="close()">取消</button>
          <button @click="next()">下一步</button>
        </div>
      </div>
    </div>
    <div class="wrapper" v-if="step===2">
      <div class="title">手机解绑<i class="iconfont icon-icons64x6403" @click="close()"></i></div>
      <div class="con">
        <div class="success tell">验证成功！</div>
        <div class="tell">解除绑定后您将无法用当前绑定手机号继续登录企股平台并接收相关信息。</div>
        <div class="tell">是否确定要解除绑定？</div>
        <div class="btn btn2">
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
        step: 1,
        password: ''
      }
    },
    methods: {
      next () {
        if (!this.password.trim()) {
          this.$message.warning('密码不能为空！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/checkPassword',
            data: this.toFormData({
              companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
              password: this.password
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.step = 2
            }
          })
        }
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 确定解绑
      submit () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/companyuser/unbindPhone',
          data: this.toFormData({
            companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.close()
            this.$message.success('解绑成功！')
            this.$emit('isShow', 'update')
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetTellNumber{
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
        text-align: center;
        p{
          line-height: 80px;
          color: #62AEFF;
        }
        .tell{
          text-align: left;
          padding: 0 75px;
          margin-bottom: 10px;
          color: #666;
        }
        .tell.success{
          color: #62AEFF;
          font-size: 18px;
          margin: 23px 0 14px;
        }
        input{
          width: 374px;
          height: 40px;
          border: 1px solid #c5c5c5;
          text-indent: 15px;
        }
        .btn{
          margin-top: 40px;
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
        .btn.btn2{
          margin-top: 30px;
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #SetTellNumber{
      .wrapper{
        width: 500px;
        height: 230px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          p{
            line-height: 60px;
          }
          .tell{
            padding: 0 35px;
            margin-bottom: 10px;
            font-size: 14px;
          }
          .tell.success{
            color: #62AEFF;
            font-size: 16px;
            margin: 15px 0 10px;
          }
          input{
            width: 300px;
            height: 35px;
            text-indent: 10px;
          }
          .btn{
            margin-top: 30px;
            button{
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
          }
          .btn.btn2{
            margin-top: 20px;
          }
        }
      }
    }
  }
</style>
