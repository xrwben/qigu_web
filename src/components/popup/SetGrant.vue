<template>
  <div id="SetGrant">
    <div class="wrapper wrapper_1" v-show="step === 1">
      <div class="title">授予<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <label>选择股权激励计划</label>
          <select v-model.trim="form.stimulateId" @change="changePlan()">
            <option v-for="(item, index) in selectDatas" :value="item.stimulateId">{{ item.planName }}</option>
          </select>
        </p>
        <span>可用股权数量：{{ form.usableStock }}股</span>
        <span>持股主体：{{ form.positionsMain | positionsMainType }}</span>
        <div class="btn">
          <button @click="next(2)">下一步</button>
        </div>
      </div>
    </div>

    <div class="wrapper wrapper_2" v-if="step === 2">
      <div class="title">授予<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="steps">
        <span :class="{isActive: step === 2}">
          <i></i>
          <label>授予详细（第一步）</label>
        </span>
        <span :class="{isActive: step === 3}">
          <i></i>
          <label>授予详细（第二步）</label>
        </span>
      </div>
      <div class="con">
        <div>
          <div><span>授予类型</span><span>分红股</span></div>
          <div class="nameInput">
            <span>姓名</span>
            <label class="name" @click="showDrop(1)">{{ form.name }}</label>
            <div v-if="showName" :class="{nameDrop: showName}">
              <nav class="clearfix">
                <div class="search">
                  <el-input class="searchInput" placeholder="姓名" v-model.trim="form.searchValue">
                    <el-button @click="searchName()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
                  </el-input>
                </div>
              </nav>
              <div class="list">
                <table>
                  <thead>
                  <tr>
                    <th width="100">姓名</th>
                    <th>邮箱</th>
                    <th>证件号</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in form.tableNames" @click="clickSelectedName(item)">
                    <td>{{ item.realName }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.papersNum }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>
          <div><span>数量</span><input type="text" v-model.trim="form.stockNum" @change="calculate"><span>股 最大可用虚拟股：{{ form.usableStock }}股</span></div>
          <div><span></span><span>对应{{ form.dummyStock }}公司总虚拟股，占总股权{{ form.equityPercent }}%</span></div>
          <div v-show="this.form.positionsMain === 2">
            <span>持股平台</span>
            <label class="name" @click="showDrop(2)">{{ form.platform }}</label>
            <div v-if="showPlatform" :class="{nameDrop: showPlatform}">
              <div class="list">
                <table>
                  <thead>
                  <tr>
                    <th>公司名称</th>
                    <th>注册资本(元)</th>
                    <th>股东上限</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="item in form.tablePlatforms" @click="clickSelectedPlatform(item)">
                    <td>{{ item.name }}</td>
                    <td>{{ item.registeredAssets }}</td>
                    <td>{{ item.shareholderLimit }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="note note1">
            <span>授予日期</span>
            <el-date-picker v-model.trim="form.awardedDate" type="date" value-format="yyyy/MM/dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
            <i>
              <label class="tips">
                授予协议签订日期
              </label>
            </i>
          </div>
          <div class="note note2">
            <span>认购价格</span>
            <span>按认购时公司前一年公布的每股净资产价格的&ensp;<input type="text" v-model.trim="form.subscribePrice">%</span>
            <i>
              <label class="tips">
                通常会给到激励对象一定的折扣，可根据企业实际情况而定
              </label>
            </i>
          </div>
          <div class="note note3">
            <span>回购说明</span>
            <el-radio v-model.trim="form.radioInput" label="1">&nbsp</el-radio>
            <span>按回购时公司前一年公布的每股净资产价格的&ensp;<input type="text" v-model.trim="form.buyBackNote1" :readonly="form.radioInput != 1">%</span>
            <i>
              <label class="tips">
                按照协议约定，根据不同退出情况，对其需要回购的股权价格进行确定
              </label>
            </i>
          </div>
          <div>
            <span></span>
            <el-radio v-model.trim="form.radioInput" label="2">  自定义</el-radio>
            <input type="text" v-model.trim="form.buyBackNote2" :readonly="form.radioInput != 2">
          </div>
          <div class="note lookPlan">
            <span>成熟计划</span>
            <select v-model.trim="form.matureId">
              <option v-for="item in form.tableMaturePlans" :value="item.matureId">{{ item.matureName }}</option>
            </select>
            <i @click="showDrop(3)" :class="{isClick: showPlan}"></i>
            <div class="lookCon" v-if="showPlan">
              <p>成熟计划名称：<span>{{ form.maturePlanDetails.mature.matureName }}</span></p>
              <p>
                成熟周期：<span>每年成熟一次</span>
                计划长度：<span>{{ form.maturePlanDetails.mature.matureLong }} 年</span>
              </p>
              <div class="items">
                <p v-for="item in form.maturePlanDetails.performances">
                  绩效考核合格率(大于等于)：<span>{{ item.yield }}%</span>
                  年度最大可分红股数：<span>{{ form.stockNum }}</span>
                  年度最大可认购股数：<span>{{ (item.subrate * form.stockNum / 100).toFixed(0) }}</span>
                </p>
              </div>
              <p>当前可认购股共计(股)：{{ form.stockNum }}</p>
            </div>
          </div>
          <div class="note note4">
            <span>成熟起算日期</span>
            <el-date-picker v-model.trim="form.matureDate" type="date" value-format="yyyy/MM/dd HH:mm:ss" placeholder="选择日期"></el-date-picker>
            <i>
              <label class="tips">
                通常为授予日期，也可以激励对象年度考核起算日作为成熟起算日
              </label>
            </i>
          </div>
          <div>
            <span>其它约定及条框</span>
            <textarea placeholder="非必填" v-model.trim="form.otherConventions"></textarea>
          </div>
        </div>
        <div class="btn">
          <button @click="next(1)">上一步</button>
          <button @click="next(3)">下一步</button>
        </div>
      </div>
    </div>

    <div class="wrapper wrapper_3" v-if="step === 3">
      <div class="title">授予<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="steps">
        <span :class="{isActive: step === 2}">
          <i></i>
          <label>授予详细（第一步）</label>
        </span>
        <span :class="{isActive: step === 3}">
          <i></i>
          <label>授予详细（第二步）</label>
        </span>
      </div>
      <div class="con">
        <div class="second">
          <div>
            <span>授予协议</span>
            <a id="downLoad" href="javascript:void(0)" @click="downLoad">下载</a>
          </div>
          <div>
            <span>备注</span>
            <textarea placeholder="非必填" v-model.trim="form.Note"></textarea>
          </div>
        </div>
        <div class="btn">
          <button @click="next(2)">上一步</button>
          <button @click="submit">确定</button>
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
        selectDatas: [],
        form: {
          stimulateId: '',
          usableStock: '',
          positionsMain: '--',
          name: '',
          searchValue: '',
          tableNames: [],
          nameId: '',
          stockNum: '',
          stimulateStock: '', // 最大可用虚拟股
          subscribeCapital: '', // 对应认缴注册资本
          registeredCapital: '',
          equityPercent: 0,
          platform: '',
          platformId: '',
          tablePlatforms: [],
          awardedDate: '',
          subscribePrice: '',
          radioInput: '',
          buyBack: '',
          buyBackNote1: '',
          buyBackNote2: '',
          matureId: '',
          tableMaturePlans: [],
          maturePlanDetails: {
            mature: {},
            performances: []
          },
          matureDate: '',
          otherConventions: '',
          downLoadInfo: {
            fileName: '',
            filePath: ''
          },
          Note: '',
          companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId
        },
        showName: false,
        showPlatform: false,
        showPlan: false
      }
    },
    mounted () {
      this.getSelectDatas()
      this.getName()
      this.getPlatform()
      this.getMaturePlan()
    },
    methods: {
      // 获取下拉数据
      getSelectDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findUsableStockAndPositionsMain',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          this.selectDatas = result.data.usableStockAndPositionsMain
        })
      },
      // 改变授予计划
      changePlan () {
        this.selectDatas.forEach((item) => {
          if (item.stimulateId === this.form.stimulateId) {
            this.form.usableStock = item.usableStock
            this.form.positionsMain = item.positionsMain
            this.form.stimulateStock = item.stimulateStock
            this.form.dummyStock = item.dummyStock
          }
        })
      },
      // 关闭窗口
      close () {
        this.$emit('isShow', false)
      },
      // 根据数量计算注册资本和股权
      calculate () {
        if (isNaN(this.form.stockNum)) {
          this.$message.warning('数字验证不正确！')
        } else {
          this.form.equityPercent = parseFloat((this.form.stockNum / this.form.dummyStock * 100).toFixed(4))
        }
      },
      // 下一步
      next (i) {
        if (i === 1) {
          this.step = i
        } else if (i === 2) {
          if (!this.form.stimulateId) {
            this.$message.warning('请选择激励计划！')
          } else {
            this.step = i
          }
        } else if (i === 3) {
          this.toBeFile(i)
        }
      },
      // 获取姓名数据
      getName () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/findBylike',
          params: {
            keyword: this.form.searchValue,
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.form.tableNames = result.data.page.list
          }
        })
      },
      // 搜索名字
      searchName () {
        this.getName()
      },
      // 点击选择名字
      clickSelectedName (info) {
        this.form.name = info.realName
        this.form.nameId = info.companyUserId
        this.showName = false
      },
      // 获取平台数据
      getPlatform () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/platform/findBylike',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.form.tablePlatforms = result.data.page.list
          }
        })
      },
      // 点击选择平台
      clickSelectedPlatform (info) {
        this.form.platform = info.name
        this.form.platformId = info.playformId
        this.showPlatform = false
      },
      // 获取成熟计划下拉数据
      getMaturePlan () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/mature/findByLike',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.form.tableMaturePlans = result.data.page.list
          }
        })
      },
      // 获取成熟计划详情
      getMaturePlanDetails () {
        this.form.maturePlanDetails.mature = {}
        this.form.maturePlanDetails.performances = []
        this.axios({
          method: 'GET',
          url: '/keygood/web/mature/findOne',
          params: {
            matureId: this.form.matureId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.form.maturePlanDetails.mature = result.data.mature
            this.form.maturePlanDetails.performances = result.data.performances
          }
        })
      },
      // 显示下拉框
      showDrop (i) {
        if (i === 1) {
          if (this.showName) {
            this.showName = false
          } else {
            this.showName = true
          }
        } else if (i === 2) {
          if (this.showPlatform) {
            this.showPlatform = false
          } else {
            this.showPlatform = true
          }
        } else if (i === 3) {
          if (this.showPlan) {
            this.showPlan = false
          } else {
            if (!this.form.stockNum) {
              this.$message.warning('请输入分红股数量！')
            } else if (!this.form.matureId) {
              this.$message.warning('请选择成熟计划！')
            } else {
              this.getMaturePlanDetails()
              this.showPlan = true
            }
          }
        }
      },
      // 提交数据生成协议（下一步按钮）
      toBeFile (i) {
        console.log(this.form.buyBack)
        if (!this.form.stimulateId || !this.form.nameId || !this.form.stockNum || !this.form.awardedDate || !this.form.subscribePrice || !this.form.buyBack || !this.form.matureId || !this.form.matureDate) {
          this.$message.warning('请完善信息！')
        } else if (isNaN(this.form.subscribePrice)) {
          this.$message.warning('数字验证错误！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/bonusshares/conferFile',
            data: this.toFormData({
              stimulateId: this.form.stimulateId,
              companyUserId: this.form.nameId,
              stockNum: this.form.stockNum,
              registeredCapital: this.form.dummyStock,
              equityPercent: this.form.equityPercent,
              platformId: this.form.platformId,
              awardedDate: this.form.awardedDate,
              subscribePrice: this.form.subscribePrice,
              buyBack: this.form.buyBack,
              matureId: this.form.matureId,
              matureDate: this.form.matureDate,
              otherConventions: this.form.otherConventions
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.step = i
              this.form.downLoadInfo.fileName = result.data.fileName
              this.form.downLoadInfo.filePath = result.data.filePath
            }
          })
        }
      },
      // 下载文件
      downLoad () {
        document.getElementById('downLoad').setAttribute('href', `/keygood/web/oss/download?fileName=${this.form.downLoadInfo.fileName}&path=${this.form.downLoadInfo.filePath}`)
      },
      submit () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/bonusshares/addOne',
          data: this.toFormData({
            stimulateId: this.form.stimulateId,
            companyUserId: this.form.nameId,
            stockNum: this.form.stockNum,
            registeredCapital: this.form.dummyStock,
            equityPercent: this.form.equityPercent,
            platformId: this.form.platformId,
            awardedDate: this.form.awardedDate,
            subscribePrice: this.form.subscribePrice,
            buyBack: this.form.buyBack,
            matureId: this.form.matureId,
            matureDate: this.form.matureDate,
            otherConventions: this.form.otherConventions,
            note: this.form.Note
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('授予成功！')
            this.$emit('isShow', 'update')
          }
        })
      }
    },
    watch: {
      'form.radioInput': {
        handler (value) {
          if (value === '1') {
            this.form.buyBackNote2 = ''
          }
          if (value === '2') {
            this.form.buyBackNote1 = ''
          }
        }
      },
      'form.buyBackNote1': {
        handler () {
          if (this.form.radioInput === '1') {
            this.form.buyBack = '按回购时公司前一年公布的每股净资产价格的' + this.form.buyBackNote1 + '%'
          }
        }
      },
      'form.buyBackNote2': {
        handler () {
          if (this.form.radioInput === '2') {
            this.form.buyBack = this.form.buyBackNote2
          }
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetGrant{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper_1{
      width: 600px;
      height: 270px;
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
        margin-top: 30px;
        padding: 0 35px;
        text-align: center;
        p{
          line-height: 40px;
          text-align: center;
          margin-bottom: 10px;
          label{
            color: #333;
          }
          select{
            width: 230px;
            height: 38px;
            border: 1px solid #c5c5c5;
            color: #666;
            font-size: 16px;
            padding: 0 10px;
            margin-left: 25px;
          }
        }
        >span{
          text-align: left;
          color: #5090D3;
          font-size: 14px;
          line-height: 25px;
          display: block;
          margin-left: 250px;
        }
      }
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
    .wrapper_2{
      width: 800px;
      /*height: 800px;*/
      background: #fff;
      padding-bottom: 10px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #EFF3F6;
        text-align: center;
        color: #333;
        font-size: 24px;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .steps{
        height: 60px;
        text-align: center;
        padding-top: 20px;
        font-size: 0;
        padding-left: 210px;
        background: #EFF3F6;
        span{
          width: 210px;
          border-top: 1px solid #999;
          display: inline-block;
          position: relative;
          font-size: 18px;
          color: #999;
          i{
            width: 10px;
            height: 10px;
            background: #999;
            border-radius: 50%;
            display: block;
            transform: translate(-50%, -50%);
          }
          label{
            transform: translate(-50%, 15px);
            position: absolute;
            left: 0;
            top: 0px;
          }
        }
        span:last-of-type{
          border: 0;
        }
        span.isActive{
          i{
            background: #62aeff;
          }
          label{
            color: #5090D3;
          }
        }
      }
      .con{
        margin-top: 30px;
        padding: 0 35px;
        >div{
          >div{
            line-height: 30px;
            margin-bottom: 10px;
            >span:first-of-type{
              width: 150px;
              height: 30px;
              text-align: right;
              margin-right: 25px;
              color: #333;
              float: left;
            }
            >span{
              color: #666;
            }
            >label.name{
              width: 250px;
              height: 30px;
              border: 1px solid #c5c5c5;
              color: #333;
              display: inline-block;
              text-indent: 10px;
            }
            input{
              width: 250px;
              height: 30px;
              border: 1px solid #c5c5c5;
              text-indent: 10px;
              margin-right: 10px;
              color: #333;
            }
            select{
              width: 250px;
              height: 32px;
              border: 1px solid #c5c5c5;
              padding: 0 10px;
              color: #333;
            }
            textarea{
              width: 500px;
              height: 100px;
              border: 1px solid #c5c5c5;
              padding: 5px;
              font-size: 14px;
              color: #333;
            }
          }
          div:nth-child(1){
            span:last-of-type{
              color: #5090D3;
            }
          }
          div:nth-child(2){
            position: relative;
            .nameDrop{
              width: 500px;
              box-shadow: 1px 0px 10px rgba(102,102,102,0.57);
              background: #fff;
              padding: 10px 0;
              position: absolute;
              left: 175px;
              top: 35px;
              z-index: 10;
              >nav{
                margin-bottom: 10px;
                padding: 0 10px;
                .search{
                  width: 240px;
                  float: right;
                }
              }
              .list{
                max-height: 210px;
                overflow: auto;
                >table{
                  width: 100%;
                  text-align: center;
                  font-size: 14px;
                  table-layout: fixed;
                  thead{
                    tr{
                      height: 40px;
                      background: #EFF3F6;
                      border-bottom: 1px solid #EFF3F6;
                      color: #666;
                    }
                  }
                  tbody{
                    tr{
                      height: 40px;
                      border-bottom: 1px solid #EFF3F6;
                      color: #333;
                      td:last-of-type{
                        a{
                          color: #5090D3;
                          margin: 0 10px;
                        }
                      }
                    }
                    tr:hover{
                      background: #EFFFF8;
                      cursor: pointer;
                    }
                  }
                }
              }

            }
          }
          div:nth-child(4){
            margin-top: -10px;
            span:last-of-type{
              margin-top: -5px;
              font-size: 14px;
            }
          }
          div:nth-child(5){
            position: relative;
            .nameDrop{
              width: 500px;
              box-shadow: 1px 0px 10px rgba(102,102,102,0.57);
              background: #fff;
              position: absolute;
              left: 175px;
              top: 35px;
              z-index: 10;
              >nav{
                margin-bottom: 10px;
                padding: 0 10px;
                .search{
                  width: 240px;
                  float: right;
                }
              }
              .list{
                max-height: 210px;
                overflow: auto;
                >table{
                  width: 100%;
                  text-align: center;
                  font-size: 14px;
                  table-layout: fixed;
                  thead{
                    tr{
                      height: 40px;
                      background: #EFF3F6;
                      border-bottom: 1px solid #EFF3F6;
                      color: #666;
                    }
                  }
                  tbody{
                    tr{
                      height: 40px;
                      border-bottom: 1px solid #EFF3F6;
                      color: #333;
                      td:last-of-type{
                        a{
                          color: #5090D3;
                          margin: 0 10px;
                        }
                      }
                    }
                    tr:hover{
                      background: #EFFFF8;
                      cursor: pointer;
                    }
                  }
                }
              }

            }
          }
          div:nth-child(7){
            input{
              width: 50px;
              text-indent: 0;
              text-align: center;
            }
          }
          div:nth-child(8){
            input{
              width: 50px;
              text-indent: 0;
              text-align: center;
            }
          }
          div.note{
            i{
              width: 27px;
              height: 27px;
              display: inline-block;
              vertical-align: middle;
              background: url("../../assets/icon_look_quesition.png") no-repeat;
              background-position: 0px -22px;
              position: relative;
              margin-left: 10px;
              .tips{
                line-height: 20px;
                background: #999;
                color: #fff;
                font-size: 14px;
                padding: 15px 10px;
                position: absolute;
                left: 100%;
                top: -8px;
                margin-left: 15px;
                display: none;
                transition: all .5s ease-in-out;
                z-index: 1;
              }
              .tips:before{
                content: '';
                border: 10px solid #999;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid transparent;
                position: absolute;
                left: -20px;
                top: 10px;
              }
            }
            i:hover{
              background-position: -28px -22px;
              cursor: pointer;
            }
            i:hover .tips{
              display: block;
            }
          }
          div.note1{
            i{
              .tips{
                width: 120px;
              }
            }
          }
          div.note2{
            i{
              .tips{
                width: 200px;
              }
            }
          }
          div.note3{
            i{
              .tips{
                width: 200px;
              }
            }
          }
          div.note4{
            i{
              .tips{
                width: 220px;
              }
            }
            /*<!--i:hover{-->*/
              /*<!--background-position: -31px 0px;-->*/
            /*<!--}-->*/
          }
          div.lookPlan{
            position: relative;
            i{
              width: 30px;
              height: 21px;
              background-position: 0px 0px;
            }
            i:hover{
              background-position: 0px 0px;
            }
            i.isClick{
              background-position: -31px 0px;
            }
            .lookCon{
              width: 700px;
              height: 280px;
              padding: 15px 20px;
              background: #fff;
              box-shadow: 0 0 10px rgba(102,102,102,0.57);
              position: absolute;
              left: 300px;
              top: -300px;
              z-index: 5;
              >p:nth-child(1){
                color: #333;
                font-size: 18px;
                span{
                  color: #5090D3;
                  font-size: 18px;
                }
              }
              >p:nth-child(2){
                color: #333;
                padding-bottom: 10px;
                border-bottom: 1px solid #62aeff;
                span{
                  color: #666;
                  font-size: 16px;
                  margin-right: 150px;
                }
              }
              >p:last-of-type{
                color: #333;
              }
              >div{
                height: 160px;
                border-bottom: 1px solid #EFF3F8;
                padding: 5px 0;
                max-width: 700px;
                max-height: 160px;
                overflow: auto;
                p{
                  width: 900px;
                  color: #666;
                  span{
                    color: #999;
                    margin-right: 25px;
                  }
                  span:last-of-type{
                    margin-right: 0px;
                  }
                }
              }
            }
          }
        }
      }
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
    .wrapper_3{
      width: 800px;
      height: 450px;
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
        background: #EFF3F6;
        text-align: center;
        color: #333;
        font-size: 24px;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .steps{
        height: 60px;
        text-align: center;
        padding-top: 20px;
        font-size: 0;
        padding-left: 210px;
        background: #EFF3F6;
        span{
          width: 210px;
          border-top: 1px solid #999;
          display: inline-block;
          position: relative;
          font-size: 18px;
          color: #999;
          i{
            width: 10px;
            height: 10px;
            background: #999;
            border-radius: 50%;
            display: block;
            transform: translate(-50%, -50%);
          }
          label{
            transform: translate(-50%, 15px);
            position: absolute;
            left: 0;
            top: 0px;
          }
        }
        span:last-of-type{
          border: 0;
        }
        span.isActive{
          i{
            background: #62aeff;
          }
          label{
            color: #5090D3;
          }
        }
      }
      .con{
        margin-top: 25px;
        .second{
          >div{
            margin-bottom: 10px;
            display: flex;
            span{
              width: 200px;
              display: inline-block;
              text-align: right;
              margin-right: 28px;
              line-height: 40px;
              color: #333;
            }
            a{
              width: 106px;
              height: 38px;
              line-height: 38px;
              border: 1px solid #E3E3E3;
              border-radius: 4px;
              background: #62aeff;
              color: #fff;
              display: inline-block;
              text-align: center;
            }
            textarea{
              width: 510px;
              height: 120px;
              border: 1px solid #c5c5c5;
              padding: 5px;
              font-size: 14px;
              color: #666;
            }
          }
        }
      }
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

  @media screen and (max-width: 1366px){
    #SetGrant{
      .wrapper_1{
        width: 500px;
        height: 240px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 20px;
          padding: 0 30px;
          p{
            line-height: 35px;
            label{
              font-size: 14px;
            }
            select{
              width: 200px;
              height: 35px;
              font-size: 14px;
              margin-left: 20px;
            }
          }
          >span{
            line-height: 20px;
            margin-left: 200px;
          }
        }
        .btn{
          margin-top: 30px;
          button{
            width: 86px;
            height: 35px;
            font-size: 14px;
          }
        }
      }
      .wrapper_2{
        width: 700px;
        /*height: 590px;*/
        .title{
          height: 40px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .steps{
          height: 40px;
          padding-top: 10px;
          span{
            font-size: 16px;
            label{
              transform: translate(-50%, 10px);
            }
          }
        }
        .con{
          margin-top: 15px;
          padding: 0 30px;
          font-size: 14px;
          >div{
            >div{
              line-height: 25px;
              margin-bottom: 6px;
              >span:first-of-type{
                width: 150px;
                height: 25px;
              }
              >label.name{
                width: 250px;
                height: 25px;
              }
              input{
                width: 200px;
                height: 25px;
              }
              select{
                width: 200px;
                height: 27px;
              }
              textarea{
                width: 400px;
                height: 40px;
              }
            }
            div:nth-child(4){
              margin-top: -5px;
            }
            div.note{
              i{
                width: 20px;
                height: 20px;
                background: url("../../assets/icon_look_quesition_small.png") no-repeat;
                background-position: 0px -16px;
              }
              i:hover{
                background-position: -21px -16px;
              }
            }
            div.lookPlan{
              i{
                width: 23px;
                height: 15px;
                background-position: 0px 0px;
              }
              i:hover{
                background-position: 0px 0px;
              }
              i.isClick{
                background-position: -24px 0px;
              }
              .lookCon{
                width: 610px;
                height: 240px;
                left: 300px;
                top: -265px;
                z-index: 5;
                >p:nth-child(1){
                  font-size: 16px;
                  span{
                    font-size: 16px;
                  }
                }
                >p:nth-child(2){
                  padding-bottom: 8px;
                  span{
                    font-size: 14px;
                    margin-right: 120px;
                  }
                }
                >p:last-of-type{
                  padding: 5px 0px;
                }
                >div{
                  height: 150px;
                  max-width: 610px;
                  max-height: 150px;
                  p{
                    width: 750px;
                  }
                }
              }
            }
          }
          .nameInput{
            height: 27px;
          }
        }
        .btn{
          margin-top: 15px;
          button{
            width: 86px;
            height: 32px;
            font-size: 14px;
          }
        }
      }
      .wrapper_3{
        width: 700px;
        height: 360px;
        .title{
          height: 40px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .steps{
          height: 40px;
          padding-top: 10px;
          span{
            font-size: 16px;
            label{
              transform: translate(-50%, 10px);
            }
          }
        }
        .con{
          margin-top: 20px;
          font-size: 14px;
          .second{
            >div{
              span{
                width: 150px;
                margin-right: 25px;
                line-height: 35px;
              }
              a{
                width: 86px;
                height: 33px;
                line-height: 33px;
              }
              textarea{
                width: 410px;
                height: 120px;
              }
            }
          }
        }
        .btn{
          margin-top:20px;
          button{
            width: 86px;
            height: 35px;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
