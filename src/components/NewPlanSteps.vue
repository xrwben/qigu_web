<template>
  <div id="NewPlanSteps">
    <span v-for="(item, index) in stepCon" :class="{active: index == step}">
      <i></i>
      <label>{{item}}</label>
    </span>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        stepCon: ['基本设置', '激励额度', '持股主体', '认购窗口及计划有效期', '退出机制说明', '计划预览'],
        activeIndex: 0
      }
    },
    props: ['step'],
    methods: {
     // 11
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #NewPlanSteps{
    height: 80px;
    padding-top: 10px;
    text-align: center;
    background: #EFF3F6;
    span{
      width: 190px;
      border-top: 1px solid #999;
      display: inline-block;
      text-align: left;
      transform: translateX(90px);
      i{
        width: 10px;
        height: 10px;
        display: block;
        background: #999;
        border-radius: 50%;
        transform: translate(0, -50%);
      }
      label{
        display: inline-block;
        font-size: 18px;
        transform: translate(-50%, 0);
        color: #999;
      }
    }
    span:last-of-type{
      border-top: none;
    }
    span.active{
      border-top: 1px solid #5090D3;
      i{
        background: #5090D3;
      }
      label{
        color: #5090D3;
      }
    }
    span.active:last-of-type{
      border-top: none;
    }
  }

  @media screen and (max-width: 1366px){
    #NewPlanSteps{
      height: 60px;
      span{
        width: 150px;
        transform: translateX(70px);
        label{
          font-size: 14px;
        }
      }
    }
  }
</style>
