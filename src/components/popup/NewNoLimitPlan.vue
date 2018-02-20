<template>
  <div id="NewNoLimitPlan">
    <div :class="{wrapper: true, passPercentStyle: passPercent}">
      <div class="title">新建解限计划<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <span>解限计划的名称：</span>
          <input type="text" v-model="form.unfreezeName" placeholder="请输入名称">
        </p>
        <p>
          <span>解限计划的类型：</span>
          <el-radio class="ridioType" v-model="form.type" label="1">按时间解限</el-radio>
          <el-radio v-model="form.type" label="2">按业绩指标解限</el-radio>
        </p>
        <div class="items">
          <p>
            <span>解限计划：</span>
            <input type="text" v-model="form.lockLong">
            <select v-model="form.lockUnit">
              <option value="1">年</option>
              <option value="2">月</option>
              <option value="3">日</option>
            </select>
          </p>
          <p v-if="passPercent">
            <span>绩效考核合格率：</span>
            <input type="text" v-model="form.yield"> (大于等于)%
          </p>
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
        form: {
          unfreezeName: '',
          type: '1',
          lockLong: '',
          lockUnit: 1,
          yield: ''
        },
        passPercent: false // 是否显示考核指标
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      submit () {
        if (!this.form.unfreezeName || !this.form.lockLong || !this.form.lockUnit) {
          this.$message.warning('请完善信息！')
        } else if (this.form.type === '2' && !this.form.yield) {
          this.$message.warning('请完善信息！')
        } else if (isNaN(this.form.lockLong)) {
          this.$message.warning('解限时长必须为数字！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/unfreeze/addOne',
            data: this.toFormData({
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              unfreezeName: this.form.unfreezeName,
              type: this.form.type,
              lockLong: this.form.lockLong,
              lockUnit: this.form.lockUnit,
              yield: this.form.yield
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$emit('isShow', 'add')
            }
          })
        }
      }
    },
    watch: {
      'form.type': {
        handler (value) {
          if (value === '2') {
            this.passPercent = true
          } else {
            this.passPercent = false
            this.form.yield = ''
          }
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewNoLimitPlan{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 350px;
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
          span{
            width: 150px;
            line-height: 32px;
            display: inline-block;
            color: #333;
            text-align: right;
            margin-right: 20px;
          }
          input{
            width: 300px;
            height: 30px;
            border: 1px solid #c5c5c5;
            text-indent: 10px;
          }
          .ridioType{
            margin-right: 45px;
          }
        }
        .items{
          border-top: 1px solid #c5c5c5;
          color: #666;
          padding-top: 20px;
          >p{
            margin-bottom: 20px;
            input{
              width: 140px;
              height: 30px;
              border: 1px solid #c5c5c5;
            }
            select{
              width: 70px;
              height: 32px;
              padding: 0 1%;
              border: 1px solid #c5c5c5;
              transform: translateY(1px);
            }
          }
        }
        .btn{
          position: absolute;
          left: 50%;
          bottom: 20px;
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
    .wrapper.passPercentStyle{
      height: 400px;
    }
  }

  @media screen and (max-width: 1366px) {
    #NewNoLimitPlan{
      .wrapper{
        width: 500px;
        height: 300px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          font-size: 14px;
          p{
            span{
              width: 140px;
              margin-right: 10px;
            }
            input{
              width: 250px;
            }
            .ridioType{
              margin-right: 0px;
            }
          }
          .items{
            border-top: 1px solid #c5c5c5;
            >p{
              input{
                width: 100px;
              }
              select{
                width: 60px;
              }
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
      .wrapper.passPercentStyle{
        height: 360px;
      }
    }
  }
</style>
