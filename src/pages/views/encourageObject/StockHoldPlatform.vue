<template>
  <div id="StockHoldPlatform">
    <!-- 导航栏 -->
    <div class="nav clearfix">
      <div class="search">
        <el-input class="searchInput" placeholder="持股平台" v-model="form.searchValue">
          <el-button @click="search" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="rightBtn">
        <button @click="showAddEdit()"><i class="iconfont icon-iconfont7"></i>添加持股平台</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>公司名称</th>
          <th>注册资本（元）</th>
          <th>持有公司股权（%）</th>
          <th>股东上限</th>
          <th>营业执照号码</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tableDatas">
          <td>{{ item.name }}</td>
          <td>{{ item.registeredAssets }}</td>
          <td>{{ item.stockOption }}</td>
          <td>{{ item.shareholderLimit }}</td>
          <td>{{ item.licenseNum }}</td>
          <td>
            <a href="javascript:void(0)" @click="showAddEdit(item)">详情</a>
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

    <!-- 添加持股平台 -->
    <add-stock-hold-platform v-if="showAddPlatform" v-on:isShow="closePopup"></add-stock-hold-platform>

    <!-- 持股平台详情 -->
    <stock-hold-platform-details v-if="showPlatformDetails" :info="info" v-on:isShow="closePopup"></stock-hold-platform-details>

  </div>
</template>

<script>
  import AddStockHoldPlatform from '../../../components/popup/AddStockHoldPlatform.vue'
  import StockHoldPlatformDetails from '../../../components/popup/StockHoldPlatformDetails.vue'
  export default {
    data () {
      return {
        form: {
          searchValue: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        companyId: JSON.parse(sessionStorage.getItem('companyUser')).companyId,
        tableDatas: [],
        showAddPlatform: false, // 是否显示添加持股平台弹窗
        showPlatformDetails: false // 是否显示持股平台详情弹窗
      }
    },
    components: {
      AddStockHoldPlatform,
      StockHoldPlatformDetails
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/platform/findBylike',
          params: {
            keyword: this.form.searchValue,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            companyId: this.companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
            this.totalSize = result.data.page.totalCount
          }
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
      },
      // 搜索
      search () {
        this.getDatas()
      },
      // 显示添加编辑弹窗
      showAddEdit (info) {
        if (info) {
          this.info = info
          this.showPlatformDetails = true
        } else {
          this.showAddPlatform = true
        }
      },
      closePopup (value) {
        if (value && value === 'add') {
          this.getDatas()
        }
        this.showAddPlatform = false
        this.showPlatformDetails = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #StockHoldPlatform{
    padding-bottom: 20px;
    .nav{
      height: 100%;
      position: relative;
      .search{
        width: 300px;
        height: 35px;
      }
      .rightBtn{
        position: absolute;
        right: 0;
        top: 0;
        button{
          width: 150px;
          height: 38px;
          border: 1px solid #5090D3;
          background: #fff;
          font-size: 16px;
          border-radius: 4px;
          color: #5090D3;
          i{
            margin-right: 15px;
          }
        }
        button:last-of-type{
          width: 170px;
          margin-left: 18px;
        }
      }
    }
    .list{
      border: 1px solid #EFF3F8;
      margin-top: 28px;
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
            th{
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            td:last-of-type{
              a{
                color: #62AEFF;
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
    #StockHoldPlatform{
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
            width: 120px;
            height: 35px;
            font-size: 14px;
            i{
              margin-right: 10px;
            }
          }
          button:last-of-type{
            width: 150px;
            margin-left: 15px;
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
