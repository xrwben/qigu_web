<template>
  <div id="CancelPay">
    <div class="wrapper">
      <div class="title">确认操作<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>是否确定要取消订单</p>
        <div class="btn">
          <button @click="close()">取消</button>
          <button @click="cancelOrder()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props: ['id'],
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      cancelOrder () {
        this.axios({
          method: 'POSt',
          url: '/keygood/web/order/cancelOrder',
          data: this.toFormData({
            orderId: this.id
          })
        }).then((result) => {
          if (result.data.code === 0) {
            sessionStorage.setItem('thisOrder', JSON.stringify(result.data.thisOrder))
//            this.$router.replace('/orderbuy')
            this.$router.go(0)
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #CancelPay{
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
          line-height: 168px;
          color: #333;
          font-size: 18px;
        }
        .btn{
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
    #CancelPay{
      .wrapper{
        width: 400px;
        height: 200px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 24px;
          }
        }
        .con{
          p{
            line-height: 100px;
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
