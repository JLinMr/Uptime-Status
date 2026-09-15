export default {
  access: {
    showPassword: '显示密码',
    hidePassword: '隐藏密码',
    checking: '正在验证…',
    password: '访问密码',
    login: '进入面板',
    logout: '退出登录',
    retry: '重试',
    wrong: '密码不正确',
    connection: '无法验证访问权限，请检查服务端配置或网络连接。'
  },
  common: {
    title: '状态监控',
    refreshIn: '刷新时间',
    refresh: '刷新',
    noData: '暂无数据',
    loading: '加载中...'
  },
  header: {
    logo: 'Logo'
  },
  stats: {
    totalWebsites: '监控网站',
    allWebsites: '全部网站',
    normalWebsites: '正常网站',
    accessNormal: '访问正常',
    abnormalWebsites: '异常网站',
    accessAbnormal: '访问异常',
    avgUptime: '平均可用率',
    last30Days: '最近30天'
  },
  card: {
    avgResponseTime: '平均响应时间',
    last24Hours: '最近24小时',
    clickToLoad: '点击查看趋势',
    avgUptime: '平均运行时间',
    lastDays: '最近{days}天',
    downtimeRecords: '故障记录',
    noRecentDowntime: '近期无故障记录',
    duration: '持续时间',
    responseTimeTrend: '响应时间趋势',
    daysAgo: '30天前',
    today: '今日',
    noDowntime: '运行正常',
    downtimeInfo: '最近{days}天 {count} 次故障，总计{duration}',
    currentOffline: '当前离线'
  },
  status: {
    online: '在线',
    paused: '暂停',
    preparing: '准备中',
    offline: '离线'
  },
  error: {
    fetchFailed: '获取监控数据失败，请稍后重试',
    rateLimit: 'API 限流，{seconds} 秒后重试…',
    rateLimitRetry: '限流中，已显示缓存，{seconds} 秒后重新获取',
    rateLimitWait: 'API 限流，请 {seconds} 秒后再试'
  },
  sort: {
    friendlyName: '名称',
    createDateTime: '时间',
    status: '状态',
    asc: '升序',
    desc: '降序'
  },
  errorMessages: {
    333333: '连接超时',
    444444: '无响应',
    100001: 'DNS解析失败',
    98: '离线状态',
    99: '失联状态',
    default: '连接异常'
  },
  footer: {
    version: '版本',
    poweredBy: '基于',
    uptimeRobot: 'UptimeRobot',
    apiInterface: '接口',
    checkFrequency: '检测频率 5 分钟',
    copyright: '版权所有',
    duration: '约{hours}小时',
    hours: '{h}小时',
    minutes: '{m}分钟',
    seconds: '{s}秒'
  },
  monitorType: {
    HTTP: 'HTTP',
    HTTPS: 'HTTPS',
    KEYWORD: 'Keyword',
    PING: 'PING',
    PORT: 'Port',
    HEARTBEAT: 'Heartbeat',
    default: 'Monitor'
  }
}