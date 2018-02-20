<template>
  <div id="ShareStockChange">
    <div class="wrapper wrapper_1" v-show="step === 1">
      <div class="title">分红股转换<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <label>请上传</label>
          <span>受限股认购确认书</span>
          <el-upload
            class="uploadFlie"
            action="/keygood/web/oss/upload?fileType=1"
            :headers=uploadHeader
            :show-file-list="false"
            :on-success="handleSuccess">
            <el-button>{{ file.btnText }}</el-button>
          </el-upload>
        </p>
        <span><i>*注意：</i> 如果上传多个文件，请先打成压缩包再上传！</span>
        <div class="btn">
          <button @click="next()">下一步</button>
        </div>
      </div>
    </div>

    <div class="wrapper wrapper_2" v-if="step === 2">
      <div class="title">分红股转换<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div class="conBody">
          <div>
            <ul>
              <li>
                <span>绩效考核合格率(大于等于)</span>
                <div>{{ performance.yield }}%</div>
              </li>
              <li>
                <span>年度最大可分红股数</span>
                <div>{{ stockNum }}</div>
              </li>
              <li>
                <span>年度最大可认购股数</span>
                <div>{{ performance.subrate }}</div>
              </li>
            </ul>
          </div>
          <div>
            <ul>
              <li>
                <span>本次完成业绩指标</span>
                <div><input type="text" v-model.trim="form.content"></div>
              </li>
              <li>
                <span>本次可分红的股数</span>
                <div><input type="text" v-model.trim="form.bonusNum"></div>
              </li>
              <li>
                <span>本次可认购的股数</span>
                <div><input type="text" v-model.trim="form.subscribeNum" @keyup="calculate"></div>
              </li>
              <li>
                <span>本次认购价(元/股)</span>
                <div><input type="text" v-model.trim="form.subscribePrice"></div>
              </li>
              <li>
                <span>本次完成的比例</span>
                <div><input type="text" v-model.trim="form.completePercent" readonly></div>
              </li>
              <li>
                <span>本次已失效股权</span>
                <div><input type="text" v-model.trim="form.failureEquity" readonly></div>
              </li>
            </ul>
          </div>
          <div>
            <p>
              <span>本次受限股解限计划：</span>
              <select v-model.trim="form.unfreezeId">
                <option v-for="item in selectUnfreePlans" :value="item.unfreezeId">{{ item.unfreezeName }}</option>
              </select>
              <!--<a href="javascript:void(0)" @click="showPopup">自定义解限计划>></a>-->
            </p>
          </div>
        </div>
        <div class="btn">
          <button @click="submit()">确定</button>
        </div>
      </div>
    </div>

    <!-- 自定义解限计划 -->
    <!--<new-no-limit-plan v-show="showNewNoLimitPlan" v-on:isShow="closePopup"></new-no-limit-plan>-->

  </div>
</template>

