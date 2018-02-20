<template>
  <div id="Home">
    <side-bar class="sideBar"></side-bar>
    <div class="appMain">
      <nav-bar></nav-bar>
      <app-home></app-home>
    </div>
    <div class="QQcustomService">
      <a href="tencent://message/?uin=3402306522&Site=http://www.keygood.com&Menu=yes"></a>
    </div>
  </div>
</template>

<script>
  import SideBar from './SideBar.vue'
  import NavBar from './NavBar.vue'
  import AppHome from './AppHome.vue'
  export default {
    created () {
      if (!sessionStorage.getItem('companyUser')) {
        this.$router.push('/login')
      }
    },
    components: {
      SideBar,
      AppHome,
      NavBar
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Home{
    height: 100%;
    overflow: hidden;
    .sideBar{
      width: 260px;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
    }
    .appMain{
      height: 100%;
      min-height: 100%;
      margin-left: 260px;
    }
    .QQcustomService{
      width: 48px;
      height: 48px;
      background: url('../../assets/icon_QQ.png') no-repeat;
      position: fixed;
      bottom: 30px;
      right: 40px;
      z-index: 1009;
      cursor: pointer;
      a{
        height: 100%;
        width: 100%;
        display: block;
      }
    }
  }

  @media screen and (max-width: 1366px){
    #Home{
      .sideBar{
        width: 200px;
      }
      .appMain{
        margin-left: 200px;
      }
      .QQcustomService{
        width: 40px;
        height: 40px;
        background-size: cover;
      }
    }
  }
</style>
