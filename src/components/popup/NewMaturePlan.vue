<template>
  <div id="NewMaturePlan">
    <div class="wrapper">
      <div class="title">新建成熟计划<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p><label>成熟计划的名称：</label><input type="text" v-model="matureName" placeholder="请输入名称"></p>
        <p>
          <span>成熟周期：每年一次</span>
          <label>计划长度：</label>
          <input type="type" v-model="matureLong" @keyup="caculationNumber"> 年
        </p>
        <div class="items">
          <div v-if="matureLong" v-for="(item, index) in matureLong">
            <i>{{ index + 1 }}.</i>
            <span>绩效考核合格率(大于等于)：</span>
            <input type="text" v-model="yields[index]"> %
            <span>年度最大可认购股数百分比：</span>
            <input type="text" v-model="subrates[index]"> %
          </div>
        </div>
        <div class="btn">
          <button @click="submit()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        matureName: '',
        matureLong: 1,
        yields: [],
        subrates: []
      }
    },
    mounted () {
      this.caculationNumber()
    },
    methods: {
      // 键盘弹起
      caculationNumber () {
        this.matureLong = parseInt(this.matureLong)
//        if (/\d{1,2}/.test(parseInt(this.matureLong))) {
//          console.log('格式正确')
//          this.matureLong = parseInt(this.matureLong)
//        } else {
//          console.log('cuowu')
//        }
      },
      close () {
        this.$emit('isShow', false)
      },
      // 新建成熟计划
      submit () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/mature/addOne',
          data: this.toFormData({
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
            matureName: this.matureName,
            matureLong: this.matureLong,
            yields: this.yields,
            subrates: this.subrates
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$emit('isShow', 'add')
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewMaturePlan{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 750px;
      height: 470px;
      background: #fff;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #62AEFF;
        text-align: center;
        color: #fff;
        font-size: 24px;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0px 30px;
        margin-top: 20px;
        p{
          color: #666;
          margin-bottom: 20px;
          label,span{
            line-height: 32px;
            display: inline-block;
            color: #333;
          }
          span{
            margin-right: 100px;
          }
          input{
            width: 300px;
            height: 30px;
            border: 1px solid #c5c5c5;
            text-indent: 10px;
            margin-left: 20px;
          }
        }
        p:nth-child(2){
          input{
            width: 120px;
            text-align: center;
            text-indent: 0;
            outline: none;
          }
        }
        .items{
          border-top: 1px solid #c5c5c5;
          color: #666;
          padding-top: 10px;
          max-height: 210px;
          overflow-y: auto;
          >div{
            margin-bottom: 10px;
            span:last-of-type{
              margin-left: 60px;
            }
            input{
              width: 50px;
              height: 30px;
              border: 1px solid #c5c5c5;
              padding: 0 10px;
            }
          }
        }
        .btn{
          position: absolute;
          left: 50%;
          bottom: 10px;
          margin-top: 10px;
          text-align: center;
          transform: translateX(-50%);
          button{
            width: 106px;
            height: 38px;
            border: 1px solid #E3E3E3;
            border-radius: 4px;
            margin: 0 15px;
            background: #fff;
            color: #666;
            font-size: 16px;
          }
          button:last-of-type{
            background: #62AEFF;
            color: #fff;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px) {
    #NewMaturePlan {
      .wrapper {
        width: 650px;
        height: 420px;
        .title {
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i {
            font-size: 22px;
          }
        }
        .con {
          padding: 0px 25px;
          margin-top: 20px;
          font-size: 14px;
          p {
            margin-bottom: 10px;
            input {
              margin-left: 10px;
            }
          }
          .items {
            max-height: 200px;
            > div {
              margin-bottom: 10px;
              span:last-of-type {
                margin-left: 30px;
              }
              input {
                width: 40px;
                height: 25px;
              }
            }
          }
          .btn {
            button {
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  /*!* 设置滚动条的样式 *!*/
  /*::-webkit-scrollbar {*/
    /*width:5px;*/
  /*}*/
  /*!* 滚动槽 *!*/
  /*::-webkit-scrollbar-track {*/
    /*background:rgba(0,0,0,0.1);*/
    /*border-radius:10px;*/
  /*}*/
  /*!* 滚动条滑块 *!*/
  /*::-webkit-scrollbar-thumb {*/
    /*background:rgba(0,0,0,0.2);*/
  /*}*/
</style>
