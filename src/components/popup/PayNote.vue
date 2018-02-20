<template>
  <div id="PayNote">
    <div class="wrapper">
      <div class="title">付费通知</div>
      <div class="con">
        <p>您好，您的服务已到期，暂时无法使用产品功能。</p>
        <p>如果想继续使用，请点击下方的“立即付费”并前往购买相应的服务。再次感谢您选择企股服务!</p>
        <div class="btn">
          <router-link to="/orderbuy">
            <button>立即付费</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
  }
</script>

<style type="text/css" lang="scss" scoped>
  #PayNote{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1002;
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
      }
      .con{
        padding: 0 60px;
        p:first-of-type{
          color: #333;
          margin-top: 25px;
          font-size: 18px;
        }
        p:last-of-type{
          color: #666;
          margin-top: 25px;
          font-size: 16px;
        }
        .btn{
          margin-top: 50px;
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
  }

  @media screen and (max-width: 1366px){
    #PayNote{
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
            margin-top: 20px;
            font-size: 16px;
          }
          p:last-of-type{
            margin-top: 20px;
            font-size: 14px;
          }
          .btn{
            margin-top: 35px;
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
