<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style type="text/css" lang="scss">
  @import './style/reset.css';
  @import "./style/iconfont.css";
  @import "./style/element.scss";
  #app{
    min-width: 1000px;
    height: 100%;
  }
  .fade-enter-active,.fade-leave-active {
    transition: all .2s ease-in-out;
    opacity: 1;
  }
  .fade-enter,.fade-leave-active {
    transition: all .2s ease-in-out;
    opacity: 0.8;
  }
</style>
