<template>
  <div id="PlanDetails">
    <div class="wrapper">
      <div class="title">股权激励计划详情<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div>
          <label>基本设置</label>
          <ul>
            <li><span>计划名称：</span>{{ stimulate.planName }}</li>
            <li><span>公司全称：</span>{{ companyName }}</li>
            <li><span>激励对象入围条件：</span>工龄 {{ stimulate.seniority }} 年以上 &emsp; 岗位级别  {{ stimulate.seniority }} 以上</li>
            <li><span>计划分红额度：</span>{{ stimulate.shareLimit }}</li>
          </ul>
        </div>
        <div>
          <label>激励额度</label>
          <ul>
            <li><span>公司注册资本：</span>{{ stimulate.registeredAssets }} 元人民币</li>
            <li><span>公司虚拟股数量：</span>{{ stimulate.dummyStock }} 股</li>
            <li><span>激励额度：</span>占公司股权的 {{ stimulate.stockScale }} %</li>
            <li><span></span>对应 {{ stimulate.subscribeCapital }} 元认缴净资产，对应 {{ stimulate.stimulateStock }} 虚拟股</li>
            <li><span>持股主体：</span>{{ stimulate.positionsMain | positionsMainType }}</li>
          </ul>
        </div>
        <div>
          <label>认购窗口期及计划有效期</label>
          <ul>
            <li><span>认购窗口期：</span>每年 {{ stimulate.startDay }}日 至 {{ stimulate.endDay }}日</li>
            <li><span>计划有效期：</span>{{ stimulate.indate }} 年</li>
          </ul>
        </div>
        <div>
          <label>计划文档</label><span>(请点击下载)</span>
          <p>
            <a href="#" v-for="item in stimulateDocuments" @click="downLoad($event, item)">{{ item.type | planDocType }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        stimulate: {},
        stimulateDocuments: [],
        companyName: JSON.parse(sessionStorage.getItem('company')).companyName
      }
    },
    props: ['stimulateId'],
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findOne',
          params: {
            stimulateId: this.stimulateId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.stimulate = result.data.stimulate
            this.stimulateDocuments = result.data.stimulateDocuments
          }
        })
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 文件下载
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${info.name}&path=${info.path}`)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #PlanDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 700px;
      height: 640px;
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
        padding: 0 30px;
        color: #333;
        div{
          label{
            font-size: 18px;
            padding: 10px 15px;
            color: #666;
            background: #EFF3F8;
            display: inline-block;
          }
          >span{
            color: #999;
            font-size: 12px;
          }
          ul{
            padding: 10px 10px;
            li{
              line-height: 25px;
              font-size: 14px;
              span{
                width: 170px;
                color: #666;
                font-size: 16px;
                display: inline-block;
              }
            }
          }
          p{
            padding: 10px;
            a{
              color: #5090D3;
              margin-right: 20px;
            }
          }
        }
        div:first-of-type{
          margin-top: 25px;
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #PlanDetails{
      .wrapper{
        width: 600px;
        height: 570px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 22px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0 30px;
          div{
            label{
              font-size: 16px;
              padding: 5px 15px;
            }
            ul{
              padding: 5px 10px;
              li{
                span{
                  width: 140px;
                  font-size: 14px;
                }
              }
            }
            p{
              padding: 10px;
              a{
                font-size: 14px;
              }
            }
          }
          div:first-of-type{
            margin-top: 15px;
          }
        }
      }
    }
  }
</style>
