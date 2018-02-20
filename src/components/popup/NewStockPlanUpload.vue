<template>
  <div id="NewStockPlanUpload">
    <div class="wrapper">
      <div class="title">上传文档<i class="iconfont icon-icons64x6403"  @click="close"></i></div>
      <div class="con">
        <div>
          <div>
            <span>股权激励计划名称</span>
            <p>
              <input v-if="this.info" type="text" v-model="this.info.planName" readonly>
              <select v-if="!this.info" v-model="stimulateId">
                <option v-for="item in selectDatas" :value="item.stimulateId">{{ item.planName }}</option>
              </select>
            </p>
          </div>
          <div>
            <span>计划文档</span>
            <p>
              <el-radio v-model="file1.type" label="1">董事会决议</el-radio>
              <el-radio v-model="file1.type" label="2">执行董事决定</el-radio>
              <el-upload
                class="uploadFlie"
                action="/keygood/web/oss/upload?fileType=1"
                :headers=uploadHeader
                :show-file-list="false"
                :on-success="handleSuccess1">
                <el-button size="mini">{{ file1.btnText }}</el-button>
              </el-upload>
            </p>
          </div>
          <div>
            <span></span>
            <p>
              <el-radio v-model="file2.type" label="3">股东会决议</el-radio>
              <el-radio v-model="file2.type" label="4">股东大会决议</el-radio>
              <el-upload
                class="uploadFlie"
                action="/keygood/web/oss/upload?fileType=1"
                :headers=uploadHeader
                :show-file-list="false"
                :on-success="handleSuccess2">
                <el-button size="mini">{{ file2.btnText }}</el-button>
              </el-upload>
            </p>
          </div>
          <div>
            <span></span>
            <p>
              <el-radio v-model="file3.type" label="5">股权激励计划</el-radio>
              <el-upload
                class="uploadFlie"
                action="/keygood/web/oss/upload?fileType=1"
                :headers=uploadHeader
                :show-file-list="false"
                :on-success="handleSuccess3">
                <el-button size="mini">{{ file3.btnText }}</el-button>
              </el-upload>
            </p>
          </div>
        </div>
        <div class="btn">
          <button @click="confirm()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        stimulateId: this.info.stimulateId || '',
        file1: {
          type: '1',
          name: '',
          path: '',
          btnText: '上传文件'
        },
        file2: {
          type: '3',
          name: '',
          path: '',
          btnText: '上传文件'
        },
        file3: {
          type: '5',
          name: '',
          path: '',
          btnText: '上传文件'
        },
        uploadHeader: {
          token: sessionStorage.getItem('token')
        },
        selectDatas: []
      }
    },
    props: ['info'],
    mounted () {
      if (!this.info) {
        this.getPlanName()
      }
    },
    methods: {
      // 获取下拉筛选的所属计划
      getPlanName () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/stimulate/findBySelect',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
            status: 1
          }
        }).then((result) => {
          this.selectDatas = result.data.stimulates
        })
      },
      // 文件上传回显
      handleSuccess1 (response) {
        this.file1.name = response.fileName
        this.file1.path = response.filePath
        this.file1.btnText = '上传完成'
      },
      handleSuccess2 (response) {
        this.file2.name = response.fileName
        this.file2.path = response.filePath
        this.file2.btnText = '上传完成'
      },
      handleSuccess3 (response) {
        this.file3.name = response.fileName
        this.file3.path = response.filePath
        this.file3.btnText = '上传完成'
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 确认上传文件
      confirm () {
        if (!this.stimulateId) {
          this.$message.warning('请选择激励计划！')
        } else if (!this.file1.name || !this.file2.name || !this.file3.name) {
          this.$message.warning('请上传完文件！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/stimulatedocument/addOne',
            data: this.toFormData({
              stimulateId: this.stimulateId,
              types: [this.file1.type, this.file2.type, this.file3.type],
              names: [this.file1.name, this.file2.name, this.file3.name],
              paths: [this.file1.path, this.file2.path, this.file3.path]
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$emit('isShow', 'updateNewStockPlanUpload')
              this.$message.success('完成激励计划创建！')
            }
          })
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewStockPlanUpload{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 420px;
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
        position: relative;
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0 40px;
        >div{
          >div{
            margin-top: 30px;
            color: #333;
            span{
              width: 130px;
              line-height: 40px;
              display: inline-block;
            }
            p{
              display: inline-block;
              margin-left: 20px;
              select{
                width: 250px;
                height: 35px;
                border: 1px solid #c5c5c5;
                padding: 0 1%;
                option{
                  line-height: 30px;
                }
              }
              .uploadFlie{
                display: inline-block;
                margin-left: 25px;
              }
            }
          }
        }
        .btn{
          text-align: center;
          margin-top: 40px;
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

  @media screen and (max-width: 1600px){
    #NewStockPlanUpload{
      .wrapper{
        width: 550px;
        height: 330px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0 30px;
          >div{
            >div{
              margin-top: 20px;
              font-size: 14px;
              span{
                width: 115px;
                line-height: 30px;
              }
              p{
                display: inline-block;
                margin-left: 20px;
                select{
                  width: 250px;
                  height: 35px;
                  border: 1px solid #c5c5c5;
                  padding: 0 1%;
                }
                .el-radio+.el-radio{
                  margin-left: 20px;
                }
                .uploadFlie{
                  display: inline-block;
                  margin-left: 25px;
                }
              }
            }
          }
          .btn{
            margin-top: 30px;
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
