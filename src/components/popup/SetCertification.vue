<template>
  <div id="SetCertification">
    <div class="wrapper">
      <div class="title">实名认证<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <div>
          <label>真实姓名</label>
          <div>
            <input type="text" v-model="realName" placeholder="请输入您真实姓名">
          </div>
        </div>
        <div>
          <label>证件号</label>
          <div>
            <select v-model="papersType">
              <option value="1">身份证</option>
              <option value="2">护照</option>
              <option value="3">台胞证</option>
              <option value="4">回乡证</option>
            </select>
            <input type="text" v-model="papersNum" placeholder="证件号码">
          </div>
        </div>
        <div>
          <label>证件正反面</label>
          <div>
            <el-upload
              class="avatarUploader"
              action="/keygood/web/oss/upload?fileType=1"
              :headers=header
              accept="image/gif,image/jpeg,image/jpg,image/png"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl_1" :src="imageUrl_1" class="avatar">
              <i v-else class="el-icon-plus avatarUploaderIcon"></i>
            </el-upload>
            <p>注意：<br/>证件全部信息清晰无遮挡</p>
          </div>
        </div>
        <div>
          <label></label>
          <div>
            <el-upload
              class="avatarUploader"
              action="/keygood/web/oss/upload?fileType=1"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              :headers=header
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl_2" :src="imageUrl_2" class="avatar">
              <i v-else class="el-icon-plus avatarUploaderIcon"></i>
            </el-upload>
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
        realName: '',
        papersType: 1,
        papersNum: '',
        imageUrl_1: '',
        imageUrl_2: '',
        header: {
          token: sessionStorage.getItem('token')
        }
      }
    },
    methods: {
      // 上传成功的回显方法
      handleAvatarSuccess1 (res, file) {
        this.imageUrl_1 = URL.createObjectURL(file.raw)
        this.imageUrl_1 = res.filePath
      },
      handleAvatarSuccess2 (res, file) {
        this.imageUrl_2 = URL.createObjectURL(file.raw)
        this.imageUrl_2 = res.filePath
      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 5
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
        return isLt2M
      },
      // 关闭弹窗
      close () {
        this.$emit('isShow', false)
      },
      // 确认认证
      submit () {
        if (!this.realName || !this.papersNum || !this.imageUrl_1 || !this.imageUrl_2) {
          this.$message.warning('请完善信息！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/companyuser/realnameauth',
            data: this.toFormData({
              companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
              realName: this.realName,
              papersType: this.papersType,
              papersNum: this.papersNum,
              frontPicture: this.imageUrl_1,
              versoPicture: this.imageUrl_2
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$message.success('认证中，请耐心等待！')
              this.$emit('isShow', 'update')
            }
          })
        }
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
      height: 550px;
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
          width: 400px;
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
              width: 100px;
              display: block;
              border: 1px solid #c5c5c5;
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
              text-indent: 15px;
              display: block;
            }
            .avatarUploader{
              width: 160px;
              height: 120px;
              border: 1px solid #c5c5c5;
              margin: 0;
              .avatarUploaderIcon {
                font-size: 28px;
                color: #8c939d;
                width: 160px;
                height: 120px;
                line-height: 120px;
                text-align: center;
              }
              .avatar {
                width: 160px;
                height: 120px;
                display: block;
              }
            }
            p{
              font-size: 12px;
              margin-left: 10px;
              color: #999;
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

  @media screen and (max-width: 1366px) {
    #SetCertification{
      .wrapper{
        width: 500px;
        height: 480px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 22px;
          }
        }
        .con{
          margin-top: 25px;
          div{
            width: 400px;
            margin: 0 auto 15px;
            font-size: 14px;
            label{
              width: 120px;
              line-height: 37px;
            }
            >div{
              margin-left: 20px;
              select{
                width: 100px;
              }
              input{
                width: 100%;
                height: 35px;
                text-indent: 10px;
              }
              .avatarUploader{
                width: 150px;
                height: 100px;
                .avatarUploaderIcon {
                  width: 150px;
                  height: 100px;
                  line-height: 100px;
                }
                .avatar {
                  width: 150px;
                  height: 100px;
                }
              }
            }
          }
          .btn{
            margin-top: 25px;
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
