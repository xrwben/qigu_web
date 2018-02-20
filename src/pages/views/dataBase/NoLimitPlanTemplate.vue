<template>
  <div id="NolimitPlanTemplate">
    <!-- 导航栏 -->
    <div class="nav">
      <button @click="selectClick()" :class="{btn: true, isActive: active}">筛选<i class="iconfont icon-102fangxiang_xiangxia"></i></button>
      <div class="dropDown" v-show="showDropDown">
        <p>解限计划类型</p>
        <p>
          <input type="radio" id="type1" v-model="form.type" value="1"><label for="type1">按时间</label>
        </p>
        <p>
          <input type="radio" id="type2" v-model="form.type" value="2"><label for="type2">按业绩考核</label>
        </p>
        <div class="btns">
          <button @click="cancel()">取消</button>
          <button @click="confirm()">确定</button>
        </div>
      </div>
      <div class="search">
        <el-input class="searchInput" placeholder="请输入名称" v-model="form.searchValue">
          <el-button @click="search()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="rightBtn">
        <button @click="showAddEdit()"><i class="iconfont icon-iconfont7"></i>新建解限计划</button>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>名称</th>
          <th>解限计划类型</th>
          <th>成熟计划</th>
          <th>绩效考核率(大于等于%)</th>
          <!--<th>操作</th>-->
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableDatas">
            <td>{{ item.unfreezeName }}</td>
            <td>{{ item.type | noLimitType }}</td>
            <td>{{ item.lockLong }}{{ item.lockUnit | timeUnit }}</td>
            <td>{{ item.yield }}</td>
            <!--<td>-->
              <!--<a href="javascript:void(0)" @click="">删除</a>-->
            <!--</td>-->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 新建解限计划 -->
    <new-no-limit-plan v-if="showAdd" v-on:isShow="closePopup"></new-no-limit-plan>
  </div>
</template>

<script>
  import NewNoLimitPlan from '../../../components/popup/NewNoLimitPlan.vue'
  export default {
    data () {
      return {
        form: {
          type: null,
          searchValue: ''
        },
        tableDatas: [],
        active: false, // 是否加class
        showDropDown: false, // 是否显示下拉框
        showAdd: false // 是否显示新增弹窗
      }
    },
    components: {
      NewNoLimitPlan
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
        this.form.type = null
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
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/unfreeze/findByLike',
          params: {
            type: this.form.type,
            keyword: this.form.searchValue,
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          this.tableDatas = result.data.page.list
        })
      },
      // 搜索
      search () {
        this.getDatas()
      },
      // 显示新建弹窗
      showAddEdit () {
        this.showAdd = true
      },
      // 关闭弹窗
      closePopup (value) {
        if (value && value === 'add') {
          this.getDatas()
        }
        this.showAdd = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NolimitPlanTemplate{
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
    #NolimitPlanTemplate{
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
