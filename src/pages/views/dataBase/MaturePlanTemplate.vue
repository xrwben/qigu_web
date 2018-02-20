<template>
  <div id="MaturePlanTemplate">
    <!-- 导航栏 -->
    <div class="nav">
      <div class="search">
        <el-input class="searchInput" placeholder="请输入名称" v-model="form.searchValue">
          <el-button @click="search()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="rightBtn">
        <button @click="showAddEdit()"><i class="iconfont icon-iconfont7"></i>新建成熟计划</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>名称</th>
          <th>计划长度</th>
          <th>成熟周期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableDatas">
            <td>{{ item.matureName }}</td>
            <td>{{ item.matureLong }}年</td>
            <td>每年成熟一次</td>
            <td>
              <a href="javascript:void(0)" @click="viewDetails(item.matureId)">查看</a>
              <!--<a v-if="item.companyId" href="javascript:void(0)" @click="">删除</a>-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建成熟计划 -->
    <new-mature-plan v-if="showAdd" v-on:isShow="closePopup"></new-mature-plan>

    <!-- 查看成熟计划 -->
    <mature-plan-details v-if="showDetails" :id="id" v-on:isShow="closePopup"></mature-plan-details>

  </div>
</template>

<script>
  import NewMaturePlan from '../../../components/popup/NewMaturePlan.vue'
  import MaturePlanDetails from '../../../components/popup/MaturePlanDetails.vue'
  export default {
    data () {
      return {
        form: {
          searchValue: ''
        },
        tableDatas: [],
        showAdd: false, // 是否显示新建弹窗
        showDetails: false // 是否显示详情查看弹窗
      }
    },
    components: {
      NewMaturePlan,
      MaturePlanDetails
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/mature/findByLike',
          params: {
            keyword: this.form.searchValue,
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
          }
        })
      },
      // 搜索
      search () {
        this.getDatas()
      },
      // 显示添加编辑弹窗
      showAddEdit () {
        this.showAdd = true
      },
      // 查看详情
      viewDetails (id) {
        this.showDetails = true
        this.id = id
      },
      closePopup (value) {
        if (value && value === 'add') {
          this.getDatas()
        }
        this.showAdd = false
        this.showDetails = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #MaturePlanTemplate{
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
  }

  @media screen and (max-width: 1366px){
    #MaturePlanTemplate{
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

