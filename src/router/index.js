import Vue from 'vue'
import Router from 'vue-router'

const Login = resolve => require(['../pages/Login.vue'], resolve)
const Register = resolve => require(['../pages/Register.vue'], resolve)
const EmpRegister = resolve => require(['../pages/EmpRegister.vue'], resolve)
const ForgetPassword = resolve => require(['../pages/ForgetPassword.vue'], resolve)
const Home = resolve => require(['../pages/home/Home.vue'], resolve)

const StockManagement = resolve => require(['../pages/sideBar/StockManagement.vue'], resolve)
const StockSituation = resolve => require(['../pages/sideBar/StockSituation.vue'], resolve)
const EncourageObject = resolve => require(['../pages/sideBar/EncourageObject.vue'], resolve)
const DataBase = resolve => require(['../pages/sideBar/DataBase.vue'], resolve)
const CompanyInfo = resolve => require(['../pages/sideBar/CompanyInfo.vue'], resolve)
const OrderBuy = resolve => require(['../pages/sideBar/OrderBuy.vue'], resolve)
const MyInfo = resolve => require(['../pages/sideBar/MyInfo.vue'], resolve)
const MyAsset = resolve => require(['../pages/sideBar/MyAsset.vue'], resolve)
const HelpCenter = resolve => require(['../pages/sideBar/HelpCenter.vue'], resolve)
const OperationLogs = resolve => require(['../pages/sideBar/OperationLogs.vue'], resolve)

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login',
      hide: true
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      hide: true
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      hide: true
    },
    {
      path: '/empregister',
      name: 'EpmRegister',
      component: EmpRegister,
      hide: true
    },
    {
      path: '/forgetpassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
      hide: true
    },
    {
      path: '/stock',
      name: '股权',
      component: Home,
      iconClass: 'iconfont icon-tongjitubiao',
      redirect: '/stock/stockmanagement',
      role: '1',
      children: [
        {
          path: '/stock/stockmanagement',
          name: '股权管理',
          component: StockManagement
        },
        {
          path: '/stock/stocksituatioin',
          name: '股权概况',
          component: StockSituation
        }
      ]
    },
    {
      path: '/companymanagement',
      name: '公司管理',
      component: Home,
      iconClass: 'iconfont icon-guanli',
      redirect: '/companymanagement/encourageobject',
      role: '2',
      children: [
        {
          path: '/companymanagement/encourageobject',
          name: '激励对象',
          component: EncourageObject
        },
        {
          path: '/companymanagement/database',
          name: '资料库',
          component: DataBase
        },
        {
          path: '/companymanagement/companyinfo',
          name: '公司信息',
          component: CompanyInfo
        }
      ]
    },
    {
      path: '/orderbuy',
      name: '订单及购买',
      component: Home,
      redirect: '/orderbuy',
      only: true,
      iconClass: 'iconfont icon-wenjian',
      role: '4',
      children: [
        {
          path: '/orderbuy',
          name: 'OrderBuy',
          component: OrderBuy
        }
      ]
    },
    {
      path: '/my',
      name: '个人中心',
      component: Home,
      iconClass: 'iconfont icon-touxiang-copy-copy',
      redirect: '/my/myinfo',
      children: [
        {
          path: '/my/myinfo',
          name: '个人信息',
          component: MyInfo
        },
        {
          path: '/my/myasset',
          name: '我的资产',
          component: MyAsset
        }
      ]
    },
    {
      path: '/operationlogs',
      name: '操作日志',
      component: Home,
      only: true,
      iconClass: 'iconfont icon-caozuorizhi',
      role: '3',
      children: [
        {
          path: '/operationlogs',
          name: 'OperationLogs',
          component: OperationLogs
        }
      ]
    },
    {
      path: '/helpcenter',
      name: '帮助中心',
      component: Home,
      only: true,
      iconClass: 'iconfont icon-help',
      children: [
        {
          path: '/helpcenter',
          name: 'HelpCenter',
          component: HelpCenter
        }
      ]
    }
  ]
})
export default router
