<template>
  <div id="OrderDetails">
    <div class="wrapper">
      <div class="title">手机绑定<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div>
          <p>订单号</p>
          <p>{{ orderDetails.number }}</p>
        </div>
        <div>
          <p>服务名称</p>
          <p>{{ orderDetails.serviceName }}</p>
        </div>
        <div>
          <p>激励人员人数</p>
          <p>{{ orderDetails.stimulateNop }}</p>
        </div>
        <div>
          <p>开通日期</p>
          <p v-if="orderDetails.payTime">{{ orderDetails.payTime | dateFormat }}</p>
          <p v-if="!orderDetails.payTime">——</p>
        </div>
        <div>
          <p>到期日期</p>
          <p v-if="orderDetails.endTime">{{ orderDetails.endTime | dateFormat }}</p>
          <p v-if="!orderDetails.endTime">——</p>
        </div>
        <div>
          <p>开通时长</p>
          <p>{{ orderDetails.openDuration }} 年</p>
        </div>
        <div>
          <p>标准服务金额</p>
          <p>{{ orderDetails.price }} 元</p>
        </div>
        <div>
          <p>支付金额</p>
          <p>{{ orderDetails.realMoney }} 元</p>
        </div>
        <div>
          <p>支付状态</p>
          <p>{{ orderDetails.status | orderStatus }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        orderDetails: {}
      }
    },
    props: ['id'],
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/order/findOne',
          params: {
            orderId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.orderDetails = result.data.order
          }
        })
      },
      close () {
        this.$emit('isShow', false)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #OrderDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 450px;
      height: 470px;
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
          right: 0;
          margin-right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        margin-top: 40px;
        div{
          display: flex;
          p{
            width: 30%;
            margin: 0 25px;
            line-height: 35px;
            color: #666;
          }
          p:first-of-type{
            text-align: right;
            color: #333;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #OrderDetails{
      .wrapper{
        width: 400px;
        height: 370px;
        .title{
          width: 100%;
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 26px;
          }
        }
        .con{
          margin-top: 10px;
          div{
            p{
              width: 35%;
              margin: 0 15px;
              line-height: 32px;
            }
          }
        }
      }
    }
  }
</style>
