<template>
  <div id="ChangeRecord">
    <!-- 导航栏 -->
    <div class="nav">
      <div class="rightBtn">
        <button @click="showPopup(1)"><i class="iconfont icon-dujiayuniconzhenggao-"></i>修改净资产</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>变更编号</th>
          <th>日期</th>
          <th>变更前净资产(元)</th>
          <th>变更后净资产(元)</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableDatas">
          <td>{{ index ? index : '原始值' }}</td>
          <td>{{ item.createTime | dateFormat }}</td>
          <td>{{ item.beforAsset || '--' }}</td>
          <td>{{ item.afterAsset }}</td>
          <td>
            <a href="javascript:void(0)" @click="showPopup(2, index, item.assetChangeId)">详细</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 修改净资产 -->
    <set-net-assets v-if="showSetNetAssets" v-on:isShow="closePopup"></set-net-assets>

    <!-- 变更详情 -->
    <change-details  v-if="showChangeDetails" :id="id" :index="index" v-on:isShow="closePopup"></change-details>

  </div>
</template>

<script>
  import SetNetAssets from '../../../components/popup/SetNetAssets.vue'
  import ChangeDetails from '../../../components/popup/ChangeDetails.vue'
  export default {
    data () {
      return {
        tableDatas: [],
        showSetNetAssets: false, // 是否显示修改弹窗
        showChangeDetails: false // 是否显示详情弹窗
      }
    },
    components: {
      SetNetAssets,
      ChangeDetails
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/assetchange/findBylike',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
          }
        })
      },
      // 显示弹窗
      showPopup (i, index, id) {
        if (i === 1) {
          this.showSetNetAssets = true
        } else if (i === 2) {
          this.id = id
          this.index = index
          this.showChangeDetails = true
        }
      },
      closePopup (value) {
        if (value && value === 'update') {
          this.getDatas()
        }
        this.showSetNetAssets = false
        this.showChangeDetails = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ChangeRecord{
    .nav{
      .rightBtn{
        text-align: right;
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
  }

  @media screen and (max-width: 1366px){
    #ChangeRecord{
      .nav{
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
        margin-top: 10px;
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
