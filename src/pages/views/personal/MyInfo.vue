<template>
  <div id="MyInfo">
    <!-- 个人信息 -->
    <div v-if="personalDetails.status === 4">
      <div class="infoDetails">
        <el-upload
          class="avatarUploader"
          action="/keygood/web/oss/upload?fileType=1"
          accept="image/gif,image/jpeg,image/jpg,image/png"
          :headers=uploadHeader
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatarUploaderIcon"></i>
        </el-upload>
        <p><span><b>我的姓名：</b>{{ personalDetails.realName }}</span><span></span></p>
        <p><span><b>邮箱绑定：</b>{{ personalDetails.email }}</span><span @click="showPopup('SetEmail')">修改</span></p>
        <p>
          <span><b>手机绑定：</b>{{ personalDetails.phone || '--' }}</span>
          <span v-if="personalDetails.phone" @click="showPopup('SetTellNumber')">解绑</span>
          <span v-if="!personalDetails.phone" @click="showPopup('showSetPhone')">绑定</span>
        </p>
        <p><span><b>账号安全：</b> 密码安全{{ personalDetails.rank }}等</span><span @click="showPopup('SetPassword')">修改密码</span></p>
        <p class="btn"><button @click="showPopup('showSetCertification')">实名认证</button></p>
      </div>
      <div class="tips">
        <span>提示</span>：必须要完成<span>实名认证</span>才能进入个人中心。
        实名认证审核时间约为<span>1个工作日</span>，请您合理安排认证时间，避免耽误签字。
      </div>
    </div>

    <!-- 修改邮箱 -->
    <set-email v-if="showSetEmail" v-on:isShow="closePopup"></set-email>

    <!-- 解绑手机号 -->
    <set-tell-number v-if="showSetTellNumber" v-on:isShow="closePopup"></set-tell-number>

    <!-- 绑定手机号 -->
    <set-phone v-if="showSetPhone" v-on:isShow="closePopup"></set-phone>

    <!-- 实名认证 -->
    <set-certification v-if="showSetCertification" v-on:isShow="closePopup"></set-certification>

    <!-- 修改密码 -->
    <set-password v-if="showSetPassword" v-on:isShow="closePopup"></set-password>

    <!-- 等待认证中 -->
    <div class="pending">
      <certification v-if="personalDetails.status === 3"></certification>
    </div>

    <!-- 激活邮箱 -->
    <active-mail-box v-if="personalDetails.status === 1"></active-mail-box>

  </div>
</template>

