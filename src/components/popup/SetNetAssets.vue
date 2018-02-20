<template>
  <div id="SetNetAssets">
    <div class="wrapper">
      <div class="title">修改净资产<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p><label>变更后净资产</label><input type="text" maxlength="16" v-model.trim="netEstate">元</p>
        <div class="reason">
          <label>变更原因</label>
          <div>
            <textarea placeholder="请您备注修改净资产的原因" maxlength="200" v-model.trim="cause"></textarea>
            <p>（非必填）</p>
          </div>
        </div>
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
        netEstate: '',
        cause: ''
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!/^\d+$/.test(this.netEstate)) {
          this.$message.warning('输入格式有误！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/company/editNetEstate',
            data: this.toFormData({
              netEstate: this.netEstate,
              cause: this.cause,
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
              ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('净资产修改成功！')
              this.$emit('isShow', 'update')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetNetAssets{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 400px;
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
        padding: 0px 50px;
        margin-top: 20px;
        >p{
          width: 100%;
          color: #666;
          margin-bottom: 20px;
          line-height: 42px;
          display: flex;
          label{
            width: 120px;
            display: inline-block;
            color: #333;
          }
          input{
            width: 200px;
            height: 40px;
            border: 1px solid #c5c5c5;
            text-indent: 10px;
            margin-right: 10px;
          }
        }
        .reason{
          display: flex;
          label{
            width: 120px;
            display: block;
            color: #333;
          }
          >div{
            width: 360px;
            height: 150px;
            -webkit-box-flex: 1.0;
            -moz-box-flex: 1.0;
            border: 1px solid #c5c5c5;
            padding: 10px;
            textarea{
              width: 100%;
              height: 100%;
              border: none;
              font-size: 16px;
              color: #333;
              display: block;
            }
            >p{
              margin-top: 10px;
              text-align: right;
              color: #999;
            }
          }
        }
        .btn{
          position: absolute;
          left: 50%;
          bottom: 10px;
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
    #SetNetAssets{
      .wrapper{
        width: 500px;
        height: 300px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0px 30px;
          margin-top: 15px;
          font-size: 14px;
          >p{
            margin-bottom: 15px;
            line-height: 35px;
            input{
              height: 35px;
            }
          }
          .reason{
            >div{
              width: 300px;
              height: 100px;
              padding: 5px;
              textarea{
                font-size: 14px;
              }
              >p{
                margin-top: 5px;
              }
            }
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
