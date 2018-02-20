<template>
  <div id="GrantProtocol">
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
        <el-input class="searchInput" placeholder="文档" v-model="form.searchValue">
          <el-button @click="confirm()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>类型</th>
          <th>被授予人</th>
          <th>文档</th>
          <th>所属计划</th>
          <th>更新日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableDatas">
            <td>授予协议</td>
            <td>{{ item.realName }}</td>
            <td style="white-space: pre-wrap;word-wrap: break-word">{{ item.fileName }}</td>
            <td>{{ item.planName }}</td>
            <td>{{ item.uploadTime | dateFormat }}</td>
            <td>
              <a href="javascript:void(0)" @click="downLoad($event, item)">下载</a>
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
  </div>
</template>

<script>
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
        companyId: JSON.parse(sessionStorage.getItem('companyUser')).companyId,
        selectDatas: {},
        tableDatas: [],
        active: false, // 是否加class
        showDropDown: false // 是否显示下拉框
      }
    },
    mounted () {
      this.getDatas()
      this.getPlanName()
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
      // 取消选择
      cancel () {
        this.active = false
        this.showDropDown = false
        this.form.type = []
        this.form.planeName = ''
        this.getDatas()
      },
      // 确认选择
      confirm () {
        this.active = false
        this.showDropDown = false
        this.getDatas()
      },
      // 获取下拉筛选的所属计划
      getPlanName () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findBySelect',
          params: {
            companyId: this.companyId,
            status: 2
          }
        }).then((result) => {
          this.selectDatas = result.data.stimulates
        })
      },
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/bonusshares/findFileMapByLike',
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.form.searchValue,
            companyId: this.companyId,
            stimulateId: this.form.planeName
          }
        }).then((result) => {
          this.tableDatas = result.data.page.list
          this.totalSize = result.data.page.totalCount
        })
      },
      // 改变没页数大小
      // 每页数目改变
      sizeChange (val) {
        this.pageSize = val
        this.getDatas()
      },
      // 当前页码改变
      currentChange (val) {
        this.currentPage = val
        this.getDatas()
      },
      // 下载文件
      downLoad (ev, info) {
        ev.target.setAttribute('href', `/keygood/web/oss/download?fileName=${info.fileName}&path=${info.awardedAgreement}`)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #GrantProtocol{
    padding-bottom: 20px;
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
        background: #62AEFF;
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
        z-index: 1;
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
          max-height: 200px;
          overflow-y: scroll;
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
    #GrantProtocol{
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
