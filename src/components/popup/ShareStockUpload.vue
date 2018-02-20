<template>
  <div id="ShareStockUpload">
    <div class="wrapper">
      <div class="title">上传授予协议<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <label>授予协议</label>
          <el-upload
            class="uploadFlie"
            action="/keygood/web/oss/upload?fileType=1"
            :headers=uploadHeader
            :show-file-list="false"
            :on-success="handleSuccess">
            <el-button>{{ file.btnText }}</el-button>
          </el-upload>
        </p>
        <span><i>*注意：</i> 如果上传多个文件，请先打成压缩包再上传！</span>
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
        file: {
          fileName: '',
          filePath: '',
          btnText: '上传文件'
        },
        bonusSharesIds: sessionStorage.getItem('bonusSharesId') || this.bonusSharesId,
        uploadHeader: {
          token: sessionStorage.getItem('token')
        }
      }
    },
    props: ['bonusSharesId'],
    methods: {
      close () {
        this.$emit('isShow', 'closeUploadDetails')
      },
      submit () {
        if (!this.file.fileName || !this.file.filePath) {
          this.$message.warning('请等待文件上传完成！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/bonusshares/uploadAwardedAgreement',
            data: this.toFormData({
              bonusSharesId: this.bonusSharesIds,
              fileName: this.file.fileName,
              awardedAgreement: this.file.filePath
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('上传完成！')
              this.$emit('isShow', 'closeUpload')
            }
          })
        }
      },
      // 文件上传回显
      handleSuccess (response) {
        this.file.fileName = response.fileName
        this.file.filePath = response.filePath
        this.file.btnText = '上传完成'
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ShareStockUpload{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 250px;
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
        margin-top: 40px;
        padding: 0 35px;
        text-align: center;
        p{
          line-height: 40px;
          text-align: center;
          margin-bottom: 10px;
          label{
            color: #666;
          }
          .uploadFlie{
            display: inline-block;
            margin-left: 20px;
            span{
              color: #62aeff;
            }
          }
        }
        >span{
          color: #999;
          font-size: 14px;
          i{
            color: red;
          }
        }
        .btn{
          margin-top: 40px;
          text-align: center;
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

  @media screen and (max-width: 1366px){
    #ShareStockUpload{
      .wrapper{
        width: 500px;
        height: 250px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 30px;
          .btn{
            margin-top: 40px;
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
