<template>
  <div id="RenewAndBuy">
    <div class="buy" v-if="!this.orderDetails || this.orderDetails.status !== 1">
      <div>
        <p>激励人员人数</p>
        <p>
          <select v-model="form.peopleNum" @change="getTimer">
            <option value="">-- 请选择 --</option>
            <option v-for="item in stimulateNops" :value="getNop(item.startNop, item.endNop)">{{ item.startNop }}~{{ item.endNop }}</option>
          </select>
          <span><i>*</i>当激励人员人数大于{{ confineNop.limitNop }}人时，请联系客服线下咨询，以便更好的为您服务</span>
        </p>
      </div>
      <div>
        <p>开通年数</p>
        <p>
          <select v-model="form.openDuration" @change="getPrices">
            <option value="">-- 请选择 --</option>
            <option v-for="item in timerSelect" :value="item.openDuration">{{ item.openDuration }} 年</option>
          </select>
        </p>
      </div>
      <div>
        <p>总金额</p>
        <p>
          <span>{{ form.price }}元</span><a href="javascript:void(0)" @click="couponShow">有优惠券?</a>
        </p>
      </div>
      <div v-show="showCoupon">
        <p>优惠码</p>
        <p>
          <input type="text" v-model="form.couponNum">
          <a href="javascript:void(0)" @click="checkCoupon">确定</a>
          <a href="javascript:void(0)" @click="closeCoupon">取消</a>
        </p>
      </div>
      <div>
        <p>实付金额</p>
        <p>
          <span>{{ form.realMoney }}元</span>
        </p>
      </div>
      <div>
        <p>支付方式</p>
        <p>
          <span>支付宝</span><br>
          <a href="javascript:void(0)" @click="clickPay">去支付</a>
        </p>
      </div>
    </div>
    <div class="pendingPay" v-if="this.orderDetails && this.orderDetails.status === 1">
      <div>
        <p>订单号</p>
        <p>
          <span>{{ orderDetails.number }}</span>
        </p>
      </div>
      <div>
        <p>激励人员人数</p>
        <p>
          <span>{{ orderDetails.stimulateNop }} 人</span>
        </p>
      </div>
      <div>
        <p>开通年数</p>
        <p>
          <span>{{ orderDetails.openDuration }} 年</span>
        </p>
      </div>
      <div>
        <p>总金额</p>
        <p>
          <span>{{ orderDetails.price }} 元</span>
        </p>
      </div>
      <div>
        <p>支付金额</p>
        <p>
          <span>{{ orderDetails.realMoney }} 元</span>
        </p>
      </div>
      <div>
        <p>支付方式</p>
        <p>
          <span>支付宝</span><br>
          <a href="javascript:void(0)" @click="goAliPay(orderDetails.orderId)">去支付</a>
          <a href="javascript:void(0)" @click="showCancelPay(orderDetails.orderId)">取消订单</a>
        </p>
      </div>
    </div>

    <div class="service">
      <label>服务项目：</label>
      <div>
        <p>
          <img src="../../../assets/service_icon1.png">
          <span>在线生成并签署全套法律文件</span>
        </p>
        <p>
          <img src="../../../assets/service_icon2.png">
          <span>专业流程引导分红股发放及管理</span>
        </p>
        <p>
          <img src="../../../assets/service_icon3.png">
          <span>公司股权在线安全托管</span>
        </p>
        <p>
          <img src="../../../assets/service_icon4.png">
          <span>员工通过子账户随时查看分红股状态</span>
        </p>
        <p>
          <img src="../../../assets/service_icon5.png">
          <span>提供系统培训及初始化服务</span>
        </p>
      </div>

    </div>

    <!-- 优惠券提示 -->
    <coupon-hint v-if="showPopup_coupon" v-on:isShow="closePopup"></coupon-hint>

    <!-- 取消支付 -->
    <cancel-pay v-if="showPopup_pay" :id="id" v-on:isShow="closePopup"></cancel-pay>
  </div>
</template>

