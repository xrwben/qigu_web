// 用户类型
const logsType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '股权'
      break
    case 2:
      result = '公司'
      break
    case 3:
      result = '订单及购买'
      break
    default:
      break
  }
  return result
}

// 分红股状态
const shareStockStatus = function (value) {
  var result
  switch (value) {
    case 1:
      result = '待签字'
      break
    case 2:
      result = '已签字'
      break
    case 3:
      result = '转换中'
      break
    case 4:
      result = '转换完成'
      break
    default:
      break
  }
  return result
}

// 计划完成状态
const planStatus = function (value) {
  var result
  switch (value) {
    case 1:
      result = '未完成'
      break
    case 2:
      result = '已完成'
      break
    default:
      break
  }
  return result
}

// 持股主体
const positionsMainType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '个人持股'
      break
    case 2:
      result = '持股平台'
      break
    default:
      break
  }
  return result
}

// 时间格式
const dateFormat = function (value) {
  let year = new Date(value).getFullYear() || 0
  let month = (new Date(value).getMonth() + 1 || 0) < 10 ? '0' + (new Date(value).getMonth() + 1 || 0) : (new Date(value).getMonth() + 1 || 0)
  let date = (new Date(value).getDate() || 0) < 10 ? '0' + (new Date(value).getDate() || 0) : (new Date(value).getDate() || 0)
  // let hour = (new Date(value).getHours() || 0) < 10 ? '0' + (new Date(value).getHours() || 0) : (new Date(value).getHours() || 0)
  // let minute = (new Date(value).getMinutes() || 0) < 10 ? '0' + (new Date(value).getMinutes() || 0) : (new Date(value).getMinutes() || 0)
  // let second = (new Date(value).getSeconds() || 0) < 10 ? '0' + (new Date(value).getSeconds() || 0) : (new Date(value).getSeconds() || 0)
  // return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  return year + '-' + month + '-' + date
}

// 身份类型
const identityType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '董事'
      break
    case 2:
      result = '监事'
      break
    case 3:
      result = '激励对象'
      break
    default:
      break
  }
  return result
}

// 持股平台类型
const stockHoldPlatformType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '合伙企业'
      break
    case 2:
      result = '有限公司'
      break
    default:
      break
  }
  return result
}

// 激励计划相关文档类型
const planDocType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '股权激励计划书'
      break
    case 2:
      result = '董事会决议'
      break
    case 3:
      result = '执行董事决议'
      break
    case 4:
      result = '股东会决议'
      break
    case 5:
      result = '股东大会决议'
      break
    default:
      break
  }
  return result
}

// 使用场景
const sceneType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '新建激励计划-决议文件'
      break
    case 2:
      result = '个人-有限'
      break
    case 3:
      result = '个人-股份'
      break
    case 4:
      result = '平台-有限'
      break
    case 5:
      result = '平台-股份'
      break
    case 6:
      result = '授予-个人持股'
      break
    case 7:
      result = '授予-持股平台'
      break
    case 8:
      result = '转换'
      break
    case 9:
      result = '计划预览-体验'
      break
    case 10:
      result = '分红股-打印'
      break
    case 11:
      result = '受限股-打印'
      break
    case 12:
      result = '激励对象批量导入'
      break
    default:
      break
  }
  return result
}

// 时间单位
const timeUnit = function (value) {
  var result
  switch (value) {
    case 1:
      result = '年'
      break
    case 2:
      result = '月'
      break
    case 3:
      result = '日'
      break
    default:
      break
  }
  return result
}

// 时间单位
const noLimitType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '按时间解限'
      break
    case 2:
      result = '按业绩指标解限'
      break
    default:
      break
  }
  return result
}

// 公司类型
const companyType = function (value) {
  var result
  switch (value) {
    case 1:
      result = '有限责任公司'
      break
    case 2:
      result = '股份有限公司'
      break
    default:
      break
  }
  return result
}

// 订单状态
const orderStatus = function (value) {
  var result
  switch (value) {
    case 1:
      result = '待支付'
      break
    case 2:
      result = '已支付'
      break
    case 3:
      result = '已取消'
      break
    default:
      break
  }
  return result
}

export {logsType, dateFormat, shareStockStatus, planStatus, positionsMainType, identityType, stockHoldPlatformType, planDocType, sceneType, timeUnit, noLimitType, companyType, orderStatus}
