<template>
  <div id="Certification">
    <div class="logo"></div>
    <h2>认证中</h2>
    <p>认证信息已提交，请等待审核。</p>
    <p>在等待认证期间，可先了解下股权激励的相关知识。 <a href="http://www.keygood.cn" target="_blank">详情>></a></p>
  </div>
</template>

<script>

</script>

<style type="text/css" lang="scss" scoped>
  #Certification{
    text-align: center;
    .logo{
      width: 65px;
      height: 64px;
      margin: 143px auto 0;
      background: url("../assets/certification.png") no-repeat center;
    }
    h2{
      font-size: 24px;
      color: #333;
      font-weight: 400;
      margin: 45px 0 40px;
    }
    p{
      font-size: 18px;
      margin-bottom: 26px;
      a{
        color: #333;
      }
    }
  }

  @media screen and (max-width: 1366px){
    #Certification{
      .logo{
        margin: 103px auto 0;
      }
      h2{
        font-size: 20px;
        margin: 35px 0 30px;
      }
      p{
        font-size: 16px;
      }
    }
  }
</style>
