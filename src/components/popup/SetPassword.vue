<template>
  <div id="SetPassword">
    <div class="wrapper">
      <div class="title">修改密码<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div>
          <label>旧密码</label>
          <div>
            <input type="text" v-model.trim="oldPassword" placeholder="请输入旧密码">
          </div>
        </div>
        <div>
          <label>新密码</label>
          <div>
            <input type="text" v-model.trim="newPassword" @keyup="checkDegree" placeholder="请输入至少六位新密码">
          </div>
        </div>
        <div>
          <label>确认密码</label>
          <div>
            <input type="text" v-model.trim="confirmPassword" placeholder="请确认新密码">
          </div>
        </div>
        <div>
          <label>安全性</label>
          <div>
            <span id="rank0" class=""></span>
            <span id="rank1" class=""></span>
            <span id="rank2" class=""></span>
          </div>
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
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        rank: '' // 密码安全等级
      }
    },
    methods: {
      // 密码等级
      checkDegree () {
        var level = -1
        for (var i = 0; i < 3; i++) {
          document.getElementById('rank' + i).className = ''
        }
        if (this.newPassword.trim().length < 6) {
          return false
        }
        // 包含数字
        if (/[0-9]/.test(this.newPassword.trim())) {
          level++
        }
        // 包含大小写字母
        if (/[a-zA-Z]/.test(this.newPassword.trim())) {
          level++
        }
        // 包含特殊字符
        if (/\W/.test(this.newPassword.trim())) {
          level++
        }
        for (var j = 0; j <= level; j++) {
          document.getElementById('rank' + j).className = 'isActive'
        }
        if (level === 0) {
          this.rank = '低'
        } else if (level === 1) {
          this.rank = '中'
        } else if (level === 2) {
          this.rank = '高'
        }
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
          this.$message.warning('请填写完整信息！')
        } else if (this.rank === '') {
          this.$message.warning('新密码必须包含六位及以上！')
        } else if (this.newPassword !== this.confirmPassword) {
          this.$message.warning('确认密码错误！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/editPassword',
            data: this.toFormData({
              companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
              oldPassword: this.oldPassword,
              passwordOne: this.newPassword,
              passwordTwo: this.confirmPassword,
              rank: this.rank
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
  #SetPassword{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 375px;
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
        div{
          width: 400px;
          margin: 0 auto 15px;
          display: flex;
          label{
            width: 120px;
            line-height: 42px;
            color: #333;
            text-align: right;
          }
          >div{
            margin-left: 28px;
            margin-bottom: 0px;
            -webkit-box-flex: 1.0;
            -moz-box-flex: 1.0;
            input{
              width: 100%;
              height: 40px;
              border: 1px solid #c5c5c5;
              text-indent: 15px;
              display: block;
            }
            span{
              width: 70px;
              height: 4px;
              background: #E3E3E3;
              margin-top: 20px;
              margin-right: 20px;
            }
            span.isActive{
              background: #62AEFF;
            }
          }
        }
        .btn{
          width: 255px;
          margin-top: 25px;
          text-align: center;
          button{
            width: 106px;
            height: 38px;
            border: 1px solid #E3E3E3;
            border-radius: 4px;
            background: #fff;
            color: #666;
            font-size: 16px;
            margin: 0 10px;
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
    #SetPassword{
      .wrapper{
        width: 500px;
        height: 335px;
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
            width: 350px;
            label{
              width: 100px;
              line-height: 37px;
              font-size: 14px;
            }
            >div{
              margin-left: 20px;
              input{
                height: 35px;
                text-indent: 10px;
              }
              span{
                width: 65px;
                height: 4px;
                background: #E3E3E3;
                margin-top: 18px;
                margin-right: 20px;
              }
            }
          }
          .btn{
            width: 215px;
            margin-top: 20px;
            button{
              width: 86px;
              height: 33px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
