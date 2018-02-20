<template>
  <div id="EncourageObjectName">
    <!-- 导航栏 -->
    <div class="nav">
      <button @click="selectClick()" :class="{btn: true, isActive: active}">筛选<i class="iconfont icon-102fangxiang_xiangxia"></i></button>
      <div class="dropDown" v-show="showDropDown">
        <p>
          <input type="radio" id="type1" v-model="form.type" value="1"><label for="type1">董事</label>
        </p>
        <p>
          <input type="radio" id="type2" v-model="form.type" value="2"><label for="type2">监事</label>
        </p>
        <p>
          <input type="radio" id="type3" v-model="form.type" value="3"><label for="type3">激励对象</label>
        </p>
        <div class="btns">
          <button @click="cancel()">取消</button>
          <button @click="confirm()">确定</button>
        </div>
      </div>
      <div class="search">
        <el-input class="searchInput" placeholder="员工ID、名称、邮箱" v-model="form.searchValue">
          <el-button @click="confirm()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="rightBtn">
        <button @click="showImportPopup"><i class="iconfont icon-daoru"></i>批量导入</button>
        <button @click="showAddEdit()"><i class="iconfont icon-iconfont7"></i>添加激励对象</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>激励对象名称</th>
          <th>邮箱</th>
          <th>员工ID</th>
          <th>部门</th>
          <th>职位</th>
          <th>身份类型</th>
          <th width="220">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableDatas">
            <td>{{ item.realName }}</td>
            <td>{{ item.email }}</td>
            <td>{{ item.empno || '--' }}</td>
            <td>{{ item.department || '--' }}</td>
            <td>{{ item.post || '--' }}</td>
            <td>{{ item.identity | identityType}}</td>
            <td v-if="item.logonMode === 1 || item.companyUserId === companyUser.companyUserId"></td>
            <td v-if="item.logonMode !== 1 && item.companyUserId !== companyUser.companyUserId">
              <a href="javascript:void(0)" @click="sendEmail(item.companyUserId)">重新发送邮件邀请</a>
              <a href="javascript:void(0)" @click="showAddEdit(item.companyUserId)">编辑</a>
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

    <!-- 导入激励人员 -->
    <import-encourage-people v-if="showImport" v-on:isShow="closePopup"></import-encourage-people>

    <!-- 添加、编辑激励人员 -->
    <add-edit-encourage-people v-if="showAddDetails" :id="id" v-on:isShow="closePopup"></add-edit-encourage-people>
  </div>
</template>

<script>
  import ImportEncouragePeople from '../../../components/popup/ImportEncouragePeople.vue'
  import AddEditEncouragePeople from '../../../components/popup/AddEditEncouragePeople.vue'
  export default {
    data () {
      return {
        form: {
          type: null,
          searchValue: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        companyUser: JSON.parse(sessionStorage.getItem('companyUser')),
        tableDatas: [],
        active: false, // 是否加class
        showDropDown: false, // 是否显示下拉框
        showImport: false, // 是否显示批量导入弹窗
        showAddDetails: false, // 是否显示添加编辑弹窗
        objInfo: {
          realName: '',
          email: '',
          papersType: 1,
          papersNum: '',
          empno: '',
          department: '',
          post: '',
          identity: '',
          role: '',
          ifSend: 1
        },
        id: ''
      }
    },
    components: {
      ImportEncouragePeople,
      AddEditEncouragePeople
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
      // 取消选择
      cancel () {
        this.active = false
        this.showDropDown = false
        this.form.type = []
        this.form.startTime = ''
        this.form.endTime = ''
        this.getDatas()
      },
      // 确认选择
      confirm () {
        this.active = false
        this.showDropDown = false
        this.getDatas()
      },
      // 获取列表数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/findBylike',
          params: {
            identity: this.form.type,
            keyword: this.form.searchValue,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            companyId: this.companyUser.companyId
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
      // 重新发送邮件
      sendEmail (id) {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/sendEmailActivate',
          params: {
            companyUserId: id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message({
              message: result.data.msg,
              type: 'success'
            })
          }
        })
      },
      // 显示导入弹窗
      showImportPopup () {
        this.showImport = true
      },
      // 显示添加编辑弹窗
      showAddEdit (id) {
        if (id) {
          this.id = id
        } else {
          this.id = ''
        }
        this.showAddDetails = true
      },
      // 关闭弹窗
      closePopup (value) {
        if (value && value === 'add') {
          this.getDatas()
        }
        this.showImport = false
        this.showAddDetails = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #EncourageObjectName{
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
            margin-right: 10px;
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
    #EncourageObjectName{
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
