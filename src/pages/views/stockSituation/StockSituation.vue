<template>
  <div id="PieEchart">
    <div class="total" v-if="isShow">
      <p class="title">公司总股数</p>
      <div class="pie">
        <div class="wrapper" v-for="(item, index) in data">
          <div :id="'pie' + index" class="pieSize"></div>
          <p class="pieTips">{{ index === 0 ? '分红股' : '受限股' }}<span>总股数：{{ item.pieSum }}股</span></p>
        </div>
      </div>
    </div>
    <div class="total planItems" v-for="(item, index) in datas">
      <p class="title">{{ item.pieName }}</p>
      <div class="pie">
        <div class="wrapper" v-for="(subItem, subIndex) in datas[index].pieList">
          <div :id="'pie' + index + subIndex" class="pieMiniSize"></div>
          <p class="pieTips">{{ subIndex === 0 ? '分红股' : '受限股' }}<span>总股数：{{ subItem.pieSum }}股</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        isShow: false,
        data: [],
        datas: []
      }
    },
    mounted () {
      this.getDatas()
    },
    methods: {
      // 获取数据
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/company/findPie',
          params: {
            companyId: JSON.parse(sessionStorage.getItem('company')).companyId
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.data = result.data.sumPies
            this.datas = result.data.planPies
            if (this.datas.length) {
              this.addDatas()
              this.isShow = true
            }
          }
        })
      },
      // 画图
      drawPie (id, data) {
        this.charts = echarts.init(document.getElementById(id))
        this.charts.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b} ({d}%)'
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: '85%',
              center: ['50%', '50%'],
              data: data,
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: '{d}%'
                }
              },
              labelLine: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 5,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.2)'
                }
              }
            }
          ],
          color: ['rgba(80,144,211,1)', 'rgba(98,174,255,1)'],
          animationDuration: 1000
        })
      },
      // 添加数据
      addDatas () {
        this.$nextTick(() => {
          this.drawPie('pie0', this.data[0].pieValue)
          this.drawPie('pie1', this.data[1].pieValue)
          for (let i = 0; i < this.datas.length; i++) {
            this.datas[i].pieList.forEach((item, index) => {
              this.drawPie('pie' + i + index, item.pieValue)
            })
          }
        })
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #PieEchart{
    padding-bottom: 30px;
    .total{
      .title{
        margin-top: 10px;
        padding: 10px 15px;
        background: #EFF3F8;
        display: inline-block;
      }
      .pie{
        text-align: center;
        margin-top: 20px;
        .wrapper{
          display: inline-block;
          .pieSize{
            width: 200px;
            height: 200px;
            display: inline-block;
          }
        }
        .wrapper:first-of-type{
          margin-right: 200px;
        }
      }
    }
    .planItems{
      margin-top: 30px;
      .pieMiniSize{
        width: 170px;
        height: 170px;
        display: inline-block;
      }
    }
    .pieTips{
      color: #333;
      span{
        color: #5090D3;
        font-size: 14px;
        margin-left: 20px;
      }
    }
  }
</style>
