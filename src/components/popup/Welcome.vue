<template>
  <div id="Welcome">
    <div class="wrapper">
      <div class="title"><i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>您好，欢迎进入企股</p>
        <p>系统会帮助和引导您建立合适的股权激励计划，是否需要现在建立?</p>
        <div class="btn">
          <button @click="showPlanSteps()">好的</button>
          <a href="javascript:void(0)" @click="close()">稍后尝试</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
      }
    },
    methods: {
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 确认弹出新建计划
      showPlanSteps () {
        this.$emit('isShow', 'welcome')
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Welcome{
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
        color: #333;
        position: relative;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0 60px;
        p:first-of-type{
          color: #62AEFF;
          margin-top: 10px;
          font-size: 18px;
        }
        p:last-of-type{
          color: #333;
          margin-top: 30px;
          font-size: 16px;
        }
        .btn{
          margin-top: 80px;
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
          a{
            color: #62aeff;
            text-decoration: underline;
            vertical-align: baseline;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #Welcome{
      .wrapper{
        width: 500px;
        height: 230px;
        .title{
          height: 50px;
          line-height: 50px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0 50px;
          p:first-of-type{
            margin-top: 10px;
            font-size: 16px;
          }
          p:last-of-type{
            margin-top: 20px;
            font-size: 14px;
          }
          .btn{
            margin-top: 40px;
            button{
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
            a{
              color: #62aeff;
              font-size: 14px;
              text-decoration: underline;
              vertical-align: baseline;
            }
          }
        }
      }
    }
  }
</style>
