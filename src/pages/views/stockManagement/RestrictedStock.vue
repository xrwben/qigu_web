<template>
  <div id="ShareStock">
    <!-- 导航栏 -->
    <div class="nav">
      <button @click="selectClick()" :class="{btn: true, isActive: active}">筛选<i class="iconfont icon-102fangxiang_xiangxia"></i></button>
      <div class="dropDown" v-show="showDropDown">
        <p>按所属计划筛选</p>
        <div class="maxHeightDiv">
          <p v-for="(item, index) in selectDatas">
            <input type="radio" :id='item.stimulateId' v-model="form.planeName" :value="item.stimulateId"><label :for="item.stimulateId">{{ item.planName }}</label>
          </p>
        </div>
        <div class="btns">
          <button @click="cancel()">取消</button>
          <button @click="confirm()">确定</button>
        </div>
      </div>
      <div class="search">
        <el-input class="searchInput" placeholder="持有人、编号" v-model="form.searchValue">
          <el-button @click="confirm()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="rightBtn">
        <button :class="{is_active: btnActive}"  @click="btnClick()">
          <i class="iconfont icon-wenjianjia"></i>
          股权激励计划管理
          <i class="drop iconfont icon-102fangxiang_xiangxia"></i>
          <span v-if="undoneNum">{{ undoneNum }}</span>
        </button>
        <button @click="showPopup(6)"><i class="iconfont icon-baohu"></i>授予</button>
        <div class="planManagement" v-if="btnActive">
          <div class="planItems">
            <div v-for="item in planManagements" @click="clickPlan(item.status, item)">
              <p>{{ item.planName }}({{ item.status | planStatus }})</p>
              <el-progress :show-text="false" :stroke-width="12" :percentage="item.percent"></el-progress>
              <p>{{ item.usableStock }}股可用，共{{ item.stimulateStock }}股</p>
              <a v-if="item.status === 1" href="javascript:void(0)">继续完成股权激励计划</a>
            </div>
          </div>
          <p><button @click="showPopup(1)"><i class="iconfont icon-iconfont7"></i>新建股权激励计划</button></p>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>编号</th>
          <th>持有人</th>
          <th>解限计划</th>
          <th>总股数</th>
          <th>已解限(股)</th>
          <th>认购价(元/股)</th>
          <th>所属计划</th>
          <th>认购日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tableDatas">
          <td>{{ item.number }}</td>
          <td>{{ company.showNameEmail ? item.realName : '***' }}</td>
          <td>{{ item.unfreezeName }}</td>
          <td>{{ item.subscribeNum }}</td>
          <td>{{ item.notLimit }}</td>
          <td>{{ item.subscribePrice }}</td>
          <td>{{ item.planName }}</td>
          <td>{{ item.createTime | dateFormat }}</td>
          <td>
            <a href="javascript:void(0)" @click="showPopup(2, item.limitationId)">详情</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        prev-text="上一页"
        next-text="下一页"
        :total="totalSize">
      </el-pagination>
    </div>

    <!-- 新建股权激励计划选择弹窗 -->
    <new-stock-plan v-if="showNewStockPlan" v-on:isShow="closePopup"></new-stock-plan>

    <!-- 新建步骤 -->
    <new-stock-plan-steps v-if="showNewStockPlanSteps" v-on:isShow="closePopup"></new-stock-plan-steps>

    <!-- 激励计划详情 -->
    <plan-details v-if="showPlanDetails" :stimulateId="stimulateId" v-on:isShow="closePopup"></plan-details>

    <!-- 上传新建激励计划文档 -->
    <new-stock-plan-upload v-if="NewStockPlanUpload" :info="info" v-on:isShow="closePopup"></new-stock-plan-upload>

    <!-- 授予详情 -->
    <grant-details-nolimit v-if="showGrantDetailsNolimit" :limitationId="limitationId" v-on:isShow="closePopup"></grant-details-nolimit>

    <!-- 上传 -->
    <share-stock-upload v-if="showShareStockUpload" v-on:isShow="closePopup"></share-stock-upload>

    <!-- 授予 -->
    <set-grant v-if="showSetGrant" v-on:isShow="closePopup"></set-grant>

  </div>
