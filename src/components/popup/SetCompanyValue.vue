<template>
  <div id="SetCompanyValue">
    <div class="wrapper">
      <div class="title">更新估值<i class="iconfont icon-icons64x6403" @click="close()"></i></div>
      <div class="con">
        <p>
          <label>公司估值</label>
          <input type="text" maxlength="15" v-model="appraisement"> &emsp;元/人民币
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
        appraisement: ''
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!/^\d+$/.test(this.appraisement)) {
          this.$message.warning('输入格式有误！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/company/editAppraisement',
            data: this.toFormData({
              appraisement: this.appraisement,
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
  #SetCompanyValue{
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
          input{
            width: 320px;
            height: 40px;
            border: 1px solid #c5c5c5;
            text-indent: 10px;
            color: #999;
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
    #SetCompanyValue{
      .wrapper{
        width: 500px;
        height: 180px;
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
            font-size: 14px;
            input{
              width: 220px;
              height: 35px;
            }
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
