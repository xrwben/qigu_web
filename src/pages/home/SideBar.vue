<template>
  <div id="SideBar">
    <div class="logo">
      <img src="../../assets/logo.png">
    </div>
    <el-menu :default-active="$route.path" class="sideMenus" @open="openMenu" @close="closeMenu" :uniqueOpened=true router background-color="#EFF3F8" text-color="#333" active-text-color="#007BFF">
      <!-- 遍历每个路由,显示没有hide属性的 -->
      <template v-for="(item, index) in $router.options.routes" v-if="!item.hide && (logonMode === 1 || (logonMode === 2 && roles.indexOf(item.role) > -1) || !item.role)">
        <el-submenu :index="item.name" v-if="!item.only">
          <template slot="title">
            <i :class="item.iconClass"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(itemChild, index) in item.children" :index="itemChild.path" :key="itemChild.path">{{ itemChild.name }}</el-menu-item>
          <div :class="{popup: canClick}"></div>
        </el-submenu>
        <el-menu-item :index="item.children[0].path" v-if="item.only && (logonMode === 1 || (logonMode === 2 && roles.indexOf(item.role) > -1) || !item.role)" class="MenuItem">
          <i :class="item.iconClass"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: 'SideBar',
    data () {
      return {
        canClick: false, // 子菜单是否可以点击
        logonMode: JSON.parse(sessionStorage.getItem('companyUser')).logonMode,
        roles: JSON.parse(sessionStorage.getItem('companyUser')).role || ''
      }
    },
    methods: {
      // 打开子菜单回调
      openMenu (key, keyPath) {
        let thisOrder = JSON.parse(sessionStorage.getItem('thisOrder'))
        let historyOrder = JSON.parse(sessionStorage.getItem('historyOrder'))
        if (key === '公司管理') {
          if (thisOrder) {
            if (thisOrder.status === 1) {
              if (historyOrder) {
                if (historyOrder.endTime < new Date()) {
                  this.canClick = true
                } else {
                  this.canClick = false
                }
              } else {
                this.canClick = true
              }
            } else {
              if (thisOrder.endTime < new Date()) {
                this.canClick = true
              } else {
                this.canClick = false
              }
            }
          } else {
            this.canClick = true
          }
//          if (!thisOrder) {
//            this.canClick = true
//            console.log(1)
//          } else if (!historyOrder && (thisOrder.status !== 2 || thisOrder.endTime < new Date())) {
//            this.canClick = true
//            console.log(2)
//          } else if (historyOrder && historyOrder.endTime < new Date() && (thisOrder.status !== 2 || thisOrder.endTime < new Date())) {
//            this.canClick = true
//            console.log(3)
//          } else {
//            this.canClick = false
//            console.log(4)
//          }
        } else {
          this.canClick = false
        }
      },
      // 关闭子菜单回调
      closeMenu () {
        this.canClick = false
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #SideBar{
    width: 100%;
    background: #EFF3F8;
    .logo{
      width: 100%;
      height: 80px;
      background: #5090D3;
      position: relative;
      img{
        width: 162px;
        height: 46px;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .popup{
    width: 100%;
    height: 100%;
    background: rgba(0, 0 ,0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  @media screen and (max-width: 1366px){
    #SideBar{
      .logo{
        height: 60px;
        img{
          width: 120px;
          height: 35px;
        }
      }
    }
  }
</style>