</template>

<script>
  import NewStockPlan from '../../../components/popup/NewStockPlan.vue'
  import NewStockPlanSteps from '../../../components/popup/NewStockPlanSteps.vue'
  import PlanDetails from '../../../components/popup/PlanDetails.vue'
  import NewStockPlanUpload from '../../../components/popup/NewStockPlanUpload.vue'
  import GrantDetailsNolimit from '../../../components/popup/GrantDetailsNolimit.vue'
  import ShareStockUpload from '../../../components/popup/ShareStockUpload.vue'
  import SetGrant from '../../../components/popup/SetGrant.vue'
  export default {
    data () {
      return {
        form: {
          planeName: '',
          searchValue: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        selectDatas: [],
        tableDatas: {},
        undoneNum: 0,
        planManagements: [],
        active: false, // 是否加class
        showDropDown: false, // 是否显示下拉框
        btnActive: false, // 是否加class和显示下拉框
        showNewStockPlan: false, // 是否显示新建激励计划
        showNewStockPlanSteps: false, // 是否显示新建激励计划步骤
        showPlanDetails: false, // 是否显示激励计划详情
        NewStockPlanUpload: false, // 是否显示新建激励计划文件上传
        showGrantDetailsNolimit: false, // 是否显示授予详情
        showShareStockUpload: false, // 是否显示上传弹窗
        showSetGrant: false, // 是否显示授予弹窗
        company: JSON.parse(sessionStorage.getItem('company'))
      }
    },
    components: {
      NewStockPlan,
      NewStockPlanSteps,
      PlanDetails,
      NewStockPlanUpload,
      GrantDetailsNolimit,
      ShareStockUpload,
      SetGrant
    },
    mounted () {
      this.getDatas()
      this.getPlanName()
      this.getPlanManagement()
    },
    methods: {
      // 点击筛选
      selectClick () {
        if (this.active) {
          this.active = false
          this.showDropDown = false
        } else {
          this.active = true
          this.showDropDown = true
        }
      },
      // 获取下拉筛选的所属计划
      getPlanName () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findBySelect',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
            status: 2
          }
        }).then((result) => {
          this.selectDatas = result.data.stimulates
        })
      },
      // 取消选择
      cancel () {
        this.active = false
        this.showDropDown = false
        this.form.type = null
        this.form.planeName = ''
      },
      // 确认选择
      confirm () {
        this.active = false
        this.showDropDown = false
        this.getDatas()
        this.form.type = null
        this.form.planeName = ''
      },
      // 股权激励计划管理
      btnClick () {
        if (this.btnActive) {
          this.btnActive = false
        } else {
          this.btnActive = true
        }
      },
      // 获取下拉股权激励计划
      getPlanManagement () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findlist',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          this.planManagements = result.data.stimulates
        })
      },
      // 显示激励计划详情弹窗
      viewPlanDetails (id) {
        this.stimulateId = id
        this.showPlanDetails = true
      },
      // 点击计划判断显示详情还是上传文档
      clickPlan (status, info) {
        if (status === 1) { // 未完成显示上传文档弹窗，把id传过去
          this.NewStockPlanUpload = true
          this.info = info
        } else {
          this.viewPlanDetails(info.stimulateId)
        }
      },
      // 显示计划弹窗
      showPopup (i, id) {
        if (i === 1) {
          this.showNewStockPlan = true
        } else if (i === 2) {
          this.showGrantDetailsNolimit = true
          this.limitationId = id
        } else if (i === 3) {
          this.showShareStockUpload = true
          this.bonusSharesId = id
        } else if (i === 6) {
          this.showSetGrant = true
        }
      },
      // 关闭弹窗
      closePopup (value) {
        if (value && value === 'new') { // 显示新建计划
          this.showNewStockPlanSteps = true
        } else if (value && value === 'add') {
          this.NewStockPlanUpload = true
          this.showNewStockPlan = false
          this.info = ''
        } else if (value && value === 'detailsUpload') {
          this.showShareStockUpload = true
        } else if (value && value === 'closeUploadDetails') {
          this.showShareStockUpload = false
        } else if (value && value === 'closeUpload') {
          this.showShareStockUpload = false
          this.showGrantDetailsNolimit = false
          this.getDatas()
        } else if (value && value === 'update') {
          this.showSetGrant = false
          this.showGrantDetailsNolimit = false
          this.NewStockPlanUpload = false
          this.getDatas()
        } else if (value && value === 'updatePlan') {
          this.showNewStockPlan = false
          this.showNewStockPlanSteps = false
          this.getPlanManagement()
          this.getDatas()
        } else {
          this.showNewStockPlan = false
          this.showNewStockPlanSteps = false
          this.showPlanDetails = false
          this.NewStockPlanUpload = false
          this.showGrantDetailsNolimit = false
          this.showShareStockUpload = false
          this.showSetGrant = false
        }
      },
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/limitation/findMapByLike',
          params: {
            stimulateId: this.form.planeName,
            keyword: this.form.searchValue,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          this.tableDatas = result.data.page.list
          this.totalSize = result.data.page.totalCount
          this.undoneNum = result.data.undoneNum
        })
      },
      // 每页数目改变
      sizeChange (val) {
        this.pageSize = val
        this.getDatas()
      },
      // 当前页码改变
      currentChange (val) {
        this.currentPage = val
        this.getDatas()
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ShareStock{
    .nav{
      height: 100%;
      position: relative;
      .btn{
        width: 98px;
        height: 38px;
        background: #fff;
        border: 1px solid #E3E3E3;
        color: #999;
        font-size: 16px;
        i{
          margin-left: 10px;
          transition: transform .3s,-webkit-transform .3s;
          color: #E3E3E3;
          display: inline-block;
        }
      }
      .btn.isActive{
        background: #5090D3;
        color: #fff;
        i{
          color: #fff;
          transform: rotate(180deg);
          -ms-transform:rotate(180deg);
          -moz-transform:rotate(180deg);
          -webkit-transform:rotate(180deg);
          -o-transform:rotate(180deg);
        }
      }
      .dropDown{
        width: 280px;
        padding: 12px 17px 14px;
        border: 1px solid #EFF3F8;
        box-shadow: 0 0 1px rgba(51,51,51,0.1);
        background: #fff;
        position: absolute;
        left: 0;
        top: 45px;
        p{
          color: #333;
          line-height: 20px;
          label{
            color: #999;
            display: inline-block;
            line-height: 30px;
            font-size: 14px;
            vertical-align: middle;
          }
          input{
            margin-right: 10px;
            vertical-align: middle;
          }
        }
        .maxHeightDiv{
          border: 1px solid #E3E3E3;
          max-height: 120px;
          overflow-y: auto;
          padding: 0 10px;
          margin-bottom: 5px;
          margin-top: 5px;
        }
        .btns{
          margin: 10px auto 0px;
          text-align: center;
          button{
            width:80px;
            height:30px;
            background:rgba(98,174,255,1);
            border: 1px solid #E3E3E3;
            border-radius: 4px ;
            color: #fff;
            display: inline-block;
            font-size: 14px;
            letter-spacing: 5px;
          }
          button:first-of-type{
            background: #fff;
            color: #999;
          }
        }
        label{
          color: #999;
          display: block;
          line-height: 30px;
          font-size: 14px;
        }
      }
      .search{
        width: 300px;
        height: 35px;
        position: absolute;
        left: 150px;
        top: 0;
      }
      .rightBtn{
        position: absolute;
        right: 0;
        top: 0;
        button{
          width: 260px;
          height: 38px;
          border: 1px solid #5090D3;
          background: #fff;
          font-size: 16px;
          border-radius: 4px;
          color: #5090D3;
          vertical-align: middle;
          text-align: center;
          position: relative;
          i{
            margin-right: 10px;
            font-size: 22px;
            vertical-align: middle;
            display: inline-block;
            transition: transform .3s,-webkit-transform .3s;
          }
          i:last-of-type{
            margin-left: 15px;
          }
          span{
            width: 20px;
            height: 20px;
            line-height: 20px;
            border-radius: 50%;
            color: #fff;
            background: #D23C3B;
            text-align: center;
            font-size: 12px;
            position: absolute;
            right: -10px;
            top: -10px;
          }
        }
        button:last-of-type{
          width: 106px;
          margin-left: 18px;
          i:last-of-type{
            margin-left: 0px;
          }
        }
        button.is_active{
          background: #5090D3;
          color: #fff;
          i.drop{
            color: #fff;
            transform: rotate(180deg);
            -ms-transform:rotate(180deg);
            -moz-transform:rotate(180deg);
            -webkit-transform:rotate(180deg);
            -o-transform:rotate(180deg);
          }
        }
        .planManagement{
          width: 400px;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 0 10px #666;
          position: absolute;
          right: 130px;
          top: 45px;
          z-index: 1;
          .planItems{
            max-height: 290px;
            overflow-y: auto;
            padding: 0 20px;
            margin-top: 20px;
            >div{
              border-bottom: 1px solid #E3E3E3;
              padding: 20px 0;
              cursor: pointer;
              >p:first-of-type{
                color: #333;
                font-size: 18px;
                margin-bottom: 20px;
              }
              >p:last-of-type{
                color: #666;
                margin-top: 11px;
                text-align: right;
              }
              a{
                color: #5090D3;
                font-size: 14px;
                display: block;
                text-align: right;
                margin-top: 30px;
                text-decoration: underline;
              }
            }
            div:first-of-type{
              padding-top: 0;
            }
            div:last-of-type{
              border: 0;
            }
          }
          >p{
            text-align: center;
            padding: 15px 0px;
            button{
              width: 220px;
              height: 38px;
            }
          }
        }
      }
    }
    .list{
      border: 1px solid #EFF3F8;
      margin-top: 20px;
      table{
        width: 100%;
        text-align: center;
        table-layout: fixed;
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
            td:last-of-type{
              a{
                color: #5090D3;
                margin: 0 10px;
              }
            }
          }
          tr:last-of-type{
            border-bottom: 0;
          }
        }
      }
    }
    .pagination{
      margin-top: 20px;
      text-align: right;
    }
  }

  @media screen and (max-width: 1366px){
    #ShareStock{
      .nav{
        .btn{
          width: 90px;
          height: 35px;
          font-size: 14px;
        }
        .search{
          width: 250px;
          height: 35px;
        }
        .rightBtn{
          button{
            width: 210px;
            height: 35px;
            font-size: 14px;
            i{
              font-size: 18px;
            }
            i:last-of-type{
              font-size: 14px;
            }
          }
          button:last-of-type{
            width: 100px;
            margin-left: 15px;
            i:last-of-type{
              margin-left: 0px;
              font-size: 18px;
            }
          }
          .planManagement{
            width: 350px;
            right: 120px;
            .planItems{
              max-height: 255px;
              margin-top: 10px;
              >div{
                >p:first-of-type{
                  font-size: 16px;
                  margin-bottom: 10px;
                }
                >p:last-of-type{
                  margin-top: 8px;
                  font-size: 14px;
                }
              }
            }
            >p{
              padding: 10px 0px 15px;
              button{
                width: 180px;
                height: 35px;
                font-size: 14px;
              }
            }
          }
        }
      }
      .list{
        margin-top: 20px;
        table{
          font-size: 14px;
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
    }
  }
</style>
