<template>
  <div id="AddEditEncouragePeople">
    <div class="wrapper">
      <div class="title"><span v-if="!this.id">添加</span><span v-if="this.id">编辑</span>激励对象<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p><label>姓名</label><input type="text" v-model.trim="form.realName" placeholder="请输入姓名"></p>
        <p><label>E-mail</label><input type="text" v-model.trim="form.email" spellcheck="false" placeholder="请输入邮箱"></p>
        <p>
          <label>证件号</label>
          <select v-model.trim="form.papersType">
            <option value="1">身份证</option>
            <option value="2">护照</option>
            <option value="3">台胞证</option>
            <option value="4">回乡证</option>
          </select>
          <input type="text" v-model.trim="form.papersNum" placeholder="请输入证件号码">
        </p>
        <p><label>员工ID</label><input type="text" v-model.trim="form.empno" placeholder="请输入员工ID"><span>（可选）</span></p>
        <p><label>部门</label><input type="text" v-model.trim="form.department" placeholder="请输入部门"><span>（可选）</span></p>
        <p><label>职位</label><input type="text" v-model.trim="form.post" placeholder="请输入职位"><span>（可选）</span></p>
        <p>
          <label>身份类型</label>
          <select v-model.trim="form.identity">
            <option value="1">董事</option>
            <option value="2">监事</option>
            <option value="3">激励对象</option>
          </select>
        </p>
        <div class="authority">
          <label>访问权限</label>
          <ul>
            <li>
              <span>股权&ensp;&ensp;&ensp;&ensp;</span>
              <el-switch class="switch" v-model.trim="form.stock" @change="changeText" active-color="#62AEFF"></el-switch>
              <!--<span class="color999">完全权限<i>(可查看分红股概况并进行管理 )</i></span>-->
              <span class="color999">{{ form.roleText2 }}</span>
            </li>
            <li>
              <span>公司管理</span>
              <el-switch class="switch" v-model.trim="form.companyManage" @change="changeText" active-color="#62AEFF"></el-switch>
              <span class="color999">{{ form.roleText1 }}</span>
            </li>
            <li>
              <span>操作日志</span>
              <el-switch class="switch" v-model.trim="form.logs" @change="changeText" active-color="#62AEFF"></el-switch>
              <span class="color999">{{ form.roleText3 }}</span>
            </li>
            <li>
              <input id="pushEmail" type="checkbox" v-model.trim="form.ifSend"><label for="pushEmail">发送邮件邀请</label>
            </li>
          </ul>
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
          realName: '',
          email: '',
          papersType: 1,
          papersNum: '',
          empno: '',
          department: '',
          post: '',
          identity: '',
          companyManage: false,
          roleText1: '不可查看',
          stock: false,
          roleText2: '不可查看',
          logs: false,
          roleText3: '不可查看',
          role: '',
          companyId: '',
          ifSend: false,
          companyName: '',
          ownRealName: ''
        }
      }
    },
    props: ['id'],
    mounted () {
      if (this.id) {
        this.getInfo()
      }
    },
    methods: {
      close () {
        this.$emit('isShow', false)
      },
      // switch 改变是变动后面的文字
      changeText () {
        if (this.form.companyManage === true) {
          this.form.roleText1 = '完全权限'
        } else {
          this.form.roleText1 = '不可查看'
        }
        if (this.form.stock === true) {
          this.form.roleText2 = '完全权限'
        } else {
          this.form.roleText2 = '不可查看'
        }
        if (this.form.logs === true) {
          this.form.roleText3 = '完全权限'
        } else {
          this.form.roleText3 = '不可查看'
        }
      },
      getInfo () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/companyuser/findOne',
          params: {
            companyUserId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.form.realName = result.data.companyUser.realName
            this.form.email = result.data.companyUser.email
            this.form.papersType = result.data.companyUser.papersType
            this.form.papersNum = result.data.companyUser.papersNum
            this.form.empno = result.data.companyUser.empno
            this.form.department = result.data.companyUser.department
            this.form.post = result.data.companyUser.post
            this.form.identity = result.data.companyUser.identity
            this.form.role = result.data.companyUser.role
            if (this.form.role.indexOf('1') > -1) {
              this.form.stock = true
            }
            if (this.form.role.indexOf('2') > -1) {
              this.form.companyManage = true
            }
            if (this.form.role.indexOf('3') > -1) {
              this.form.logs = true
            }
          }
        })
      },
      submit () {
        var arr = []
        if (this.form.stock === true) {
          arr.push('1')
        }
        if (this.form.companyManage === true) {
          arr.push('2')
        }
        if (this.form.logs === true) {
          arr.push('3')
        }
        if (!this.form.realName || !this.form.email || !this.form.papersNum || !this.form.identity) {
          this.$message.warning('请完善信息！')
        } else if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+/.test(this.form.email)) {
          this.$message.warning('邮箱格式不正确！')
        } else {
          if (this.id) {
            this.axios({
              method: 'POST',
              url: '/keygood/web/companyuser/editOne',
              data: this.toFormData({
                realName: this.form.realName,
                email: this.form.email,
                papersType: parseInt(this.form.papersType),
                papersNum: this.form.papersNum,
                empno: this.form.empno,
                department: this.form.department,
                post: this.form.post,
                identity: this.form.identity,
                role: arr.join(','),
                ifSend: this.form.ifSend ? 1 : 2,
                companyUserId: this.id,
                companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
                ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
              })
            }).then((result) => {
              if (result.data.code === 0) {
                this.$emit('isShow', 'add')
                this.$message.success('编辑成功！')
              }
            })
          } else {
            this.axios({
              method: 'POST',
              url: '/keygood/web/companyuser/addOne',
              data: this.toFormData({
                realName: this.form.realName,
                email: this.form.email,
                papersType: parseInt(this.form.papersType),
                papersNum: this.form.papersNum,
                empno: this.form.empno,
                department: this.form.department,
                post: this.form.post,
                identity: this.form.identity,
                role: arr.join(','),
                ifSend: this.form.ifSend ? 1 : 2,
                companyId: JSON.parse(sessionStorage.getItem('companyUser')).companyId,
                companyName: JSON.parse(sessionStorage.getItem('company')).companyName,
                ownRealName: JSON.parse(sessionStorage.getItem('companyUser')).realName
              })
            }).then((result) => {
              if (result.data.code === 0) {
                this.$emit('isShow', 'add')
                this.$message.success('添加成功！')
              }
            })
          }
        }
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #AddEditEncouragePeople{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 660px;
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
          float: right;
          margin-right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0px 50px;
        margin-top: 20px;
        p{
          color: #666;
          margin-bottom: 20px;
          label{
            width: 100px;
            line-height: 30px;
            display: inline-block;
            text-align: right;
          }
          input{
            width: 280px;
            height: 30px;
            border: 1px solid #c5c5c5;
            text-indent: 15px;
            margin-left: 25px;
          }
          span{
            font-size: 14px;
            color: #999;
          }
        }
        p:nth-child(3){
          height: 32px;
          font-size: 0;
          label{
            font-size: 16px;
          }
          select{
            width: 90px;
            height: 32px;
            margin-left: 25px;
            border: 1px solid #c5c5c5;
            color: #666666;
            padding: 0 1%;
          }
          input{
            width: 180px;
            height: 30px;
            border: 1px solid #c5c5c5;
            text-indent: 15px;
            margin-left: 10px;
            transform: translateY(-1px);
          }
        }
        p:nth-child(7){
          height: 32px;
          label{
            font-size: 16px;
          }
          select{
            width: 282px;
            height: 32px;
            margin-left: 20px;
            border: 1px solid #c5c5c5;
            color: #333;
            padding: 0 1%;
          }
        }
        .authority{
          color: #666;
          display: flex;
          label{
            width: 100px;
            display: inline-block;
            text-align: right;
          }
          ul{
            margin-left: 25px;
            display: inline-block;
            li{
              margin-bottom: 15px;
              span{
                font-size: 14px;
                i{
                  font-size: 12px;
                }
              }
              .switch{
                margin: -1px 20px 0;
              }
              .color999{
                color: #999;
              }
              input{
                width: 16px;
                height: 16px;
                vertical-align: middle;
                margin-right: 10px;
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
  }

  @media screen and (max-width: 1366px){
    #AddEditEncouragePeople{
      .wrapper{
        width: 520px;
        height: 560px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 24px;
          }
        }
        .con{
          padding: 0px 20px;
          margin-top: 15px;
          p{
            margin-bottom: 10px;
            label{
              width: 80px;
              line-height: 30px;
              display: inline-block;
              text-align: right;
              font-size: 14px;
            }
            input{
              width: 250px;
              height: 30px;
              text-indent: 12px;
              margin-left: 20px;
            }
          }
          p:nth-child(3){
            label{
              font-size: 14px;
            }
            select{
              width: 75px;
              height: 32px;
              margin-left: 20px;
            }
            input{
              width: 170px;
              height: 30px;
              border: 1px solid #c5c5c5;
              text-indent: 15px;
              margin-left: 5px;
            }
          }
          p:nth-child(7){
            height: 32px;
            label{
              font-size: 14px;
            }
            select{
              width: 252px;
              margin-left: 16px;
            }
          }
          .authority{
            color: #666;
            display: flex;
            label{
              width: 90px;
              font-size: 14px;
            }
            ul{
              margin-left: 20px;
              display: inline-block;
              padding: 5px 10px 0;
              li{
                margin-bottom: 10px;
                .switch{
                  margin: -1px 10px 0;
                }
                .color999{
                  color: #999;
                }
                input{
                  width: 16px;
                  height: 16px;
                  vertical-align: middle;
                  margin-right: 10px;
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
    }
  }
</style>
