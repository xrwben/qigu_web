<template>
  <div id="AddStockHoldPlatform">
    <div :class="{wrapper: true, limitedCompany: showRegisteredCapital}">
      <div class="title">添加持股平台<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>
          <span>持股平台类型</span>
          <el-radio class="radioInput" v-model.trim="platform.playformType" label="1">合伙企业</el-radio>
          <el-radio v-model.trim="platform.playformType" label="2">有限公司</el-radio>
        </p>
        <p><span>企业名称</span><input type="text" v-model.trim="platform.name"></p>
        <p v-show="showRegisteredCapital"><span>注册资本</span><input type="text" v-model.trim="platform.registeredAssets"> 元</p>
        <p><span>持股公司股权</span><input type="text" v-model.trim="platform.stockOption"> %</p>
        <p><span>股东上限</span><input type="text" v-model.trim="platform.shareholderLimit"></p>
        <p><span>营业执照号码</span><input type="text" v-model.trim="platform.licenseNum"></p>
        <div class="authority">
          <span>营业执照</span>
          <div class="pic">
            <el-upload
              class="avatarUploader"
              action="/keygood/web/oss/upload?fileType=1"
              accept="image/gif,image/jpeg,image/jpg,image/png"
              :headers=uploadHeader
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="platform.imageUrl" :src="platform.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatarUploaderIcon"></i>
            </el-upload>
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
        showRegisteredCapital: false,
        platform: {
          playformType: '1',
          name: '',
          registeredAssets: '',
          stockOption: '',
          shareholderLimit: '',
          licenseNum: '',
          imageUrl: ''
        },
        uploadHeader: {
          token: sessionStorage.getItem('token')
        }
      }
    },
    methods: {
      // 上传成功的回显方法
      handleAvatarSuccess (res, file) {
        this.platform.imageUrl = URL.createObjectURL(file.raw)
        this.platform.imageUrl = res.filePath
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
      // 添加持股平台数据
      submit () {
        if (!this.platform.name || !this.platform.stockOption || !this.platform.shareholderLimit || !this.platform.licenseNum || !this.platform.imageUrl) {
          this.$message.warning('请完善信息！')
        } else if (this.platform.playformType === '2' && !this.platform.registeredAssets) {
          this.$message.warning('请完善信息！')
        } else {
          this.axios({
            method: 'POST',
            url: '/keygood/web/platform/addOne',
            data: this.toFormData({
              companyId: JSON.parse(sessionStorage.getItem('companyUser')).companyId,
              playformType: this.platform.playformType,
              name: this.platform.name,
              registeredAssets: this.platform.registeredAssets,
              stockOption: this.platform.stockOption,
              shareholderLimit: this.platform.shareholderLimit,
              licenseNum: this.platform.licenseNum,
              license: this.platform.imageUrl,
              companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
              ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
            })
          }).then((result) => {
            if (result.data.code === 0) {
              this.$emit('isShow', 'add')
            }
          })
        }
      }
    },
    // 判断是否切换
    watch: {
      'platform.playformType': {
        handler (value) {
          if (value === '2') {
            this.showRegisteredCapital = true
            this.platform.registeredAssets = ''
          } else {
            this.showRegisteredCapital = false
          }
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #AddStockHoldPlatform{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 520px;
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
        padding: 0px 50px;
        margin-top: 10px;
        p{
          color: #666;
          margin-bottom: 15px;
          span{
            width: 100px;
            line-height: 30px;
            display: inline-block;
            text-align: right;
            color: #333;
          }
          input{
            margin-left: 45px;
            margin-right: 10px;
            text-indent: 10px;
          }
          .radioInput{
            margin: 0 10px 0 45px;
          }
        }
        p:nth-child(2), p:nth-child(6){
          input{
            width: 280px;
            height: 30px;
            border: 1px solid #c5c5c5;
          }
        }
        p:nth-child(3),p:nth-child(4),p:nth-child(5){
          input{
            width: 120px;
            height: 30px;
            border: 1px solid #c5c5c5;
          }
        }
        .authority{
          color: #333;
          display: flex;
          span{
            width: 100px;
            display: inline-block;
            text-align: right;
          }
          .pic{
            margin-left: 45px;
            .avatarUploader {
              width: 240px;
              height: 135px;
              border: 1px solid #c5c5c5;
              background: #fff;
              overflow: hidden;
              .avatarUploaderIcon {
                font-size: 28px;
                color: #8c939d;
                width: 240px;
                height: 135px;
                line-height: 135px;
                text-align: center;
              }
              .avatar {
                width: 100%;
                height: 135px;
                display: block;
              }
            }
          }
        }
        .btn{
          margin-top: 10px;
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
    .wrapper.limitedCompany{
      height: 570px;
    }
  }

  @media screen and (max-width: 1366px){
    #AddStockHoldPlatform{
      .wrapper{
        width: 500px;
        height: 450px;
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
          p{
            margin-bottom: 10px;
            span{
              font-size: 14px;
            }
            input{
              margin-left: 25px;
            }
            .radioInput{
              margin: 0 10px 0 25px;
            }
          }
          p:nth-child(2), p:nth-child(6){
            input{
              width: 250px;
            }
          }
          .authority{
            span{
              font-size: 14px;
            }
            .pic{
              margin-left: 25px;
              .avatarUploader {
                width: 220px;
                height: 120px;
                .avatarUploaderIcon {
                  width: 220px;
                  height: 120px;
                  line-height: 120px;
                }
                .avatar {
                  height: 120px;
                }
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
      .wrapper.limitedCompany{
        height: 490px;
      }
    }
  }
</style>
