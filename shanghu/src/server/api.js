import axios from './axios';

/**
 * 新增票种
 */
export const addTicketSort = data => axios.post('/admin/addTicketSort', data);

/**
 * 票种列表
 */
export const ticketSortList = () => axios.get('/admin/ticketSortList', {});

/**
 * 新增阵列组
 */
export const addTvmGroup = data => axios.post('/admin/tvmGroupAdd', data);

/**
 * 更新阵列组
 */
export const updateTvmGroup = data => axios.post('/admin/tvmGroupUpdate', data);

/**
 * 阵列组列表
 */
export const selectTvmGroup = data => axios.post('/admin/tvmGroupList', data);
/**
 * 获取阵列组信息
 */
export const tvmGroupInfo = data => axios.get('/admin/tvmGroupInfo', data);

/**
 * 单元机列表
 */
export const selectTvm = data => axios.post('/admin/tvmList', data);
/**
 * 单元机列表（可以被使用在阵列组的）
 */
export const canUseTvm = data => axios.get('/admin/canUseTvm', data);
/**
 * 新增单元机
 */
export const addTvm = data => axios.post('/admin/tvmAdd', data);

/**
 * 更新单元机
 */
export const updateTvm = data => axios.post('/admin/tvmUpdate', data);
/**
 * 设置单元机的票量
 */
export const setTvmTicketNum = data => axios.post('/admin/setTvmTicketNum', data);
/**
 * 设置单元机的状态
 */
export const setTvmStatus = data => axios.post('/admin/setTvmStatus', data);
/**
 * 设置单元机的票种
 */
export const setTvmTicketSort = data => axios.post('/admin/setTvmTicketSort', data);
/**
 * 单元机详细信息
 */
export const tvmInfo = data => axios.get('/admin/tvmInfo', data);
/**
 * 区域列表
 */
export const areaInfo = data => axios.get('/admin/areaInfo', data);
/**
 * 发布测试刮票任务
 * @param {*} data
 */
export const addTestTask = data => axios.post('/admin/addTestTask', data);

/**
 * 机器操作日志列表
 */
export const tvmLogList = data => axios.get('/admin/tvmLogList', data);
/**
 * 添加单元机到阵列组
 * @param {*} data
 */
export const addTvmTogroup = data => axios.post('/admin/tvmToGroup', data);
/**
 * 当前组下的单元机列表
 */
export const currentTvmList = data => axios.post('/admin/currentTvmList', data);
/**
 * 当前组下的单元机列表名称
 */
export const currentTvmName = data => axios.post('/admin/currentTvmName', data);
/**
 * 移除当前组下的单元机
 */
export const removeTvmFromGroup = data => axios.post('/admin/removeTvmFromGroup', data);
/**
 * 刮奖结果日志
 */
export const drawticketLog = data => axios.get('/admin/drawTicketLogs', data);

/**
 * 测试任务列表
 */
export const testTaskList = data => axios.get('/admin/testTaskList', data);
/**
 * 正式订单列表
 */
export const orderList = data => axios.get('/admin/orderList', data);


/**
 * 登录
 */
export const login = data => axios.post('ceo/auth/login', data);
/**
 * 注销
 */
export const logout = data => axios.get('/admin/logout', data);
/**
 * 获取用户信息
 */
export const userinfo = () => axios.get('ceo/user/info', {});
/**
 * 查询省市区
 */
export const addressSearch = data => axios.post('common/address', data);
/**
 * 商铺列表所有的
 */
export const shopList = () => axios.post('ceo/shop/list', {});
/**
 * 商铺列表可使用的
 */
export const shopListUse = () => axios.post('ceo/shop/lista', {});
/**
 * 添加商铺
 */
export const bindShop = data => axios.post('ceo/shop/bindshop', data);
/**
 * 平台列表
 */
export const platform = () => axios.get('common/platform', {});
/**
 * 添加任务
 */
export const addTaskData = data => axios.post('ceo/task/add', data);
/**
 * 任务列表
 */
export const taskList = data => axios.post('ceo/task/list', data);

/**
 * 任务step2
 */
export const step2 = data => axios.post('ceo/task/step2', data);
/**
 * 支付订单
 */
export const payMent = data => axios.post('ceo/task/payment', data);
