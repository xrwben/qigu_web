<template>
  <div id="StockHoldPlatformDetails">
    <div class="wrapper">
      <div class="title">详细<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <span>持股平台类型</span><span>{{ info.playformType | stockHoldPlatformType }}</span>
        </p>
        <p><span>企业名称</span><span>{{ info.name }}</span></p>
        <p><span>注册资本</span><span v-if="info.registeredAssets">{{ info.registeredAssets }}元</span><span v-if="!info.registeredAssets">--</span></p>
        <p><span>持股公司股权</span><span>{{ info.stockOption }}%</span></p>
        <p><span>股东上限</span><span>{{ info.shareholderLimit }}</span></p>
        <p><span>营业执照号码</span><span>{{ info.licenseNum }}</span></p>
        <div class="authority">
          <span>营业执照</span>
          <div class="pic">
            <img :src="info.license">
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
    props: ['info'],
    methods: {
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 确定
      submit () {
        this.close()
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #StockHoldPlatformDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 520px;
      height: 545px;
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
        padding: 0px 40px;
        margin-top: 40px;
        p{
          color: #666;
          margin-bottom: 20px;
          span:first-of-type{
            width: 150px;
            display: inline-block;
            text-align: right;
            color: #333;
            margin-right: 50px;
          }
        }
        p:nth-child(1){
          span:last-of-type{
            color: #5090D3;
          }
        }
        .authority{
          color: #333;
          display: flex;
          span{
            width: 150px;
            display: inline-block;
            text-align: right;
          }
          .pic{
            width: 240px;
            height: 135px;
            margin-left: 45px;
            border: 1px solid #E3E3E3;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .btn{
          margin-top: 15px;
          text-align: center;
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
    .wrapper.limitedCompany{
      height: 570px;
    }
  }

  @media screen and (max-width: 1366px){
    #StockHoldPlatformDetails{
      .wrapper{
        width: 400px;
        height: 430px;
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
          p{
            margin-bottom: 10px;
            font-size: 14px;
            span:first-of-type{
              width: 120px;
              margin-right: 30px;
            }
          }
          .authority{
            span{
              width: 120px;
              font-size: 14px;
            }
            .pic{
              width: 200px;
              height: 120px;
              margin-left: 20px;
            }
          }
          .btn{
            margin-top: 20px;
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
