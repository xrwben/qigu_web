<template>
  <div id="SetCertification">
    <div class="wrapper">
      <div class="title">企业认证</div>
      <div class="con">
        <div>
          <label>企业全称</label>
          <div>
            <input type="text" v-model="companyName">
          </div>
        </div>
        <div>
          <label>企业简称</label>
          <div>
            <input type="text" v-model="companyAbbreviation">
          </div>
        </div>
        <div>
          <label>企业类型</label>
          <div>
            <select v-model="type">
              <option value="1">有限责任公司</option>
              <option value="2">股份有限公司</option>
            </select>
          </div>
        </div>
        <div>
          <label>资本币种</label>
          <div>
            <select v-model="currency">
              <option value="人民币">人民币</option>
            </select>
          </div>
        </div>
        <div>
          <label>营业执照</label>
          <div>
            <el-upload
              class="avatarUploader"
              action="/keygood/web/oss/upload?fileType=1"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              :headers=uploadHeader
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl_1" :src="imageUrl_1" class="avatar">
              <i v-else class="el-icon-plus avatarUploaderIcon"></i>
            </el-upload>
            <p>
              <span>上传营业执照扫描件</span>
              <span>1.仅支持JPG,PNG格式<br>
                2.文件不超过5M<br>
                3.请用营业执照原件扫描
              </span>
            </p>
          </div>
        </div>
        <div class="btn">
          <button @click="submit()">认证</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
        companyAbbreviation: '',
        type: 1,
        currency: '人民币',
        imageUrl_1: '',
        uploadHeader: {
          token: sessionStorage.getItem('token')
        }
      }
    },
    methods: {
      submit () {
        if (!this.companyName || !this.companyAbbreviation || !this.imageUrl_1) {
          this.$message.warning('请填写完整信息！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/company/companyAuth',
            data: this.toFormData({
              companyId: JSON.parse(sessionStorage.getItem('company')).companyId,
              companyName: this.companyName,
              companyAbbreviation: this.companyAbbreviation,
              type: this.type,
              currency: this.currency,
              license: this.imageUrl_1
            })
          }).then(result => {
            if (result.data.code === 0) {
              this.$emit('isShow', false)
              this.$router.go(0)
            }
          })
        }
      },
      // 上传成功的回显方法
      handleAvatarSuccess (res, file) {
        this.imageUrl_1 = URL.createObjectURL(file.raw)
        this.imageUrl_1 = res.filePath
      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.warning('上传图片大小不能超过 5MB!')
        }
        return isLt2M
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SetCertification{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 565px;
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
        margin-top: 25px;
        div{
          width: 450px;
          margin: 0 auto 15px;
          display: flex;
          label{
            width: 120px;
            line-height: 42px;
            color: #333;
            text-align: right;
          }
          >div{
            margin-left: 28px;
            margin-bottom: 0px;
            -webkit-box-flex: 1.0;
            -moz-box-flex: 1.0;
            select{
              width: 207px;
              display: block;
              border: 1px solid #c5c5c5;
              border-radius: 4px;
              margin-right: 5px;
              color: #666;
              padding: 0 1%;
              option{
                text-align: center;
              }
            }
            input{
              width: 100%;
              height: 40px;
              border: 1px solid #c5c5c5;
              border-radius: 4px;
              text-indent: 15px;
              display: block;
            }
            .avatarUploader{
              width: 175px;
              height: 175px;
              border: 1px solid #c5c5c5;
              margin: 0;
              .avatarUploaderIcon {
                font-size: 28px;
                color: #8c939d;
                width: 175px;
                height: 175px;
                line-height: 175px;
                text-align: center;
              }
              .avatar {
                width: 175px;
                height: 175px;
                display: block;
              }
            }
            p{
              margin-left: 10px;
              margin-top: 20px;
              color: #999;
              font-size: 14px;
              span:first-of-type{
                font-size: 16px;
                color: #5090D3;
                display: block;
                margin-bottom: 10px;
              }
            }
          }
        }
        .btn{
          margin-top: 25px;
          text-align: center;
          button{
            width: 106px;
            height: 38px;
            border: 1px solid #E3E3E3;
            border-radius: 4px;
            background: #62AEFF;
            color: #fff;
            font-size: 16px;
            margin: 0 auto;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px){
    #SetCertification{
      .wrapper{
        width: 500px;
        height: 475px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 20px;
          div{
            width: 380px;
            margin: 0 auto 10px;
            label{
              width: 120px;
              line-height: 37px;
              font-size: 14px;
            }
            >div{
              margin-left: 20px;
              select{
                width: 170px;
              }
              input{
                height: 35px;
                text-indent: 10px;
              }
              .avatarUploader{
                width: 150px;
                height: 150px;
                .avatarUploaderIcon {
                  width: 150px;
                  height: 150px;
                  line-height: 155px;
                }
                .avatar {
                  width: 150px;
                  height: 150px;
                }
              }
              p{
                margin-top: 5px;
                font-size: 12px;
                span:first-of-type{
                  font-size: 14px;
                }
              }
            }
          }
          .btn{
            margin-top: 20px;
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
