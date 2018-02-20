<template>
  <div id="GrantDetails">
    <div class="wrapper">
      <div class="title">授予详情<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="steps">
        <span :class="{isActive: step === 1}" @click="clickStep(1)">授予概要</span>
        <i></i>
        <span :class="{isActive: step === 2}" @click="clickStep(2)">成熟计划</span>
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
            <p class="name">{{ company.showNameEmail ? companyUser.realName : '***' }}</p>
            <p>{{ company.showNameEmail ? companyUser.email : '********' }}</p>
          </div>
          <label>股权信息</label>
          <div>
            <p>股权类型：分红股</p>
            <p>编号：{{ bonusShares.number	 }}</p>
            <p>状态：{{ bonusShares.status | shareStockStatus }}</p>
            <p>年度最大可分红股数：{{ bonusShares.stockNum }}</p>
            <p>所属计划：{{ stimulate.planName }}</p>
            <p>授予日期：{{ bonusShares.awardedDate | dateFormat }}</p>
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

      <!-- 成熟计划 -->
      <div class="con con_second" v-if="step === 2">
        <div>
          <label>成熟计划详情</label>
          <div>
            <p>成熟计划名称：{{ mature.matureName }}</p>
            <p>授予股数：{{ bonusShares.stockNum }}</p>
            <p>计划长度：{{ mature.matureLong }}年</p>
            <p>成熟周期：每年成熟一次</p>
          </div>
          <!-- 列表 -->
          <table>
            <thead>
            <tr>
              <th>成熟日期</th>
              <th>绩效考核合格率</th>
              <th>年度最大可分红股数</th>
              <th>年度最大可认购股数</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in performances">
              <td>{{ bonusShares.matureDate | dateAddYear(index+1) }}</td>
              <td>{{ item.yield }}%</td>
              <td>{{ bonusShares.stockNum }}</td>
              <td>{{ (item.subrate * bonusShares.stockNum / 100).toFixed(0) }}</td>
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
            <button v-if="!bonusShares.awardedAgreement" @click="showPopup">上传</button>
            <a v-if="bonusShares.awardedAgreement" href="#" @click="downLoad">授予协议</a>
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
        mature: {},
        performances: {},
        stimulate: {},
        stockholder: {},
        platform: {}
      }
    },
    props: ['bonusSharesId'],
    mounted () {
      sessionStorage.setItem('bonusSharesId', this.bonusSharesId) // 存在本地用作上传文件
      this.getDatas()
    },
    beforeDestroy () {
      sessionStorage.removeItem('bonusSharesId')
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/bonusshares/findOne',
          params: {
            bonusSharesId: this.bonusSharesId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.bonusShares = result.data.bonusShares
            this.company = result.data.company
            this.companyUser = result.data.companyUser
            this.mature = result.data.mature
            this.performances = result.data.performances
            this.stimulate = result.data.stimulate
            this.stockholder = result.data.stockholder
            this.platform = result.data.platform
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
      // 点击上传显示上传弹窗
      showPopup () {
        this.$emit('isShow', 'detailsUpload')
      },
      // 下载
      downLoad (ev) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${this.bonusShares.fileName}&path=${this.bonusShares.awardedAgreement}`)
      },
      // 打印详情
      printDetails () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/bonusshares/printOne',
          data: this.toFormData({
            realName: this.companyUser.realName,
            email: this.companyUser.email,
            number: this.bonusShares.number,
            status: this.bonusShares.status,
            stockNum: this.bonusShares.stockNum,
            planName: this.stimulate.planName,
            awardedDate: new Date(this.bonusShares.awardedDate),
            matureId: this.mature.matureId,
            matureName: this.mature.matureName,
            matureLong: this.mature.matureLong,
            matureDate: new Date(this.bonusShares.matureDate),
            subscribePrice: this.bonusShares.subscribePrice,
            companyName: this.company.companyName,
            name: this.platform.name || '个人'
          })
        }).then((result) => {
          if (result.data.code === 0) {
            window.open(result.data.filePath)
          }
        })
      }
    },
    filters: {
      dateAddYear (value, i) {
        let year = new Date(value).getFullYear() || 0
        let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
        let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
        return parseInt(year) + i + '-' + month + '-' + date
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
              line-height: 25px;
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
            button{
              width: 106px;
              height: 36px;
              border: 1px solid #E3E3E3;
              background: #fff;
              color: #5090D3;
              font-size: 16px;
            }
            a{
              color: #5090D3;
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
        height: 430px;
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
              button{
                width: 86px;
                height: 30px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