<script>
//  import NewNoLimitPlan from './NewNoLimitPlan.vue'
  export default{
    data () {
      return {
        step: 1,
//        showNewNoLimitPlan: false, // 是否显示自定义弹窗
        file: {
          fileName: '',
          filePath: '',
          btnText: '上传'
        },
        form: {
          content: '',
          bonusNum: '',
          subscribeNum: '',
          subscribePrice: '',
          completePercent: '',
          failureEquity: '',
          unfreezeId: ''
        },
        uploadHeader: {
          token: sessionStorage.getItem('token')
        },
        performance: {},
        stockNum: '',
        selectUnfreePlans: []
      }
    },
    components: {
//      NewNoLimitPlan
    },
    props: ['bonusSharesId'],
    mounted () {
      this.getDatas()
      this.getUnfreePlan()
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      // 下一步
      next () {
        if (!this.file.filePath) {
          this.$message.warning('请先上传文件！')
        } else {
          this.step = 2
        }
      },
//      showPopup () {
//        this.showNewNoLimitPlan = true
//      },
//      closePopup () {
//        this.showNewNoLimitPlan = false
//      },
      // 文件上传回显
      handleSuccess (response) {
        this.file.fileName = response.fileName
        this.file.filePath = response.filePath
        this.file.btnText = '完成'
      },
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/limitation/findPerformance',
          params: {
            bonusSharesId: this.bonusSharesId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.performance = result.data.performance
            this.stockNum = result.data.stockNum
          }
        })
      },
      // 获取解限计划
      getUnfreePlan () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/unfreeze/findByLike',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.selectUnfreePlans = result.data.page.list
          }
        })
      },
      // 计算
      calculate () {
        if (!/^\d+$/.test(this.form.subscribeNum)) {
          this.$message.warning('请输入一个数值！')
        } else if (this.performance.subrate !== 0 && this.performance.subrate >= this.form.subscribeNum) {
          this.form.completePercent = (this.form.subscribeNum / this.performance.subrate * 100).toFixed(4)
          this.form.failureEquity = this.performance.subrate - this.form.subscribeNum
        } else {
          this.form.completePercent = 0
          this.form.failureEquity = 0
        }
      },
      // 确认转换
      submit () {
        if (!this.form.content || !this.form.bonusNum || !this.form.subscribeNum || !this.form.subscribePrice || !this.form.unfreezeId) {
          this.$message.warning('请完善信息！')
        } else if (isNaN(this.form.bonusNum)) {
          this.$message.warning('数字验证错误！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/limitation/addOne',
            data: this.toFormData({
              bonusSharesId: this.bonusSharesId,
              fileName: this.file.fileName,
              subscribeInform: this.file.filePath,
              performanceId: this.performance.performanceId,
              content: this.form.content,
              bonusNum: this.form.bonusNum,
              subscribeNum: this.form.subscribeNum,
              subscribePrice: this.form.subscribePrice,
              completePercent: this.form.completePercent,
              failureEquity: this.form.failureEquity,
              unfreezeId: this.form.unfreezeId
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('转换成功！')
              this.$emit('isShow', 'update')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ShareStockChange{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
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
      .con{
        .btn{
          margin-top: 30px;
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
    .wrapper_1{
      width: 600px;
      height: 250px;
      .con{
        margin-top: 40px;
        padding: 0 35px;
        text-align: center;
        p{
          line-height: 40px;
          text-align: center;
          margin-bottom: 10px;
          label{
            color: #666;
          }
          >span{
            font-size: 18px;
            color: #333;
            margin-left: 15px;
          }
          .uploadFlie{
            display: inline-block;
            margin-left: 20px;
            span{
              color: #62aeff;
            }
          }
        }
        >span{
          color: #999;
          font-size: 14px;
          i{
            color: red;
          }
        }
      }
    }
    .wrapper_2{
      width: 1110px;
      height: 450px;
      .con{
        padding: 0 15px;
        margin-top: 10px;
        .conBody{
          >div:nth-child(1){
            padding-bottom: 35px;
            border-bottom: 1px solid #EFF3F8;
            ul{
              display: flex;
              li{
                width: 200px;
                margin: 0 15px;
                span{
                  color: #666;
                  line-height: 35px;
                }
                div{
                  width: 200px;
                  height: 38px;
                  color: #999;
                  background: #EFF3F8;
                  line-height: 38px;
                  text-align: center;
                }
              }
            }
          }
          >div:nth-child(2){
            padding-top: 10px;
            ul{
              display: flex;
              li{
                width: 150px;
                margin: 0 15px;
                span{
                  color: #666;
                  line-height: 35px;
                }
                div{
                  input{
                    width: 150px;
                    height: 38px;
                    border: 1px solid #c5c5c5;
                    text-align: center;
                    color: #5090D3;
                    font-size: 16px;
                  }
                }
              }
            }
          }
          >div:nth-child(3){
            margin-top: 45px;
            padding: 0 15px;
            span{
              color: #333;
            }
            select{
              width: 220px;
              height: 38px;
              border: 1px solid #c5c5c5;
              color: #999;
              padding: 0 10px;
              font-size: 16px;
              margin: 0 15px;
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
    #ShareStockChange{
      .wrapper{
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          .btn{
            margin-top: 25px;
            button{
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
          }
        }
      }
      .wrapper_1{
        width: 500px;
        height: 225px;
        .con{
          margin-top: 30px;
          padding: 0 30px;
          p{
            line-height: 40px;
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            >span{
              font-size: 16px;
              margin-left: 10px;
            }
          }
        }
      }
      .wrapper_2{
        width: 900px;
        height: 380px;
        .con{
          padding: 0 15px;
          margin-top: 10px;
          .conBody{
            >div:nth-child(1){
              padding-bottom: 25px;
              ul{
                li{
                  width: 180px;
                  margin: 0 5px;
                  font-size: 14px;
                  div{
                    width: 180px;
                    height: 35px;
                    line-height: 35px;
                  }
                }
              }
            }
            >div:nth-child(2){
              ul{
                li{
                  width: 120px;
                  margin: 0 10px;
                  span{
                    font-size: 14px;
                  }
                  div{
                    input{
                      width: 120px;
                      height: 35px;
                      font-size: 14px;
                    }
                  }
                }
              }
            }
            >div:nth-child(3){
              margin-top: 35px;
              padding: 0 10px;
              font-size: 14px;
              select{
                width: 180px;
                height: 35px;
                font-size: 14px;
                margin: 0 10px;
              }
            }
          }
        }
      }
    }
  }
</style>
