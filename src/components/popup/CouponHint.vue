<template>
  <div id="CouponHint">
    <div class="wrapper">
      <div class="title">提示<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>优惠券号码无效，请检查后重试</p>
        <div class="btn">
          <button @click="close()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    methods: {
      close () {
        this.$emit('isShow', false)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #CouponHint{
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
    #CouponHint{
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
