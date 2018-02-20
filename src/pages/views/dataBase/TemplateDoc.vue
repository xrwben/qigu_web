<template>
  <div id="TemplateDoc">
    <!-- 导航栏 -->
    <div class="nav">
      <div class="search">
        <el-input class="searchInput" placeholder="请输入文档" v-model="form.searchValue">
          <el-button @click="search()" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
    </div>

    <!-- 列表 -->
    <div class="list">
      <table>
        <thead>
        <tr>
          <th>使用场景</th>
          <th width="450">文档</th>
          <th>更新日期</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableDatas">
          <td>{{ item.useScene | sceneType }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.createTime | dateFormat }}</td>
          <td>
            <!--<a href="javascript:void(0)" @click="downLoad(item)">下载</a>-->
            <a href="#" class="downLoadUrl" @click="downLoad($event, item)">下载</a>
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
          searchValue: ''
        },
        currentPage: 1,
        pageSize: 10,
        totalSize: 0,
        tableDatas: [],
        downLoadUrl: ''
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/modle/findByLike',
          params: {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            keyword: this.form.searchValue
          }
        }).then((result) => {
          this.tableDatas = result.data.page.list
          this.totalSize = result.data.page.totalCount
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
      // 下载文件
      downLoad (ev, info) {
        if (info.path.indexOf('html') < 0) {
          ev.target.setAttribute('href', `/keygood/web/modle/downloadOther?path=${info.path}&fileName=${info.name}`)
        } else {
          ev.target.setAttribute('href', `/keygood/web/modle/download?path=${info.path}&fileName=${info.name}&companyName=${JSON.parse(sessionStorage.getItem('company')).companyName}`)
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #TemplateDoc{
    padding-bottom: 20px;
    .nav{
      height: 100%;
      .search{
        width: 300px;
        height: 35px;
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
    #TemplateDoc{
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