<script>
  import CouponHint from '../../../components/popup/CouponHint.vue'
  import CancelPay from '../../../components/popup/CancelPay.vue'
  export default{
    data () {
      return {
        stimulateNops: [],
        confineNop: {},
        timerSelect: [],
        form: {
          peopleNum: '',
          openDuration: '',
          price: 0,
          couponNum: '',
          couponMoney: 0,
          couponId: '',
          realMoney: 0
        },
        orderDetails: JSON.parse(sessionStorage.getItem('thisOrder')),
        showCoupon: false, // 是否显示优惠券选项
        showPopup_coupon: false,  // 是否显示优惠券提示
        showPopup_pay: false  // 是否显示优惠券提示
      }
    },
    components: {
      CouponHint,
      CancelPay
    },
    mounted () {
      if (!this.orderDetails || this.orderDetails.status !== 1) {
        this.getPeople()
      }
    },
    beforeDestroy () {
      sessionStorage.removeItem('skip')
    },
    methods: {
      // 获取激励人数下拉数据和人数限制
      getPeople () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/price/findStimulateNop',
          params: {
            serviceName: (JSON.parse(sessionStorage.getItem('thisOrder')) && JSON.parse(sessionStorage.getItem('thisOrder')).status === 2) ? '升级版' : '标准版'
          }
        }).then((result) => {
          this.stimulateNops = result.data.stimulateNops
          this.confineNop = result.data.confineNop
        })
      },
      getNop (start, end) {
        return start + '~' + end
      },
      // 获取时间
      getTimer () {
        this.form.openDuration = ''
        this.form.price = 0
        this.form.couponNum = ''
        this.form.couponId = ''
        this.form.realMoney = 0
        if (this.form.peopleNum !== '') {
          this.axios({
            method: 'GET',
            url: '/keygood/web/price/findByStimulateNop',
            params: {
//              stimulateNop: this.form.peopleNum,
              startNop: this.form.peopleNum.split('~')[0],
              endNop: this.form.peopleNum.split('~')[1],
              serviceName: (JSON.parse(sessionStorage.getItem('thisOrder')) && JSON.parse(sessionStorage.getItem('thisOrder')).status === 2) ? '升级版' : '标准版'
            }
          }).then((result) => {
            this.timerSelect = result.data.prices
          })
        }
      },
      // 获取价格
      getPrices () {
        this.timerSelect.forEach((item) => {
          if (this.form.openDuration === item.openDuration) {
            this.form.price = item.price
            this.form.realMoney = this.form.price
          }
        })
      },
      // 显示优惠券
      couponShow () {
        this.showCoupon = true
      },
      // 检测优惠券
      checkCoupon () {
        if (!this.form.couponNum) {
          this.$message.warning('优惠券不能为空！')
        } else {
          this.axios({
            method: 'GET',
            url: '/keygood/web/coupon/findByCouponNum',
            params: {
              couponNum: this.form.couponNum
            }
          }).then((result) => {
            if (result.data.code === 0 && !result.data.coupon) {
              this.showPopup_coupon = true
            } else {
              this.form.couponMoney = result.data.coupon.money
              this.form.couponId = result.data.coupon.couponId
              this.form.realMoney = this.form.price - result.data.coupon.money <= 0 ? 0 : this.form.price - result.data.coupon.money
            }
          })
        }
      },
      // 关闭优惠券输入框
      closeCoupon () {
        this.form.realMoney = this.form.realMoney + this.form.couponMoney
        this.form.couponNum = ''
        this.showCoupon = false
      },
      // 点击支付
      clickPay () {
        if (!this.form.peopleNum || !this.form.openDuration || !this.form.price) {
          this.$message.warning('请完善信息！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/order/addOne',
            data: this.toFormData({
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              serviceName: (JSON.parse(sessionStorage.getItem('thisOrder')) && JSON.parse(sessionStorage.getItem('thisOrder')).status === 2) ? '升级版' : '标准版',
              stimulateNop: this.form.peopleNum,
              openDuration: this.form.openDuration,
              price: this.form.price,
              couponId: this.form.couponId,
              realMoney: this.form.realMoney,
              payWay: this.form.couponId ? 3 : 1
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.goAliPay(result.data.order.orderId)
              // 把订单更新在sessionStorage
              sessionStorage.setItem('thisOrder', JSON.stringify(result.data.order))
            }
          })
        }
      },
      // 调支付接口
      goAliPay (id) {
        window.location.href = `/keygood/web/alipay/openpay?orderId=${id}`
      },
      // 取消支付
      showCancelPay (id) {
        this.showPopup_pay = true
        this.id = id
      },
      // 关闭弹窗
      closePopup () {
        this.showPopup_coupon = false
        this.showPopup_pay = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #RenewAndBuy{
    .buy{
      >div{
        display: flex;
        margin-bottom: 25px;
        p{
          color: #666;
          line-height: 30px;
          select{
            width: 200px;
            height: 30px;
            border: 1px solid #c5c5c5;
            padding: 0 12px;
            margin: auto;
          }
          input{
            width: 200px;
            height: 28px;
            border: 1px solid #c5c5c5;
            text-indent: 12px;
          }
        }
        p:first-of-type{
          width: 140px;
          color: #333;
        }
      }
      div:nth-child(1){
        p{
          span{
            font-size: 14px;
            margin-left: 15px;
            i{
              color: red;
            }
          }
        }
      }
      div:nth-child(3){
        p{
          span{
            color: #333;
            font-size: 18px;
            margin-right: 35px;
          }
          a{
            color: #007BFF;
            font-size: 14px;
          }
        }
      }
      div:nth-child(4){
        p{
          a{
            width: 67px;
            height: 30px;
            line-height: 30px;
            color: #62AEFF;
            font-size: 14px;
            text-align: center;
            display: inline-block;
            border-radius: 4px;
          }
          a:first-of-type{
            color: #fff;
            background: #62AEFF;
            margin-left: 7px;
          }
        }
      }
      div:nth-child(5){
        p{
          span{
            color: #62AEFF;
            font-size: 20px;
          }
        }
      }
      div:nth-child(6){
        p{
          span{
            color: #EE601A;
            font-size: 20px;
            margin-left: 25px;
          }
          a{
            width: 106px;
            height: 38px;
            line-height: 38px;
            display: block;
            background: #62AEFF;
            color: #fff;
            text-align: center;
            border-radius: 4px;
            margin-top: 10px;
          }
        }
      }
    }
    .pendingPay{
      >div{
        display: flex;
        margin-bottom: 20px;
        p{
          color: #666;
          line-height: 30px;
        }
        p:first-of-type{
          width: 140px;
          color: #333;
          font-size: 18px;
        }
      }
      div:nth-child(4),div:nth-child(5){
        p{
          span{
            color: #62AEFF;
            font-size: 20px;
          }
        }
      }
      div:nth-child(6){
        p{
          span{
            color: #EE601A;
            font-size: 20px;
            margin-left: 25px;
          }
          a{
            width: 106px;
            height: 38px;
            line-height: 38px;
            display: inline-block;
            color: #62AEFF;
            text-align: center;
            border-radius: 4px;
            margin-top: 10px;
            text-decoration: underline;
          }
          a:first-of-type{
            background: #62AEFF;
            color: #fff;
            text-decoration: none;
          }
        }
      }
    }
    .service{
      padding-top: 20px;
      border-top: 1px solid #EFF3F8;
      display: flex;
      label{
        width: 140px;
      }
      >div{
        width: 100%;
        -moz-box-flex: 1.0;
        -webkit-box-flex: 1.0;
        p{
          width: 33%;
          float: left;
          text-align: center;
          margin-bottom: 50px;
          color: #666;
          i{
            color: #62AEFF;
            font-size: 26px;
          }
          span{
            display: block;
            margin-top: 15px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #RenewAndBuy{
      .buy{
        >div{
          margin-bottom: 15px;
          p{
            font-size: 14px;
          }
          p:first-of-type{
            font-size: 14px;
          }
        }
        div:nth-child(1){
          p{
            span{
              font-size: 12px;
            }
          }
        }
        div:nth-child(3){
          p{
            span{
              margin-right: 15px;
            }
            a{
              color: #007BFF;
              font-size: 14px;
            }
          }
        }
        div:nth-child(5){
          p{
            span{
              font-size: 18px;
            }
          }
        }
        div:nth-child(6){
          p{
            span{
              margin-left: 15px;
            }
            a{
              width: 86px;
              height: 30px;
              line-height: 30px;
            }
          }
        }
      }
      .pendingPay{
        >div{
          margin-bottom: 15px;
          p{
            line-height: 25px;
            font-size: 14px;
          }
          p:first-of-type{
            font-size: 16px;
          }
        }
        div:nth-child(4),div:nth-child(5){
          p{
            span{
              font-size: 18px;
            }
          }
        }
        div:nth-child(6){
          p{
            span{
              color: #EE601A;
              font-size: 20px;
              margin-left: 15px;
            }
            a{
              width: 86px;
              height: 30px;
              line-height: 30px;
            }
          }
        }
      }
      .service{
        padding-top: 20px;
        >div{
          p{
            margin-bottom: 30px;
            i{
              color: #62AEFF;
              font-size: 26px;
            }
            span{
              display: block;
              margin-top: 15px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
