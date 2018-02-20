<template>
  <div id="ImportEncouragePeople">
    <div class="wrapper">
      <div class="title">批量导入<i class="iconfont icon-icons64x6403"  @click="close()"></i></div>
      <div class="con">
        <p>使用导入功能，可以快速批量添加多名激励对象</p>
        <div>
          <label>上传导入文件&emsp;</label>
          <div class="uploadFlie">
            <button>{{ text1 }}<input type="file" id="file" value="" @change="uploadFile"></button>
          </div>

          <!--<i>{{ file.fileName }}</i>-->
        </div>
        <p>
          <span>下载&emsp;</span><a href="javascript:void(0)" @click="importTemplet">导入模板</a>
        </p>
        <div class="btn">
          <button @click="close()">取消</button>
          <button @click="confirmImport">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    data () {
      return {
        file: '',
        text1: '上传'
      }
    },
    methods: {
      // 关闭上传
      close () {
        this.$emit('isShow', false)
      },
      uploadFile (e) {
        if (e.target.files[0]) {
          this.text1 = '上传完成'
          this.file = e.target.files[0]
        } else {
          this.text1 = '上传'
        }
      },
      confirmImport () {
        var formData = new FormData()
        formData.append('file', this.file)
        formData.append('companyId', JSON.parse(sessionStorage.getItem('company')).companyId)
        formData.append('ownRealName', JSON.parse(sessionStorage.getItem('companyUser')).realName)
        formData.append('companyName', JSON.parse(sessionStorage.getItem('company')).companyName)
        this.axios({
          method: 'POST',
          url: '/keygood/web/companyuser/addImport',
          data: (formData)
        }).then((result) => {
          if (result.data.code === 0) {
            this.$message.success('导入成功！')
            this.$emit('isShow', 'add')
          }
        })
      },
      // 下载模板
      importTemplet (ev) {
        ev.target.setAttribute('href', `/keygood/web/modle/downloadEmp`)
      }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  #ImportEncouragePeople{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.65);
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    .wrapper{
      width: 600px;
      height: 280px;
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
          font-size: 26px;
          cursor: pointer;
          position: absolute;
          right: 15px;
          top: 0;
        }
      }
      .con{
        p{
          text-align: center;
          line-height: 55px;
          color: #333;
          margin-top: 1px;
          a{
            text-decoration: underline;
            color: #5090D3;
          }
        }
        >div{
          height: 38px;
          text-align: center;
          line-height: 38px;
          label{
            display: block;
            float: left;
            margin-left: 190px;
          }
          .uploadFlie{
            display: block;
            float: left;
            button{
              width: 106px;
              height: 38px;
              background: #fff;
              color: #5090D3;
              border: 1px solid #E3E3E3;
              border-radius: 4px;
              font-size: 16px;
              position: relative;
              input{
                width: 100%;
                height: 100%;
                opacity: 0;
                border: 1px solid red;
                position: absolute;
                left: 0;
                top: 0;
                cursor: pointer;
              }
            }
          }
          i{
            width: 200px;
            height: 36px;
            line-height: 36px;
            border: 1px solid #ccc;
            background: #fff;
            display: block;
            text-align: left;
            padding-left: 10px;
            margin-left: 15px;
            float: left;
          }
        }
        .btn{
          margin-top: 10px;
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
    #ImportEncouragePeople{
      .wrapper{
        width: 500px;
        height: 250px;
        .title{
          height: 50px;
          line-height: 50px;
          font-size: 20px;
          i{
            font-size: 24px;
          }
        }
        .con{
          font-size: 14px;
          p{
            line-height: 50px;
          }
          >div{
            height: 35px;
            line-height: 35px;
            label{
              margin-left: 160px;
            }
            .uploadFlie{
              button{
                width: 80px;
                height: 35px;
                font-size: 14px;
              }
            }
            i{
              width: 200px;
              height: 33px;
              line-height: 33px;
              margin-left: 10px;
            }
          }
          .btn{
            button{
              width: 80px;
              height: 35px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
