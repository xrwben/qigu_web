<template>
  <div id="GrantDetails">
    <div class="wrapper">
      <div class="title">授予详情<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="steps">
        <span :class="{isActive: step === 1}" @click="clickStep(1)">授予概要</span>
        <i></i>
        <span :class="{isActive: step === 2}" @click="clickStep(2)">解限计划</span>
        <i></i>
        <span :class="{isActive: step === 3}" @click="clickStep(3)">进度</span>
        <i></i>
        <span :class="{isActive: step === 4}" @click="clickStep(4)">协议及备注</span>
        <button @click="printDetails">打印详情</button>
      </div>

      <!-- 授予概要 -->
      <div class="con con_first" v-if="step === 1">
        <div>
          <label>持有人信息</label>
          <div>
            <p class="name">{{ company.showNameEmail ? companyUser.realName : '***'}}</p>
            <p>{{ company.showNameEmail ? companyUser.email : '********'}}</p>
          </div>
          <label>股权信息</label>
          <div>
            <p>股权类型：受限股</p>
            <p>编号：{{ bonusShares.number	 }}</p>
            <p>总股数：{{ limitation.subscribeNum }}</p>
            <p>已解限(股)：{{ limitation.notLimit }}</p>
            <p>认购价(元/股)：{{ limitation.subscribePrice }}</p>
            <p>所属计划：{{ stimulate.planName }}</p>
            <p>认购日期：{{ limitation.createTime | dateFormat }}</p>
          </div>
        </div>
        <div>
          <label>授予信息</label>
          <div>
            <p>{{ company.companyName }}</p>
            <p v-if="platform">持股主体：通过 {{ platform.name }}代持 间接持有</p>
            <p v-if="!platform">持股主体：个人持有</p>
            <p>币种：{{ company.currency || '--' }}</p>
          </div>
        </div>
      </div>

      <!-- 解限计划 -->
      <div class="con con_second" v-if="step === 2">
        <div>
          <label>解限计划详情</label>
          <div>
            <p>解限计划名称：{{ unfreeze.unfreezeName }}</p>
            <p>本次解限计划：{{ unfreeze.lockLong }} {{ unfreeze.lockUnit | timeUnit }}</p>
            <p v-if="unfreeze.yield">解限绩效考核合格率：{{ unfreeze.yield }} %</p>
          </div>
          <!-- 列表 -->
          <table>
            <thead>
            <tr>
              <th>绩效考核合格率(大于等于)</th>
              <th>年度最大可分红股数</th>
              <th>年度最大可认购股数</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ performance.yield }}%</td>
              <td>{{ bonusShares.stockNum }}</td>
              <td>{{ (performance.subrate * bonusShares.stockNum / 100).toFixed(0) }}</td>
            </tr>
            </tbody>
          </table>

          <table>
            <thead>
            <tr>
              <th>本次完成业绩指标</th>
              <th>本次可分红的股数</th>
              <th>本次可认购的股数</th>
              <th>本次认购价格</th>
              <th>本次完成的比例</th>
              <th>本次已失效股权</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{ limitation.content	 }}</td>
              <td>{{ limitation.bonusNum }}</td>
              <td>{{ limitation.subscribeNum }}</td>
              <td>{{ limitation.subscribePrice }} 元/股</td>
              <td>{{ limitation.completePercent }}%</td>
              <td>{{ limitation.failureEquity }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 进度 -->
      <div class="con con_third" v-if="step === 3">
        <div v-for="item in status">
          <i></i>
          <span>{{ item }}</span>
        </div>
      </div>

      <!-- 协议及备注 -->
      <div class="con con_fourth" v-if="step === 4">
        <div>
          <label>协议</label>
          <div>
            <a href="#" @click="downLoad">受限股认购确认书</a>
          </div>
          <label>备注</label>
          <div>
            <p>{{ bonusShares.note || '暂无' }}</p>
          </div>
          <label>其它授予信息</label>
          <div>
            <p>回购价格：{{ bonusShares.buyBack }}</p>
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
        step: 1,
        status: [],
        bonusShares: {},
        company: {},
        companyUser: {},
        limitation: {},
        mature: {},
        performance: {},
        stimulate: {},
        stockholder: {},
        platform: {},
        unfreeze: {}
      }
    },
    props: ['limitationId'],
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/limitation/findOne',
          params: {
            limitationId: this.limitationId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.bonusShares = result.data.bonusShares
            this.company = result.data.company
            this.companyUser = result.data.companyUser
            this.limitation = result.data.limitation
            this.performance = result.data.performance
            this.stimulate = result.data.stimulate
            this.stockholder = result.data.stockholder
            this.platform = result.data.platform
            this.unfreeze = result.data.unfreeze
            this.status = ['转换完成', '转换中', '已签字', '待签字', '授予'].slice(-this.bonusShares.status - 1)
          }
        })
      },
      close () {
        this.$emit('isShow', false)
      },
      clickStep (i) {
        this.step = i
      },
      // 下载
      downLoad (ev) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${this.limitation.fileName}&path=${this.limitation.subscribeInform}`)
      },
      // 打印详情
      printDetails () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/limitation/printOne',
          data: this.toFormData({
            realName: this.companyUser.realName,
            email: this.companyUser.email,
            number: this.bonusShares.number,
            subscribeNum: this.limitation.subscribeNum,
            planName: this.stimulate.planName,
            createTime: new Date(this.limitation.createTime),
            unfreezeName: this.unfreeze.unfreezeName,
            type: this.unfreeze.type,
            lockLong: this.unfreeze.lockLong,
            lockUnit: this.unfreeze.lockUnit,
            subscribePrice: this.limitation.subscribePrice,
            companyName: this.company.companyName,
            name: this.platform.name || '个人',
            notLimit: this.limitation.notLimit,
            yield: this.unfreeze.yield,
            buyBack: this.bonusShares.buyBack
          })
        }).then((result) => {
          if (result.data.code === 0) {
            window.open(result.data.filePath)
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #GrantDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 900px;
      height: 500px;
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
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .steps{
        height: 90px;
        line-height: 90px;
        border-bottom: 1px solid #EFF3F8;
        padding: 0 35px;
        span{
          width: 104px;
          height: 36px;
          line-height: 36px;
          border: 1px solid #c5c5c5;
          border-radius: 4px;
          color: #999;
          text-align: center;
          display: inline-block;
          cursor: pointer;
        }
        span.isActive{
          color: #fff;
          background: #62aeff;
        }
        i{
          width: 56px;
          height: 1px;
          background: #E6E6E6;
          display: inline-block;
          vertical-align: middle;
        }
        button{
          width: 116px;
          height: 36px;
          border: 1px solid #c5c5c5;
          background: #5090D3;
          border-radius: 4px;
          color: #fff;
          margin-left: 80px;
          box-shadow: 1px 1px 1px rgba(51,51,51,0.7);
        }
      }
      .con_first{
        padding: 0 35px;
        margin-top: 10px;
        display: flex;
        >div{
          width: 50%;
          label{
            width: 118px;
            height: 38px;
            line-height: 38px;
            background: #EFF3F8;
            color: #666;
            font-size: 18px;
            text-align: center;
            display: block;
          }
          >div{
            margin: 10px 0 10px 12px;
            p{
              color: #666;
              line-height: 24px;
            }
            .name{
              color: #5090D3;
            }
          }
        }
      }
      .con_second{
        height: 325px;
        max-height: 325px;
        padding: 0 35px;
        margin-top: 10px;
        overflow: auto;
        >div{
          label{
            width: 140px;
            height: 38px;
            line-height: 38px;
            background: #EFF3F8;
            color: #666;
            font-size: 18px;
            text-align: center;
            display: block;
          }
          >div{
            margin: 10px 0 10px 12px;
            p{
              color: #666;
              line-height: 30px;
            }
          }
        }
        table{
          width: 100%;
          text-align: center;
          table-layout: fixed;
          border: 1px solid #EFF3F8;
          margin-bottom: 10px;
          thead{
            tr{
              height: 47px;
              background: #EFF3F6;
              border-bottom: 1px solid #EFF3F6;
              color: #666;
            }
          }
          tbody{
            tr{
              height: 47px;
              border-bottom: 1px solid #EFF3F6;
              color: #333;
            }
            tr:last-of-type{
              border-bottom: 0;
            }
          }
        }
      }
      .con_third{
        height: 300px;
        max-height: 300px;
        padding: 30px 35px 0;
        overflow: auto;
        >div{
          height: 105px;
          border-left: 1px solid #62aeff;
          margin-left: 50%;
          position: relative;
          i{
            width: 34px;
            height: 34px;
            display: block;
            transform: translate(-50%, -50%);
            background: url("../../assets/icon_step_2.png");
            background-size: cover;
          }
          span{
            position: absolute;
            left: 40px;
            top: -12px;
            color: #333;
          }
        }
        >div:first-of-type{
          i{
            background: url("../../assets/icon_step_1.png");
          }
        }
        >div:last-of-type{
          height: 0;
          border: none
        }
      }
      .con_fourth{
        height: 325px;
        max-height: 325px;
        padding: 0 35px;
        margin-top: 10px;
        overflow: auto;
        >div{
          label{
            width: 140px;
            height: 38px;
            line-height: 38px;
            background: #EFF3F8;
            color: #666;
            font-size: 18px;
            text-align: center;
            display: block;
          }
          >div{
            margin: 10px 0 10px 12px;
            p{
              color: #666;
              line-height: 30px;
            }
            a{
              color: #5090D3;
              font-size: 14px;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #GrantDetails{
      .wrapper{
        width: 700px;
        height: 435px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .steps{
          height: 70px;
          line-height: 70px;
          padding: 0 30px;
          span{
            width: 84px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
          }
          i{
            width: 36px;
          }
          button{
            width: 86px;
            height: 30px;
            margin-left: 60px;
          }
        }
        .con_first{
          padding: 0 30px;
          >div{
            font-size: 14px;
            label{
              width: 108px;
              height: 35px;
              line-height: 35px;
              font-size: 16px;
            }
            >div{
              margin: 5px 0 5px 14px;
            }
          }
        }
        .con_second{
          height: 280px;
          max-height: 280px;
          padding: 0 30px;
          font-size: 14px;
          >div{
            label{
              width: 120px;
              height: 35px;
              line-height: 35px;
              font-size: 16px;
            }
            >div{
              margin: 5px 0 5px 14px;
              p{
                color: #666;
                line-height: 25px;
              }
            }
          }
          table{
            thead{
              tr{
                height: 40px;
              }
            }
            tbody{
              tr{
                height: 40px;
              }
            }
          }
        }
        .con_third{
          height: 270px;
          max-height: 270px;
          padding: 30px 30px 0;
          >div{
            height: 95px;
            i{
              width: 30px;
              height: 30px;
            }
            span{
              top: -10px;
              font-size: 14px;
            }
          }
          >div:first-of-type{
            i{
              background-size: cover;
            }
          }
        }
        .con_fourth{
          height: 290px;
          max-height: 290px;
          padding: 0 30px;
          font-size: 14px;
          >div{
            label{
              width: 120px;
              height: 35px;
              line-height: 35px;
              font-size: 16px;
            }
            >div{
              margin: 5px 0 5px 14px;
              p{
                line-height: 25px;
              }
            }
          }
        }
      }
    }
  }
</style>
