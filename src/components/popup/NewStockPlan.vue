<template>
  <div id="NewStockPlan">
    <!-- 新建或登记选择 -->
    <div class="wrapper_entry" v-if="showNewStockPlan">
      <div class="title"><i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div class="leftRight">
          <div class="left">
            <div></div>
            <p><button @click="close('new')">在线建立股权激励计划</button></p>
            <span>选择“在线建立股权激励计划” 您可通过企股在线建立股权激励计划，计划通过后，可给公司人员发放分红股并管理这部分分红股。</span>
          </div>
          <div class="right">
            <div></div>
            <p><button @click="close('add')">登记并管理已有股权激励计划</button></p>
            <span>选择“上传” 您可在企股上传已经建立好的股权激励计划的文档。</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default{
    data () {
      return {
        showNewStockPlan: true // 是否显示新建计划选择
      }
    },
    methods: {
      close (value) {
        this.$emit('isShow', value)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewStockPlan{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper_entry{
      width: 760px;
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
        color: #5090D3;
        font-size: 24px;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0 60px;
        .leftRight{
          display: flex;
          >div{
            width: 50%;
            padding: 25px 0;
            >div{
              width: 50px;
              height: 50px;
              margin: 0 auto;
              background: url("../../assets/newplan_1.png") no-repeat center;
              background-size: cover;
            }
          }
          >div:last-of-type{
            border-left: 2px dotted #666;
            >div{
              background: url("../../assets/newplan_2.png") no-repeat center;
            }
          }
          p{
            margin-top: 40px;
            button{
              width: 266px;
              height: 38px;
              border: 1px solid #c5c5c5;
              background: #fff;
              color: #5090D3;
              font-size: 18px;
              display: block;
              margin: 0 auto;
            }
          }
          span{
            width: 260px;
            color: #999999;
            display: block;
            margin: 15px auto 0;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #NewStockPlan{
      .wrapper_entry{
        width: 650px;
        height: 350px;
        .title{
          height: 50px;
          line-height: 50px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0 30px;
          .leftRight{
            >div{
              >div{
                width: 40px;
                height: 40px;
              }
            }
            >div:last-of-type{
              >div{
                background-size: cover;
              }
            }
            p{
              margin-top: 30px;
              button{
                width: 240px;
                height: 35px;
                font-size: 16px;
              }
            }
            span{
              width: 230px;
            }
          }
        }
      }
    }
  }
</style>
