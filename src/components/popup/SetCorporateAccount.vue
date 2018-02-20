<template>
  <div id="SetCorporateAccount">
    <div class="wrapper">
      <div class="title">完善对公账户<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>公司对公账户信息</p>
        <p>
          <label>户名</label>
          <input type="text" v-model="username">
        </p>
        <p>
          <label>开户行</label>
          <input type="text" v-model="openingBank">
        </p>
        <p>
          <label>账号</label>
          <input type="text" v-model="account">
        </p>
        <p>
          <label></label>
          <span>当员工认购后股权持有方式为代持或直接持有时，缴纳的认购款将进入此对公账户，请仔细核对账户信息！</span>
        </p>
        <div class="btn">
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
        username: '',
        openingBank: '',
        account: ''
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!this.username || !this.openingBank || !this.account) {
          this.$message.warning('请完善信息！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/company/editPublicAccount',
            data: this.toFormData({
              username: this.username,
              openingBank: this.openingBank,
              account: this.account,
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
              ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('信息修改成功！')
              this.$emit('isShow', 'update')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetCorporateAccount{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 410px;
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
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0px 70px;
        margin-top: 10px;
        >p{
          width: 100%;
          color: #666;
          line-height: 42px;
          margin-bottom: 10px;
          label{
            width: 50px;
            color: #333;
            display: inline-block;
            margin-right: 20px;
          }
          input{
            width: 320px;
            height: 40px;
            border: 1px solid #c5c5c5;
            text-indent: 10px;
            color: #666;
          }
          span{
            width: 320px;
            line-height: 20px;
            display: inline-block;
            font-size: 14px;
            color: #999;
            margin-top: -5px;
          }
        }
        p:nth-child(1){
          color: #62AEFF;
          font-size: 18px;
          text-align: center;
          margin-bottom: 10px;
        }
        .btn{
          position: absolute;
          left: 50%;
          bottom: 15px;
          margin-top: 10px;
          text-align: center;
          transform: translateX(-50%);
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

  @media screen and (max-width: 1366px) {
    #SetCorporateAccount{
      .wrapper{
        width: 500px;
        height: 350px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0px 60px;
          >p{
            line-height: 32px;
            margin-bottom: 10px;
            label{
              width: 50px;
              margin-right: 10px;
              font-size: 14px;
            }
            input{
              width: 260px;
              height: 30px;
            }
            span{
              width: 260px;
              font-size: 12px;
            }
          }
          p:nth-child(1){
            color: #62AEFF;
            font-size: 16px;
          }
          .btn{
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
