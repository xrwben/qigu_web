<template>
  <div id="OperationLogs">
    <div class="logs">
      <!-- 导航栏 -->
      <div class="nav">
        <button @click="selectClick()" :class="{btn: true, isActive: active}">筛选<i class="iconfont icon-102fangxiang_xiangxia"></i></button>
        <div class="dropDown" v-show="showDropDown">
          <p>按类型筛选</p>
          <p>
            <input type="radio" id="type1" v-model="form.type" value="1"><label for="type1">股权</label>
          </p>
          <p>
            <input type="radio" id="type2" v-model="form.type" value="2"><label for="type2">公司管理</label>
          </p>
          <p>
            <input type="radio" id="type3" v-model="form.type" value="3"><label for="type3">订单及购买</label>
          </p>
          <p>按时间段筛选</p>
          <label @click="lastTime(7)">最近一周</label>
          <label @click="lastTime(30)">最近一个月</label>
          <label @click="lastTime(90)">最近三个月</label>
          <el-date-picker class="timerPick" placeholder="日期" value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="form.startTime"></el-date-picker>
          -
          <el-date-picker class="timerPick" placeholder="日期" value-format="yyyy-MM-dd HH:mm:ss" type="date" v-model="form.endTime"></el-date-picker>
          <div class="btns">
            <button @click="cancel()">取消</button>
            <button @click="confirm()">确定</button>
          </div>
        </div>
        <div class="search">
          <el-input class="searchInput" placeholder="操作人" v-model="form.searchValue">
            <el-button @click="confirm()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 列表 -->
      <div class="list">
        <table>
          <thead>
            <tr>
              <th width="150px">操作人</th>
              <th width="150px">类型</th>
              <th>内容</th>
              <th width="150px">日期</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableDatas">
              <td>{{ item.realName }}</td>
              <td>{{ item.type | logsType }}</td>
              <td>{{ item.content }}</td>
              <td>{{ item.createTime | dateFormat }}</td>
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
    <div class="noLogs"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          type: null,
          startTime: null,
          endTime: null,
          searchValue: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        companyId: JSON.parse(sessionStorage.getItem('companyUser')),
        active: false, // 是否加class
        showDropDown: false, // 是否显示下拉框
        tableDatas: []
      }
    },
    mounted () {
      this.getDatas()
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
      // 快捷日期选择
      lastTime (num) {
        const date = new Date()
        this.form.startTime = this.toDateFormat(date.getTime() - 3600 * 1000 * 24 * num)
        this.form.endTime = this.toDateFormat(date.getTime())
      },
      // 取消选择
      cancel () {
        this.active = false
        this.showDropDown = false
        this.form.type = null
        this.form.startTime = null
        this.form.endTime = null
        this.getDatas()
      },
      // 确认选择
      confirm () {
        this.active = false
        this.showDropDown = false
        this.currentPage = 1
        this.pageSize = 10
        this.getDatas()
      },
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/weblog/findBylike',
          params: {
            type: this.form.type,
            startTime: this.form.startTime,
            endTime: this.form.endTime,
            keyword: this.form.searchValue,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            companyId: this.companyId.companyId
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
      // 时间转换
      toDateFormat (value) {
        let year = new Date(value).getFullYear() || 0
        let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
        let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
        return year + '-' + month + '-' + date + ' ' + 0 + ':' + 0 + ':' + 0
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #OperationLogs{
    padding-bottom: 20px;
  }
  .nav{
    margin-top: 25px;
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
      p{
        color: #333;
        line-height: 35px;
        label{
          color: #999;
          display: inline-block;
          line-height: 30px;
          font-size: 14px;
          vertical-align: middle;
        }
        input{
          margin-right: 5px;
          vertical-align: middle;
        }
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
          td{
            white-space: pre-wrap;
            word-wrap: break-word;
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

  @media screen and (max-width: 1366px){
    .nav{
      margin-top: 20px;
      position: relative;
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
</style>
