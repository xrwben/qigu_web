<template>
  <div id="OrderList">
    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th width="200">订单号</th>
          <th>激励人员人数</th>
          <th>服务名称</th>
          <th width="200">有效期</th>
          <th>支付金额</th>
          <th>订单状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableDatas">
            <td>{{ item.number }}</td>
            <td>{{ item.stimulateNop }}</td>
            <td>{{ item.serviceName }}</td>
            <td v-if="item.payTime">{{ item.payTime | dateFormat }} 至 {{ item.endTime | dateFormat }}</td>
            <td v-if="!item.payTime">{{ '--' }} 至 {{ '--' }}</td>
            <td>{{ item.realMoney }} 元</td>
            <td>{{ item.status | orderStatus }}</td>
            <td><a href="javascript:void(0)" @click="showPopup(item.orderId)">详细</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 订单详情 -->
    <order-details v-if="isShow" :id="id" v-on:isShow="closePopup"></order-details>
  </div>
</template>

<script>
  import OrderDetails from '../../../components/popup/OrderDetails.vue'
  export default {
    data () {
      return {
        tableDatas: [],
        isShow: false
      }
    },
    components: {
      OrderDetails
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/order/findByLike',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.tableDatas = result.data.page.list
          }
        })
      },
      showPopup (id) {
        this.id = id
        this.isShow = true
      },
      closePopup () {
        this.isShow = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .list{
    border: 1px solid #EFF3F8;
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

  @media screen and (max-width: 1366px){
    .list{
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
</style>
