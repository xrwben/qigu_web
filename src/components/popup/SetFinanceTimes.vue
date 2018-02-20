<template>
  <div id="SetFinanceTimes">
    <div class="wrapper">
      <div class="title">更新轮次<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <label>融资轮次</label>
          <el-select v-model="financeTimes">
            <el-option label="尚未获投" value="尚未获投"></el-option>
            <el-option label="天使轮" value="天使轮"></el-option>
            <el-option label="A轮" value="A轮"></el-option>
            <el-option label="B轮" value="B轮"></el-option>
            <el-option label="C轮" value="C轮"></el-option>
            <el-option label="D轮" value="D轮"></el-option>
            <el-option label="上市" value="上市"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </p>
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
        financeTimes: ''
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!this.financeTimes) {
          this.$message.warning('请选择公司轮次！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/company/editFinancing',
            data: this.toFormData({
              financing: this.financeTimes,
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
              ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('信息修改成功！')
              this.$emit('isShow', 'update')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetFinanceTimes{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 230px;
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
        padding: 0px 50px;
        margin-top: 35px;
        >p{
          width: 100%;
          color: #666;
          line-height: 42px;
          text-align: center;
          label{
            color: #333;
            margin-right: 20px;
          }
        }
        .btn{
          position: absolute;
          left: 50%;
          bottom: 15px;
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
    #SetFinanceTimes{
      .wrapper{
        width: 500px;
        height: 200px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0px 30px;
          margin-top: 20px;
          >p{
            line-height: 35px;
          }
          .btn{
            button{
              width: 86px;
              height: 35px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
