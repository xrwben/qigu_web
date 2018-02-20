<template>
  <div id="Steps">
    <span v-for="(item, index) in stepCon" :class="{active: index==step}" @click="clickStep(index)">
      {{ item }}
    </span>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        activeIndex: 0
      }
    },
    props: ['stepCon', 'step'],
    methods: {
      clickStep (i) {
        this.$emit('stepIndex', i)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #Steps{
    text-align: center;
    font-size: 0;
    span{
      width: 300px;
      height: 70px;
      background: #eff3f6;
      display: inline-block;
      position: relative;
      font-size: 18px;
      color: #666;
      text-align: center;
      line-height: 70px;
      margin: 0 35px;
      &:before {
        border: 35px solid green;
        border-color: #eff3f6 #eff3f6 #eff3f6 transparent;
        content: '';
        position: absolute;
        top: 0;
        left: -35px;
      }
      &:after {
        border: 35px solid red;
        border-color: transparent transparent transparent #eff3f6;
        content: '';
        position: absolute;
        top: 0;
        right: -70px;
      }
    }
    span:first-of-type{
      &:before{
        border-color: #eff3f6;
      }
    }
    span.active{
      background: #63aeff;
      color: #fff;
      &:before{
        border-color: #63aeff #63aeff #63aeff transparent;
      }
      &:after{
        border-color: transparent transparent transparent #63aeff;
      }
    }
    span.active:first-of-type{
      &:before{
        border-color: #63aeff;
      }
    }
  }

  @media screen and (max-width: 1600px){
    #Steps{
      span{
        width: 200px;
        height: 40px;
        background: #eff3f6;
        display: inline-block;
        position: relative;
        font-size: 16px;
        color: #666;
        text-align: center;
        line-height: 40px;
        margin: 0 25px;
        &:before {
          border: 20px solid green;
          border-color: #eff3f6 #eff3f6 #eff3f6 transparent;
          content: '';
          position: absolute;
          top: 0;
          left: -20px;
        }
        &:after {
          border: 20px solid red;
          border-color: transparent transparent transparent #eff3f6;
          content: '';
          position: absolute;
          top: 0;
          right: -40px;
        }
      }
    }
  }
</style>
