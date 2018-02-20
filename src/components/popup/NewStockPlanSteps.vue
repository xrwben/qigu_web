<template>
  <div id="NewStockPlanSteps">
    <!-- 新建步骤 -->
    <div class="wrapper">
      <div class="title">新建股权激励计划<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <new-plan-steps :step="step"></new-plan-steps>

      <!-- 第一步 基本设置 -->
      <div class="con con_first" v-show="step === 0">
        <div>
          <p><span>1.计划名称：</span><input type="text" v-model.trim="form.planName"></p>
          <p><span>2.公司全称：</span><input type="text" v-model.trim="form.companyName" readonly></p>
        </div>
        <div>
          <p>
            <span>3.激励对象入围条件：</span>
            <label>工龄&ensp;&ensp;&ensp;&ensp;</label><input type="text" v-model.trim="form.seniority"> 年(含及以上)<br/>
          </p>
          <p><span>4.计划分红额度：</span><input type="text" v-model.trim="form.shareLimit"> 元/人民币</p>
        </div>
        <div>
          <p>
            <span></span>
            <label>岗位级别</label><input type="text" v-model.trim="form.postRank"> (含及以上)<br/>
          </p>
          <p></p>
        </div>
        <div class="btn">
          <button @click="next()">下一步</button>
        </div>
      </div>

      <!-- 第二步 激励额度 -->
      <div class="con con_second" v-show="step === 1">
        <div>
          <p>5.公司注册资本</p>
          <p>
            <span><input type="text" v-model.trim="form.registeredAssets" @keyup="clearCalculate"> 元人民币</span>
            <span>虚拟股为 <input type="text" max-length="15" v-model.trim="form.dummyStock" @keyup="clearCalculate"> 股</span>
          </p>
        </div>
        <div>
          <p>6.激励额度</p>
          <ul class="clearfix">
            <li :class="{isActive: activeBtn === 1}" @click="btnType(1)">按比例</li>
            <li :class="{isActive: activeBtn === 2}" @click="btnType(2)">按注册资本</li>
          </ul>
          <div class="tabCon">
            <p class="scale" v-if="activeBtn === 1">
              <span>激励额度占公司股权的 <input @mouseover="over" @mouseout="out" @keyup="calculate(1)" type="text" v-model.trim="form.stockScale"> %</span>
              <span>对应 <input type="text" v-model.trim="form.subscribeCapital" readonly> 元认缴注册资本，对应 <input type="text" v-model.trim="form.stimulateStock" readonly> 虚拟股</span>
            </p>
            <p class="capital" v-if="activeBtn === 2">
              <span>激励额度对应 <input type="text" @keyup="calculate(2)" v-model.trim="form.subscribeCapital"> 元认缴注册资本</span>
              <span>对应公司股权的 <input type="text" v-model.trim="form.stockScale" readonly> %，对应 <input type="text" v-model.trim="form.stimulateStock" readonly> 虚拟股</span>
            </p>
          </div>
          <div class="suggest" v-if="showGusset">
            <p>激励额度大小的建议范围</p>
            <ul>
              <li>
                <span>5~10% 低</span>
                <i></i>
              </li>
              <li>
                <span>10~15% 中</span>
                <i></i>
              </li>
              <li>
                <span>15~25% 较高</span>
                <i></i>
              </li>
              <li>
                <span>>25% 高</span>
                <i></i>
              </li>
            </ul>
            <div>
              <span>大部分企业选择</span>
              <span>10%~15% 的激励额度</span>
            </div>
          </div>
        </div>
        <div class="btn">
          <button @click="prev()">上一步</button>
          <button @click="next()">下一步</button>
        </div>
      </div>

      <!-- 第三步 持股主体 -->
      <div class="con con_third"v-show="step === 2">
        <div class="mainBody">
          <div>
            <p>
              7.持股主体
              <a href="tencent://message/?uin=3402306522&Site=http://www.keygood.com&Menu=yes">
                <i class="iconfont icon-liaotian"></i>客服
              </a>
            </p>
            <div>
              <el-radio class="radioBtn" v-model.trim="form.positionsMain" label="1">个人</el-radio>
              <div>当激励对象数量较少时，且激励对象为创业元老、核心员工或公司发展不可或缺、不可替代的极少数人员可通过个人直接持股。企业创立初期会选择这种持股方式。</div>
            </div>
          </div>
          <div>
            <p>&nbsp;</p>
            <div>
              <el-radio class="radioBtn" v-model.trim="form.positionsMain" label="2">持股平台</el-radio>
              <div>当激励对象数量较多时，通常会成立有限公司或者合伙企业作为持股平台，这种持
                股方式有利于股权架构的稳定，考虑到对激励对象的约束性和税收优惠等情况，采
                用合伙企业作为持股平台的比较常见。企业成长及成熟期选择这种方式比较合适。</div>
            </div>
          </div>
        </div>
        <div class="btn">
          <button @click="prev()">上一步</button>
          <button @click="next()">下一步</button>
        </div>
      </div>

      <!-- 第四步 认购窗口期及计划有效期 -->
      <div class="con con_fourth" v-show="step === 3">
        <div class="deadline">
          <p>8.认购窗口期及计划有效期</p>
          <div>
            <label>（1）请设置员工在分红股考核成熟的情况下，对于分红股转受限股的认购窗口期</label>
            <p>认购窗口期：每年一次</p>
            <p>
              选择日期范围：
              <select v-model.trim="form.startMonth">
                <option value="1月">1月</option>
                <option value="2月">2月</option>
                <option value="3月">3月</option>
                <option value="4月">4月</option>
                <option value="5月">5月</option>
                <option value="6月">6月</option>
                <option value="7月">7月</option>
                <option value="8月">8月</option>
                <option value="9月">9月</option>
                <option value="10月">10月</option>
                <option value="11月">11月</option>
                <option value="12月">12月</option>
              </select>
              <input type="text" v-model.trim="form.startDate"> 号
              <span>至</span>
              <select v-model.trim="form.endMonth">
                <option value="1月">1月</option>
                <option value="2月">2月</option>
                <option value="3月">3月</option>
                <option value="4月">4月</option>
                <option value="5月">5月</option>
                <option value="6月">6月</option>
                <option value="7月">7月</option>
                <option value="8月">8月</option>
                <option value="9月">9月</option>
                <option value="10月">10月</option>
                <option value="11月">11月</option>
                <option value="12月">12月</option>
              </select>
              <input type="text" v-model.trim="form.endDate"> 号
            </p>
          </div>
          <div>
            <label>（2）请设置本次计划的有效期</label>
            <p>
              计划有效期：
              <input type="text" v-model.trim="form.indate"> 年
            </p>
          </div>
        </div>
        <div class="btn">
          <button @click="prev()">上一步</button>
          <button @click="next()">下一步</button>
        </div>
      </div>

      <!-- 第五步 退出机制说明 -->
      <div class="con con_fifth"v-show="step === 4">
        <p>9.退出机制说明</p>
        <label>正常退出</label>
        <ul>
          <li>
            <p>1、正常退出条件</p>
            <div>
              <p>1）经过公司董事会同意离职的；</p>
              <p>2）退休；</p>
              <p>3）丧失行为能力或死亡；</p>
              <p>4）某年度考核没达到要求后已不属于公司激励对象范畴的；</p>
              <p>5）经过公司董事会同意的其他情况。</p>
            </div>
          </li>
          <li>
            <p>2、正常退出的处置规则</p>
            <div>
              <p>1）对持有分红股部分，以退出日为截止日，计算其应得的红利。同时，截止日以后的分红股自动丧失权力。</p>
              <p>2）对持有受限股（未解限）的部分，以退出日为截止日，由公司大股东全部回购其持有的受限股，回购价格为回购时公司最近一期的每股净资产价格。</p>
              <p>3）对持有实股（受限股已解限）的部分，可继续持有。</p>
            </div>
          </li>
        </ul>
        <label>非正常退出</label>
        <ul>
          <li>
            <p>1、非正常退出条件</p>
            <div>
              <p>1）未经过公司董事会同意离职的；</p>
              <p>2）违法违规被解雇的；</p>
              <p>3）公司董事会认可的其他非正常条件。</p>
            </div>
          </li>
          <li>
            <p>2、非正常退出的处置规则</p>
            <div>
              <p>1）对持有分红股部分，以退出日为截止日，计算其应得的红利额合计，激励对象须照此额度赔偿公司经济损失。同时，截止日以后的分红股自动丧失相应权利。</p>
              <p>2）对持有受限股（未解限及已解限）的部分，以退出日为截止日，由公司大股东回购其持有所有股份的100%，回购价格为其认购公司股权时的认购价格。同时公司保留追究其经济、
                法律责任的权利。</p>
            </div>
          </li>
        </ul>
        <label>更多情形</label>
        <textarea v-model.trim="form.moreCase" placeholder="更多情形请在此补充"></textarea>
        <div class="btn">
          <button @click="prev()">上一步</button>
          <button @click="submit()">生成并预览</button>
        </div>
      </div>

      <!-- 第六步 计划预览 -->
      <div class="con con_sixth" v-if="step === 5">
        <div class="preview">
          <iframe class="htmlCon" :src="file.showfile"></iframe>
        </div>
        <!--<span>查看大图</span>-->
        <div v-if="this.file.preview">
          <p>您还需下载以下协议，请点击下载</p>
          <div class="fileDownload">
            <a href="#" v-for="item in downLoadUrl" @click="downLoad($event, item)">{{ item.name | sliceHTML }}</a>
            <a href="#" @click="downLoadPlan">股权激励计划</a>
          </div>
        </div>
        <div class="btn" v-if="!this.file.preview">
          <router-link to="/orderbuy?index=1">
            <button>去支付</button>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import NewPlanSteps from '../NewPlanSteps.vue'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  export default{
    data () {
      return {
        step: 0,
        activeBtn: 1, // 激励额度是按比例还是按注册资本
        showGusset: false,  // 是否显示比例建议
        form: {
          planName: '',
          companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
          seniority: '',
          postRank: '',
          shareLimit: '',
          registeredAssets: '',
          dummyStock: '',
          stimulateType: 1,
          stockScale: '',
          subscribeCapital: '',
          stimulateStock: '',
          positionsMain: '',
          startMonth: '',
          startDate: '',
          endMonth: '',
          endDate: '',
          startDay: '',
          endDay: '',
          indate: '',
          moreCase: '',
          ifSave: ''
        },
        companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
        file: {
          showfile: '', // 预览文件路径
          showfileName: '',
          preview: '', // 下载
          previewName: ''
        },
        downLoadUrl: [] // 文件下载
      }
    },
    components: {
      ElButton,
      NewPlanSteps
    },
    methods: {
      // 关闭弹窗
      close () {
        if (this.step === 5) {
          this.$emit('isShow', 'updatePlan')
        } else {
          this.$emit('isShow', false)
        }
      },
      // 上一步
      prev () {
        this.step = this.step - 1
      },
      // 下一步
      next () {
        if (this.step === 0) {
          if (!this.form.planName || !this.form.seniority || !this.form.postRank || !this.form.shareLimit) {
            this.$message.warning('请填写完整信息！')
          } else if (isNaN(this.form.shareLimit)) {
            this.$message.warning('数字验证有误！')
          } else {
            this.step = this.step + 1
          }
        } else if (this.step === 1) {
          if (!this.form.registeredAssets || !this.form.dummyStock || !this.form.stockScale || !this.form.subscribeCapital || !this.form.stimulateStock) {
            this.$message.warning('请填写完整信息！')
          } else {
            this.step = this.step + 1
          }
        } else if (this.step === 2) {
          if (!this.form.positionsMain) {
            this.$message.warning('请填写完整信息！')
          } else {
            this.step = this.step + 1
          }
        } else if (this.step === 3) {
          if (!this.form.startMonth || !this.form.startDate || !this.form.endMonth || !this.form.endDate || !this.form.indate) {
            this.$message.warning('请填写完整信息！')
          } else if (isNaN(this.form.startDate) || isNaN(this.form.endDate) || isNaN(this.form.indate)) {
            this.$message.warning('数字验证错误！')
          } else if (this.form.startDate > 31 || this.form.endDate > 31) {
            this.$message.warning('日期格式错误！')
          } else {
            this.step = this.step + 1
          }
        }
      },
      // 按比例或按注册资本
      btnType (i) {
        this.activeBtn = i
        this.form.stimulateType = i
        this.clearCalculate()
      },
      // 按比例提示
      over () {
        this.showGusset = true
      },
      out () {
        this.showGusset = false
      },
      // 计算比例和资本
      calculate (i) {
        if (!this.form.registeredAssets || !this.form.dummyStock) {
          this.$message.warning('请先填写整公司注册资本信息!')
        } else if (i === 1) {
          if (!/\d+/.test(parseFloat(this.form.stockScale))) {
            this.$message.warning('请输入一个数字!')
          } else {
            this.form.subscribeCapital = (parseFloat(this.form.registeredAssets) * parseFloat(this.form.stockScale) / 100).toFixed(0)
            this.form.stimulateStock = Math.round(parseFloat(this.form.dummyStock) * parseFloat(this.form.stockScale) / 100)
          }
        } else {
          console.log(this.form.subscribeCapital)
          console.log(this.form.registeredAssets)
          if (!/\d+/.test(parseInt(this.form.subscribeCapital))) {
            this.$message.warning('请输入一个数字!')
          } else if (parseInt(this.form.subscribeCapital) > parseInt(this.form.registeredAssets)) {
            this.$message.warning('认缴资本要小于公司注册资本!')
          } else {
            this.form.stockScale = Math.round((parseFloat(this.form.subscribeCapital) / parseFloat(this.form.registeredAssets) * 100))
            this.form.stimulateStock = Math.round(parseFloat(this.form.dummyStock) * parseFloat(this.form.stockScale) / 100)
          }
        }
      },
      // 重新输入清除比例
      clearCalculate () {
        if (isNaN(this.form.registeredAssets) || isNaN(this.form.dummyStock)) {
          this.$message.warning('请输入数字！')
        }
        this.form.stockScale = ''
        this.form.subscribeCapital = ''
        this.form.stimulateStock = ''
      },
      // 生成并预览
      submit () {
        let thisOrder = JSON.parse(sessionStorage.getItem('thisOrder'))
        let historyOrder = JSON.parse(sessionStorage.getItem('historyOrder'))
        if ((thisOrder && thisOrder.status === 2 && thisOrder.endTime > new Date()) || (thisOrder && thisOrder.status === 1 && historyOrder && historyOrder.endTime > new Date())) {
          this.form.ifSave = 2
        } else {
          this.form.ifSave = 1
        }
        this.axios({
          method: 'POST',
          url: '/keygood/web/stimulate/addOne',
          data: this.toFormData({
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
            realName: JSON.parse(sessionStorage.getItem('companyUser')).realName,
            planName: this.form.planName,
            seniority: this.form.seniority,
            postRank: this.form.postRank,
            shareLimit: this.form.shareLimit,
            registeredAssets: this.form.registeredAssets,
            dummyStock: this.form.dummyStock,
            stimulateType: this.form.stimulateType,
            stockScale: this.form.stockScale,
            subscribeCapital: this.form.subscribeCapital,
            stimulateStock: this.form.stimulateStock,
            positionsMain: this.form.positionsMain,
            startDay: this.form.startMonth + this.form.startDate,
            endDay: this.form.endMonth + this.form.endDate,
            indate: this.form.indate,
            moreCase: this.form.moreCase,
            ifSave: this.form.ifSave
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.file.showfile = result.data.showfile
            this.file.showfileName = result.data.showfileName
            this.file.preview = result.data.preview
            this.file.previewName = result.data.previewName
            this.downLoadUrl = result.data.modles
            this.step = this.step + 1
          }
        })
      },
      // 下载决议
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/web/modle/download?fileName=${info.name}&path=${info.path}&companyName=${JSON.parse(sessionStorage.getItem('company')).companyName}`)
      },
      // 下载激励计划
      downLoadPlan (ev) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${this.file.previewName}&path=${this.file.preview}`)
      }
    },
    filters: {
      sliceHTML (value) {
        return value.slice(0, value.length - 5)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewStockPlanSteps{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 1200px;
      /*height: 400px;*/
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50% ,-50%);
      .title{
        width: 100%;
        height: 80px;
        line-height: 80px;
        background: #EFF3F6;
        text-align: center;
        color: #333;
        font-size: 24px;
        i{
          position: absolute;
          right: 15px;
          top: -10px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .btn{
        margin: 40px 0 15px;
        text-align: center;
        display: block;
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
    input{
      font-size: 16px;
    }
    .con_first{
      padding: 0 75px;
      margin-top: 45px;
      >div{
        display: flex;
        p{
          width: 50%;
          color: #999;
          span{
            color: #333;
            font-size: 18px;
          }
          input{
            width: 300px;
            height: 30px;
            border: 1px solid #c5c5c5;
            margin-left: 30px;
            text-indent: 10px;
          }
        }
        p:last-of-type{
          text-align: right;
        }
      }
      >div:first-of-type{
        margin-bottom: 60px;
      }
      div:nth-child(2){
        p{
          input{
            width: 150px;
            margin-left: 10px;
          }
        }
        p:last-of-type{
          input{
            width: 190px;
            margin-left: 30px;
          }
        }
      }
      div:nth-child(3){
        margin-top: 10px;
        p{
          label{
            margin-left: 180px;
          }
          input{
            width: 150px;
            margin-left: 12px;
          }
        }
      }
    }
    .con_second{
      padding: 0 75px;
      >div:nth-child(1){
        margin-top: 35px;
        p:first-of-type{
          color: #333;
          font-size: 18px;
        }
        p:last-of-type{
          margin-top: 30px;
          color: #999;
          span{
            input{
              width: 220px;
              height: 30px;
              border: 1px solid #c5c5c5;
              margin-left: 15px;
              text-indent: 10px;
              font-size: 16px;
            }
          }
          span:last-of-type{
            margin-left: 90px;
            input{
              margin-left: 0px;
            }
          }
        }
      }
      >div:nth-child(2){
        margin-top: 50px;
        position: relative;
        >p{
          color: #333;
          font-size: 18px;
        }
        >ul{
          margin-top: 20px;
          margin-left: 15px;
          li{
            width: 112px;
            height: 30px;
            border: 1px solid #c5c5c5;
            color: #999;
            line-height: 30px;
            text-align: center;
            float: left;
            cursor: pointer;
          }
          li:first-of-type{
            border-right: 0px;
          }
          li:last-of-type{
            border-left: 0px;
          }
          li.isActive{
            color: #fff;
            background: #62aeff;
          }
        }
        >div.tabCon{
          color: #999;
          margin-left: 15px;
          margin-top: 20px;
          >p.scale{
            span{
              input{
                width: 80px;
                height: 30px;
                border: 1px solid #c5c5c5;
                text-indent: 10px;
              }
            }
            span:last-of-type{
              margin-left: 90px;
              input{
                width: 200px;
              }
            }
          }
          >p.capital{
            span{
              input{
                width: 170px;
                height: 30px;
                border: 1px solid #c5c5c5;
                text-indent: 10px;
              }
            }
            span:last-of-type{
              margin-left: 75px;
              input:first-of-type{
                width: 130px;
              }
              input:last-of-type{
                width: 150px;
              }
            }
          }
        }
        >div.suggest{
          width: 420px;
          height: 150px;
          padding: 10px;
          color: #999;
          border-radius: 4px;
          box-shadow: 0px 0px 10px rgba(102,102,102,0.57);
          background: #fff;
          position: absolute;
          left: 300px;
          top: -30px;
          p{
            color: #333;
          }
          >ul{
            display: flex;
            margin-top: 30px;
            li{
              width: 25%;
              text-align: center;
              span{
                font-size: 14px;
              }
              i{
                width: 60px;
                height: 4px;
                background: #999;
                display: inline-block;
              }
            }
            li:nth-child(2){
              color: #EE601A;
              i{
                background: #EE601A;
              }
            }
          }
          >div{
            text-align: center;
            font-size: 14px;
            margin-top: 5px;
            span{
              width: 100%;
              display: inline-block;
            }
          }

        }
      }
    }
    .con_third{
      .mainBody{
        display: flex;
        padding: 0 75px;
        >div{
          width: 50%;
          height: 200px;
          padding: 25px 40px 0;
          margin-top: 15px;
          >p{
            color: #333;
            font-size: 18px;
            a{
              background: #62aeff;
              color: #fff;
              padding: 2px 10px;
              font-size: 14px;
              margin-left: 20px;
              border-radius: 4px;
              i{
                font-size: 14px;
                margin-right: 5px;
              }
            }
          }
          >div{
            margin-top: 15px;
            .radioBtn{
              margin-left: 15px;
            }
            >div{
              padding: 10px 30px;
              color: #999;
              font-size: 14px;
            }
          }
        }
        >div:first-of-type{
          border-right: 1px dashed #999;
        }
      }
    }
    .con_fourth{
      padding: 0 75px;
      margin-top: 20px;
      .deadline{
        >p{
          color: #333;
          font-size: 18px;
        }
        >div:first-of-type{
          margin-top: 20px;
          color: #666;
          p{
            line-height: 40px;
            margin-left: 110px;
            select{
              width: 100px;
              height: 37px;
              border: 1px solid #c5c5c5;
              padding: 0 1%;
              font-size: 16px;
              margin-left: 10px;
            }
            input{
              width: 70px;
              height: 35px;
              border: 1px solid #c5c5c5;
              text-align: center;
              transform: translateY(-2px);
            }
            span{
              margin: 0 30px;
            }
          }
          p:first-of-type{
            color: #5090D3;
          }
        }
        >div:last-of-type{
          margin-top: 20px;
          color: #666;
          p{
            margin-left: 110px;
            margin-top: 20px;
            input{
              width: 170px;
              height: 35px;
              border: 1px solid #c5c5c5;
              margin-left: 10px;
              text-align: center;
            }
          }
        }
      }
    }
    .con_fifth{
      padding: 0 75px;
      max-height: 500px;
      overflow: auto;
      >p{
        color: #333;
        font-size: 18px;
        margin-top: 30px;
      }
      label{
        margin-top: 15px;
        color: #5090D3;
        display: block;
      }
      ul{
        li{
          >p{
            color: #333;
            font-size: 14px;
            line-height: 25px;
          }
          >div{
            margin-left: 20px;
            >p{
              color: #666;
              font-size: 14px;
              line-height: 25px;
            }
          }
        }
      }
      label:last-of-type{
        color: #333;
      }
      textarea{
        width: 100%;
        height: 40px;
        border: 1px solid #c5c5c5;
        margin-top: 10px;
      }
    }
    .con_sixth{
      padding: 0 75px 45px;
      margin-top: 24px;
      .preview{
        height: 300px;
        max-height: 300px;
        border: 1px solid #c5c5c5;
        overflow: hidden;
        .htmlCon{
          width: 100%;
          height: 100%;
        }
      }
      >span{
        display: block;
        text-align: right;
        color: #62aeff;
        font-size: 14px;
        margin-top: 5px;
      }
      >div{
        >p{
          margin-top: 34px;
          margin-bottom: 15px;
          color: #333;
        }
        .fileDownload{
          >a{
            color: #5090D3;
            border-right: 1px solid #c5c5c5;
            padding: 0px 10px;
            margin-top: 18px;
            text-decoration: underline;
          }
          a:nth-child(1), a:nth-child(3), a:nth-child(5){
            border: 0;
          }
          a:nth-child(2),a:nth-child(4){
            padding-right: 30px;
          }
          a:nth-child(3),a:nth-child(5){
            padding-left: 30px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #NewStockPlanSteps {
      .wrapper {
        width:900px;
        .title {
          height: 60px;
          line-height: 60px;
          font-size: 20px;
          i {
            top: 0px;
            font-size: 26px;
          }
        }
        .btn {
          margin: 35px 0 15px;
          button {
            width: 86px;
            height: 35px;
            font-size: 14px;
          }
          button:last-of-type {
            background: #62AEFF;
            color: #fff;
          }
        }
      }
      input{
        font-size: 14px;
      }
      .con_first{
        padding: 0 35px;
        margin-top: 25px;
        font-size: 14px;
        >div{
          p{
            span{
              font-size: 16px;
            }
            input{
              width: 250px;
              margin-left: 15px;
            }
          }
        }
        >div:first-of-type{
          margin-bottom: 30px;
        }
        div:nth-child(2){
          p{
            input{
              width: 60px;
              margin-left: 11px;
            }
          }
          p:last-of-type{
            input{
              width: 160px;
              margin-left: 5px;
            }
          }
        }
        div:nth-child(3){
          margin-top: 10px;
          p{
            label{
              margin-left: 160px;
            }
            input{
              width: 100px;
              margin-left: 12px;
            }
          }
        }
      }
      .con_second{
        padding: 0 35px;
        font-size: 14px;
        >div:nth-child(1){
          margin-top: 25px;
          p:first-of-type{
            font-size: 16px;
          }
          p:last-of-type{
            margin-top: 15px;
            span{
              input{
                width: 220px;
                font-size: 14px;
              }
            }
          }
        }
        >div:nth-child(2){
          margin-top: 35px;
          >p{
            font-size: 16px;
          }
          >ul{
            margin-top: 15px;
            li{
              width: 110px;
            }
          }
          >div.tabCon{
            margin-top: 15px;
            >p.scale{
              span{
                input{
                  width: 60px;
                }
              }
              span:last-of-type{
                margin-left: 40px;
                input{
                  width: 150px;
                }
              }
            }
            >p.capital{
              span{
                input{
                  width: 150px;
                }
              }
              span:last-of-type{
                margin-left: 35px;
                input:first-of-type{
                  width: 60px;
                }
                input:last-of-type{
                  width: 150px;
                }
              }
            }
          }
          >div.suggest{
            width: 420px;
            height: 150px;
            padding: 10px;
            color: #999;
            border-radius: 4px;
            box-shadow: 0px 0px 10px rgba(102,102,102,0.57);
            background: #fff;
            position: absolute;
            left: 250px;
            top: -30px;
            p{
              color: #333;
            }
            >ul{
              display: flex;
              margin-top: 30px;
              li{
                width: 25%;
                text-align: center;
                span{
                  font-size: 14px;
                }
                i{
                  width: 60px;
                  height: 4px;
                  background: #999;
                  display: inline-block;
                }
              }
              li:nth-child(2){
                color: #EE601A;
                i{
                  background: #EE601A;
                }
              }
            }
            >div{
              text-align: center;
              font-size: 14px;
              margin-top: 5px;
              span{
                width: 100%;
                display: inline-block;
              }
            }

          }
        }
      }
      .con_third{
        .mainBody{
          padding: 0 35px;
          >div{
            height: 180px;
            padding: 16px 20px 0;
            >p{
              font-size: 16px;
              a{
                font-size: 12px;
                i{
                  font-size: 13px;
                }
              }
            }
          }
        }
      }
      .con_fourth{
        padding: 0 35px;
        font-size: 14px;
        .deadline{
          >p{
            font-size: 16px;
          }
          >div:first-of-type{
            margin-top: 10px;
            p{
              line-height: 35px;
              margin-left: 100px;
              select{
                width: 90px;
                height: 35px;
                font-size: 14px;
              }
              input{
                width: 60px;
                height: 33px;
                transform: translateY(-1px);
              }
            }
          }
          >div:last-of-type{
            margin-top: 15px;
            p{
              margin-left: 100px;
              margin-top: 15px;
              input{
                width: 100px;
                height: 33px;
              }
            }
          }
        }
      }
      .con_fifth{
        padding: 0 35px;
        max-height: 300px;
        >p{
          font-size: 16px;
          margin-top: 20px;
        }
        label{
          margin-top: 10px;
        }
      }
      .con_sixth{
        padding: 0 35px 30px;
        margin-top: 20px;
        .preview{
          height: 200px;
          max-height: 200px;
        }
        >div{
          margin-top: 25px;
          >p{
            font-size: 14px;
          }
          .fileDownload{
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