<script>
  import Certification from '../../../components/Certification.vue' // 认证中组件
  import SetEmail from '../../../components/popup/SetEmail.vue'
  import SetTellNumber from '../../../components/popup/SetTellNumber.vue'
  import SetPhone from '../../../components/popup/SetPhone.vue'
  import SetCertification from '../../../components/popup/SetCertification.vue'
  import SetPassword from '../../../components/popup/SetPassword.vue'
  import ActiveMailBox from '../../../components/ActiveMailBox.vue' // 邮箱激活中
  export default {
    data () {
      return {
        imageUrl: '',
        uploadHeader: {
          token: sessionStorage.getItem('token')
        },
        showSetEmail: false, // 是否显示修改弹窗
        showSetTellNumber: false, // 是否显示解绑弹窗
        showSetPhone: false, // 是否显示绑定手机弹窗
        showSetPassword: false, // 是否显示修改密码弹窗
        showSetCertification: false, // 是否显示实名认证弹窗
        personalDetails: {}
      }
    },
    components: {
      Certification,
      ActiveMailBox,
      SetEmail,
      SetTellNumber,
      SetPhone,
      SetCertification,
      SetPassword
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/findOne',
          params: {
            companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.personalDetails = result.data.companyUser
            this.imageUrl = result.data.companyUser.headImg
            sessionStorage.setItem('companyUser', JSON.stringify(result.data.companyUser))
            let timer = Math.ceil(((JSON.parse(sessionStorage.getItem('companyUser')).activateTime + 7 * 24 * 60 * 60 * 1000) - new Date().getTime()) / (24 * 60 * 60 * 1000))
            let historyOrder = JSON.parse(sessionStorage.getItem('historyOrder'))
            let thisOrder = JSON.parse(sessionStorage.getItem('thisOrder'))
            if (!((!thisOrder && timer <= 0) || (thisOrder && thisOrder.status === 1 && historyOrder && historyOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 2 && thisOrder.endTime < new Date()) || (thisOrder && thisOrder.status === 1 && !historyOrder && timer <= 0))) {
              if (result.data.companyUser.status === 2 || result.data.companyUser.status === 5) {
                this.showSetCertification = true
              }
            }
          }
        })
      },
      // 显示弹窗
      showPopup (i) {
        if (i === 'showSetCertification') {
          this.showSetCertification = true
        } else if (i === 'showSetPhone') {
          this.showSetPhone = true
        } else if (i === 'SetTellNumber') {
          this.showSetTellNumber = true
        } else if (i === 'SetEmail') {
          this.showSetEmail = true
        } else if (i === 'SetPassword') {
          this.showSetPassword = true
        }
      },
      // 关闭弹窗
      closePopup (value) {
        if (value && value === 'update') {
          this.getDatas()
        }
        this.showSetCertification = false
        this.showSetPhone = false
        this.showSetTellNumber = false
        this.showSetEmail = false
        this.showSetPassword = false
      },
      // 上传成功的回显方法
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.imageUrl = res.filePath
        this.saveHeadImg()
      },
      beforeAvatarUpload (file) {
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!')
        }
        return isLt5M
      },
      // 保存修改的头像
      saveHeadImg () {
        this.axios({
          method: 'POST',
          url: '/keygood/web/companyuser/editHeadImg',
          data: this.toFormData({
            companyUserId: JSON.parse(sessionStorage.getItem('companyUser')).companyUserId,
            headImg: this.imageUrl
          })
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('头像上传成功！')
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .infoDetails{
    width: 410px;
    height: 500px;
    box-shadow: 1px 0 10px #666;
    margin: 176px auto 0;
    padding: 0 30px;
    .avatarUploader{
      width: 120px;
      height: 120px;
      border: 1px solid #E3E3E3;
      background: #fff;
      margin: 0px auto;
      transform: translateY(-60px);
      border-radius: 50%;
      overflow: hidden;
      .avatarUploaderIcon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }
      .avatar {
        width: 100%;
        height: 120px;
        display: block;
      }
    }
    p{
      padding-bottom: 50px;
      span{
        color: #666;
        b{
          font-weight: 400;
          color: #333;
        }
      }
      span:last-of-type{
        float: right;
        color: #62AEFF;
        cursor: pointer;
      }
      button{
        width: 113px;
        height: 45px;
        background: #fff;
        color: #007BFF;
        font-size: 18px;
        border: 1px solid #E3E3E3;
        font-family: "Microsoft YaHei";
      }
    }
    p.btn{
      text-align: center;
    }
  }
  .tips{
    width: 410px;
    margin: 16px auto 0;
    color: #666;
    font-size: 14px;
    span{
      color: #007BFF;
    }
    span:first-of-type{
      color: #333;
    }
  }

  @media screen and (max-width: 1366px){
    .infoDetails{
      width: 320px;
      height: 350px;
      margin: 100px auto 0;
      font-size: 14px;
      .avatarUploader{
        width: 100px;
        height: 100px;
        transform: translateY(-50px);
        .avatarUploaderIcon {
          width: 100px;
          height: 100px;
          line-height: 100px;
        }
        .avatar {
          height: 100px;
        }
      }
      p{
        padding-bottom: 30px;
        button{
          width: 100px;
          height: 35px;
          font-size: 16px;
        }
      }
      p.btn{
        text-align: center;
      }
    }
    .tips{
      width: 350px;
      margin: 10px auto 0;
    }
  }
</style>
