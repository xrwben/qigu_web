<template>
  <div id="ChangeDetails">
    <div class="wrapper">
      <div class="title">变更详情<span>净资产-{{ this.index || '原始值' }}</span><i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>变更后净资产:<span>{{ assetChange.afterAsset }}元</span></p>
        <p>变更原因:<span>{{ assetChange.cause || '无' }}</span></p>
        <!-- 列表 -->
        <div class="list">
          <table>
            <thead>
            <tr>
              <th></th>
              <th v-if="this.index">变更前</th>
              <th>{{ this.index ? '变更后' : '原始值' }}</th>
            </tr>
            </thead>
            <tbody>
              <tr>
                <td>净资产</td>
                <td v-if="this.index">{{ assetChange.beforAsset }} 元</td>
                <td>{{ assetChange.afterAsset }} 元</td>
              </tr>
              <tr>
                <td>虚拟股</td>
                <td v-if="this.index">{{ dummyStock }} 股</td>
                <td>{{ dummyStock }} 股</td>
              </tr>
              <tr>
                <td>每股净资产价格</td>
                <td v-if="this.index">{{ beforPrice }} 元/股</td>
                <td>{{ afterPrice }} 元/股</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        assetChange: {},
        dummyStock: 0,
        beforPrice: 0,
        afterPrice: 0

      }
    },
    props: ['index', 'id'],
    mounted () {
      this.getDatas()
    },
    methods: {
      getDatas () {
        this.axios({
          method: 'GET',
          url: '/keygood/web/assetchange/findOne',
          params: {
            assetChangeId: this.id
          }
        }).then((result) => {
          if (result.data.code === 0) {
            this.assetChange = result.data.assetChange
            this.dummyStock = result.data.dummyStock
            this.beforPrice = result.data.beforPrice
            this.afterPrice = result.data.afterPrice
          }
        })
      },
      close () {
        this.$emit('isShow', false)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ChangeDetails{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 800px;
      background: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .title{
        width: 100%;
        height: 60px;
        line-height: 60px;
        background: #62AEFF;
        text-align: center;
        color: #fff;
        font-size: 24px;
        span{
          font-size: 16px;
          margin-left: 5px;
        }
        i{
          position: absolute;
          right: 15px;
          font-size: 26px;
          cursor: pointer;
        }
      }
      .con{
        padding: 0px 50px 20px;
        margin-top: 20px;
        >p{
          width: 100%;
          color: #333;
          line-height: 30px;
          span{
            margin-left: 20px;
          }
        }
        p:nth-child(1){
          span{
            color: #62AEFF;
          }
        }
        p:nth-child(2){
          span{
            color: #666;
            white-space: pre-wrap;
            word-wrap : break-word;
          }
        }
        .list{
          border: 1px solid #EFF3F8;
          margin-top: 10px;
          table{
            width: 100%;
            text-align: center;
            table-layout: fixed;
            thead{
              tr{
                height: 47px;
                background: #EFF3F6;
                border-bottom: 1px solid #EFF3F6;
                color: #333;
              }
            }
            tbody{
              tr{
                height: 47px;
                border-bottom: 1px solid #EFF3F6;
                color: #666;
              }
              tr:last-of-type{
                border-bottom: 0;
              }
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1366px) {
    #ChangeDetails{
      .wrapper{
        width: 600px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          span{
            font-size: 14px;
          }
          i{
            font-size: 22px;
          }
        }
        .con{
          padding: 0px 30px 15px;
          margin-top: 15px;
          p{
            font-size: 14px;
          }
          .list{
            font-size: 14px;
            table{
              thead{
                tr{
                  height: 40px;
                }
              }
              tbody{
                tr{
                  height: 40px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
