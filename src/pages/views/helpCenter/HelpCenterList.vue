<template>
  <div id="HelpCenterList">
    <!-- 问题列表 -->
    <div id="ListPage" v-if="show === 1">
      <div class="title">
        <h2>帮助中心</h2>
      </div>
      <div class="search">
        <el-input class="searchInput" placeholder="搜索标题" v-model="searchValue">
          <el-button @click="search" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="questionList">
        <div class="category">
          <h3>常见问题：</h3>
          <div class="list clearfix">
            <span v-for="item in commonQuestions" @click="lookAnswer(item)">{{ item.name }}</span>
          </div>
        </div>
        <div class="category">
          <h3>功能问题：</h3>
          <div class="list clearfix">
            <span v-for="item in functionQuestions" @click="lookAnswer(item)">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div id="SearchPage" v-if="show === 2">
      <button class="btn" @click="goBack()">返回</button>
      <div class="search">
        <el-input class="searchInput" placeholder="搜索标题" v-model="searchValue">
          <el-button @click="search" slot="append" class="searchIcon" icon="iconfont icon-sousuo"></el-button>
        </el-input>
      </div>
      <div class="searchResult">
        <p>共查询到<span>{{ resultNumber }}</span>篇文章</p>
        <ul>
          <li v-for="item in searchResult" @click="lookAnswer(item)">{{ item.name }}</li>
        </ul>
      </div>
    </div>

    <!-- 问题详情 -->
    <div id="Answer" v-if="show === 3">
      <button class="btn"  @click="goBack()">返回</button>
      <div class="details">
        <p>{{ question }}</p>
        <div v-html="answer"></div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: 1,
        searchValue: '',
        commonQuestions: [],
        functionQuestions: [],
        searchResult: [],
        resultNumber: 0,
        question: '',
        answer: ''
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取问题列表数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/question/findByType'
        }).then((result) => {
          if (result.data.code === 0) {
            this.commonQuestions = result.data.commonQuestions
            this.functionQuestions = result.data.functionQuestions
          }
        })
      },
      // 查看答案详情
      lookAnswer (item) {
        this.axios({
          method: 'GET',
          url: '/keygood/web/question/findOne',
          params: {
            questionId: item.questionId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.question = result.data.question.name
            this.answer = result.data.question.content
            this.show = 3
          }
        })
      },
      // 搜索问题
      search () {
        this.show = 2
        this.axios({
          method: 'GET',
          url: '/keygood/web/question/findBylike',
          params: {
            keyword: this.searchValue
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.searchResult = result.data.page.list
            this.resultNumber = result.data.page.totalCount
          }
        })
      },
      goBack () {
        this.show = 1
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  /* 问题列表 */
  #ListPage{
    .title{
      text-align: center;
      margin-top: 60px;
      h2{
        font-size: 24px;
        color: #007BFF;
        font-weight: 400;
      }
    }
    .search{
      width: 510px;
      height: 50px;
      margin: 25px auto 0;
    }
    .questionList{
      margin-top: 60px;
      border-top: 1px solid #EFF3F8;
      padding: 20px 0;
      .category{
        margin-bottom: 50px;
        h3{
          font-size: 18px;
          color: #333;
          font-weight: 400;
        }
        .list{
          span{
            width: 300px;
            height: 58px;
            border: 1px solid #EFF3F8;
            display: inline-block;
            margin: 20px;
            padding: 3px 10px;
            float: left;
            overflow: hidden;
            cursor: pointer;
          }
        }
      }
    }
  }

  /* 搜索结果 */
  #SearchPage{
    .btn{
      width: 105px;
      height: 38px;
      background: #62AEFF;
      margin-top: 25px;
      color: #fff;
      border-radius: 4px;
      font-size: 16px;
    }
    .search{
      width: 510px;
      height: 50px;
      margin: 50px auto 0;
    }
    .searchResult{
      margin-top: 50px;
      border-top: 1px solid #EFF3F8;
      color: #333;
      padding: 20px 0;
      p{
        span{
          margin: 0 10px;
          color: #62aeff;
        }
      }
      ul li{
        font-size: 16px;
        margin-top: 15px;
        list-style-type: disc;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }

  /* 答案详情 */
  #Answer{
    .btn{
      width: 105px;
      height: 38px;
      background: #62AEFF;
      margin-top: 25px;
      color: #fff;
      border-radius: 4px;
      font-size: 16px;
    }
    .details{
      margin-top: 17px;
      border: 1px solid #EFF3F8;
      box-shadow: 0 0 5px rgba(51,51,51,0.25);
      padding: 30px;
      p{
        line-height: 50px;
        color: #333;
        font-size: 18px;
        text-align: center;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      >div{
        margin-top: 25px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
  }

  @media screen and (max-width: 1366px){
    /* 问题列表 */
    #ListPage{
      .title{
        margin-top: 30px;
        h2{
          font-size: 20px;
        }
      }
      .search{
        width: 410px;
        height: 35px;
        margin: 20px auto 0;
      }
      .questionList{
        margin-top: 30px;
        padding: 20px 0;
        .category{
          margin-bottom: 20px;
          h3{
            font-size: 16px;
          }
          .list{
            span{
              width: 250px;
              font-size: 14px;
            }
          }
        }
      }
    }

    /* 搜索结果 */
    #SearchPage{
      .btn{
        width: 75px;
        height: 30px;
        margin-top: 20px;
        font-size: 14px;
      }
      .search{
        width: 410px;
        height: 35px;
        margin: 30px auto 0;
      }
      .searchResult{
        margin-top: 20px;
        ul li{
          font-size: 14px;
        }
      }
    }

    /* 答案详情 */
    #Answer{
      .btn{
        width: 75px;
        height: 30px;
        margin-top: 20px;
        font-size: 14px;
      }
      .details{
        margin-top: 15px;
        box-shadow: 0 0 2px rgba(51,51,51,0.25);
        padding: 20px;
        p{
          font-size: 16px;
        }
        >div{
          margin-top: 20px;
          font-size: 14px;
        }
      }
    }
  }
</style>
