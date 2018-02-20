<template>
  <div id="SetEmail">
    <div class="wrapper" v-if="step===1">
      <div class="title">修改邮箱<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
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
      <div class="title">修改邮箱<i class="iconfont icon-icons64x6403" @click="close()"></i></div>
      <div class="con">
        <p>新邮箱，修改后需要重新登录</p>
        <input type="text" v-model="email" placeholder="请输入新的邮箱地址">
        <div class="btn">
          <button @click="close()">取消</button>
          <button @click="confirm">确定</button>
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
        password: '',
        email: ''
      }
    },
    methods: {
      // 下一步
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
      // 确认修改邮箱
      confirm () {
        console.log(111)
        if (!this.email.trim()) {
          this.$message.warning('邮箱不能为空！')
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/.test(this.email.trim())) {
          this.$message.warning('邮箱格式不正确！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/editEmail',
            data: this.toFormData({
              companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
              email: this.email
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('邮箱修改成功，请重新登录！')
              this.$router.push('/login')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetEmail{
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
      }
    }
  }

  @media screen and (max-width: 1366px){
    #SetEmail{
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
        }
      }
    }
  }
</style>
