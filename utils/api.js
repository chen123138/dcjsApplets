const API_URL = 'http://47.114.165.246/';
// const API_URL = 'https://e.xiecd.com/';
const API_URI = API_URL + 'web/dataset/';

module.exports = {
  // 授权
  Auth: API_URL + 'wechat/oauth.applet',
  UserInfo: API_URL + 'wechat/decode.user.info',
  // 
  AuthCorp: API_URL + 'wechat/corp/oauth.applet',
  // 
  ProductStock: API_URL + 'product.stock',
  // 
  DataList: API_URI + 'search_read',
  DataRead: API_URI + 'call_kw/%s/read',
  DataWrite: API_URI + 'call_kw/%s/write',
  DataCreate: API_URI + 'call_kw/%s/create',
  DataName: API_URI + 'call_kw/%s/name_search',
  // 
  Uom: 'uom.uom',
  EngineerGuide: 'eng.guide',
  EngineerDivide: 'eng.divide',
  EngineerProject: 'eng.project',
  EngineerUnit: 'eng.project.unit',
  EngineerUser: 'eng.project.user',
  EngineerSystem: 'eng.project.system',
  EngineerProduct: 'eng.project.product',
  // 任务
  EngineerTask: 'eng.project.task',
  EngineerTaskUser: 'eng.project.task.user',
  EngineerTaskProduct: 'eng.project.task.product',
  // 请购
  EngineerPurchase: 'eng.project.purchase',
  EngineerPurchaseProduct: 'eng.project.purchase.product',
  // 询价
  EngineerEnquiry: 'eng.project.enquiry',
  EngineerEnquiryProduct: 'eng.project.enquiry.product',
  // 订单
  EngineerOrder: 'eng.project.order',
  EngineerOrderProduct: 'eng.project.order.product',
  // 审批
  EngineerApprove: 'eng.approve',
  EngineerVisible: 'eng.visible'
  //
};