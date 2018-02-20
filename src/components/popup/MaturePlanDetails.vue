<template>
  <div id="MaturePlanDetails">
    <div class="wrapper">
      <div class="title">查看成熟计划<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p><label>成熟计划的名称：</label><span>{{ mature.matureName }}</span></p>
        <p>
          <span>成熟周期：每年一次</span>
          <label>计划长度：</label>{{ mature.matureLong }} 年
        </p>
        <div class="items">
          <div v-for="(item, index) in performances">
            <i>{{ index + 1 }}.</i>
            <label>绩效考核合格率(大于等于)：</label> <span>{{ item.yield }}</span> %
            <label>年度最大可认购股数百分比：</label> <span>{{ item.subrate }}</span> %
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
        mature: {},
        performances: []
      }
    },
    props: ['id'],
    mounted () {
      this.getDetails()
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      // 查看详情
      getDetails () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/mature/findOne',
          params: {
            matureId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.mature = result.data.mature
            this.performances = result.data.performances
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #MaturePlanDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 700px;
      /*height: 470px;*/
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
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
        padding: 0px 30px;
        margin-top: 20px;
        p{
          color: #666;
          margin-bottom: 20px;
          label,span{
            line-height: 32px;
            display: inline-block;
            color: #333;
          }
          span{
            margin-right: 100px;
          }
        }
        .items{
          border-top: 1px solid #c5c5c5;
          color: #666;
          padding-top: 15px;
          max-height: 270px;
          overflow-y: auto;
          >div{
            margin-bottom: 30px;
            label:last-of-type{
              margin-left: 60px;
            }
            span{
              width: 50px;
              text-align: center;
              display: inline-block;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px) {
    #MaturePlanDetails{
      .wrapper{
        width: 600px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 15px;
          font-size: 14px;
          p{
            color: #666;
            margin-bottom: 5px;
            label,span{
              line-height: 32px;
            }
          }
          .items{
            padding-top: 15px;
            max-height: 195px;
            >div{
              margin-bottom: 20px;
              label:last-of-type{
                margin-left: 40px;
              }
              span{
                width: 30px;
              }
            }
          }
        }
      }
    }
  }
  /*!* 设置滚动条的样式 *!*/
  /*::-webkit-scrollbar {*/
    /*width:5px;*/
  /*}*/
  /*!* 滚动槽 *!*/
  /*::-webkit-scrollbar-track {*/
    /*background:rgba(0,0,0,0.1);*/
    /*border-radius:10px;*/
  /*}*/
  /*!* 滚动条滑块 *!*/
  /*::-webkit-scrollbar-thumb {*/
    /*background:rgba(0,0,0,0.2);*/
  /*}*/
</style>
