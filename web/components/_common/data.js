//考试
export const examTyArr = [{name: '考试', value: 'exam'}, {name: "竞赛答题", value: 'answer'}];
export const examTyObj = {
  'exam': "考试",
  'answer': '竞赛答题'
};

export const examQuestionTyArr = [{name: '单选', value: 'radio'}, {name: "多选", value: 'check'}, {
  name: "判断",
  value: 'judge'
}];
export const examQuestionTyObj = {
  'radio': '单选',
  'check': '多选',
  'judge': '判断'
};

export const taskStatusArr = [{name: '未发布', value: 'unpublish'}, {name: "发布", value: 'publish'}];
export const taskStatusObj = {
  'publish': '发布',
  'unpublish': '未发布'
}


// 优惠券--开始
export const couponInfoStatusArr = [
  {name: '未发布', value: 'editing'},
  {name: '未开始', value: 'waiting'},
  {name: '有效', value: 'valid'},
  {name: '已过期', value: 'expired'},
];

export const couponInfoStatusObj = {
  editing: '未发布',
  waiting: '未开始',
  valid: '有效',
  expired: '已过期'
};

export const couponInfoTyArr = [
  {name: '现金', value: 'cash'},
  {name: '打折', value: 'discount'},
  {name: '满减', value: 'full-reduction'}
];

export const couponInfoTyObj = {
  cash: '现金',
  discount: '打折',
  'full-reduction': '满减'
};

export const couponInfoProdTypeLimitArr = [
  {name: '所有', value: 'all'},
  {name: '旅行团', value: 'tour'},
  {name: '门票', value: 'ticket'}
];

export const couponInfoProdTypeLimitObj = {
  all: '所有',
  tour: '旅行团',
  ticket: '门票'
};

export const couponInfoProdArr = [
  {name: '无限制', value: 'unlimit'},
  {name: '有限制', value: 'limit'},
];

export const couponInfoProdObj = {
  unlimit: '无限制',
  limit: '有限制',
};

// 优惠券--结束

// 标签管理--开始
export const tagTy = {
  1: '文字',
  2: '图片'
}
//标签管理--结束

//房间类型--开始
export const roomTypeObj = {
  1: '单人一房',
  2: '双人一房',
  3: '三人一房',
  4: '四人一房',
  5: '儿童房',
  6: '配房',
  7: '一日游成人价',
  8: '一日游儿童价',
};
export const roomTypeArr = [
  {name: "单人一房", value: 1},
  {name: "双人一房", value: 2},
  {name: "三人一房", value: 3},
  {name: "四人一房", value: 4},
  {name: "儿童房", value: 5},
  {name: "配房", value: 6},
  {name: "一日游成人价", value: 7},
  {name: "一日游儿童价", value: 8},
];

export const ageTypeArr = [
  {name: "全部", value: 'all'},
  {name: "成人", value: 'audlt'},
  {name: "儿童", value: 'child'},
];
//房间类型--结束

//限时抢购--开始
//审核状态
export const fsAuditStatusArr = [
  {name: "未审核", value: 'waiting'},
  {name: "审核通过", value: 'succ'},
  {name: "审核未通过", value: 'fail'},
];
//发布状态
export const fsPublishStatusArr = [
  {name: "未发布", value: 'waiting'},
  {name: "发布", value: 'succ'},
  {name: "结束", value: 'end'},
  {name: "完成", value: 'finish'},
];

export const fsPublishStatusObj = {
  'waiting': '未发布',
  'succ': '发布',
  'end': '结束',
  'finish': '完成'
};
//限时抢购--结束