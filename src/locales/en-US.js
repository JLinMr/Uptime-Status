export default {
  access: {
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    checking: 'Verifying…',
    password: 'Access password',
    login: 'Sign in',
    logout: 'Sign out',
    retry: 'Retry',
    wrong: 'Incorrect password',
    connection: 'Unable to verify access. Check the server configuration or connection.'
  },
  common: {
    title: 'Status Monitor',
    refreshIn: 'Refresh in',
    refresh: 'Refresh',
    noData: 'No Data',
    loading: 'Loading...'
  },
  header: {
    logo: 'Logo'
  },
  stats: {
    totalWebsites: 'Total Websites',
    allWebsites: 'All Websites',
    normalWebsites: 'Normal Websites',
    accessNormal: 'Access Normal',
    abnormalWebsites: 'Abnormal Websites',
    accessAbnormal: 'Access Abnormal',
    avgUptime: 'Avg Uptime',
    last30Days: 'Last 30 Days'
  },
  card: {
    avgResponseTime: 'Avg Response Time',
    last24Hours: 'Last 24 Hours',
    clickToLoad: 'Click for trend',
    avgUptime: 'Avg Uptime',
    lastDays: 'Last {days} Days',
    downtimeRecords: 'Downtime Records',
    noRecentDowntime: 'No Recent Downtime',
    duration: 'Duration',
    responseTimeTrend: 'Response Time Trend',
    daysAgo: '30 Days Ago',
    today: 'Today',
    noDowntime: 'Running Normally',
    downtimeInfo: '{count} downtime(s) in last {days} days, total {duration}',
    currentOffline: 'Currently Offline'
  },
  status: {
    online: 'Online',
    paused: 'Paused',
    preparing: 'Preparing',
    offline: 'Offline'
  },
  error: {
    fetchFailed: 'Failed to fetch monitoring data, please try again later',
    rateLimit: 'Rate limited, retrying in {seconds}s…',
    rateLimitRetry: 'Rate limited, showing cache, retrying in {seconds}s…',
    rateLimitWait: 'Rate limited, please try again in {seconds}s'
  },
  sort: {
    friendlyName: 'Name',
    createDateTime: 'Time',
    status: 'Status',
    asc: 'Ascending',
    desc: 'Descending'
  },
  errorMessages: {
    333333: 'Connection Timeout',
    444444: 'No Response',
    100001: 'DNS Resolution Failed',
    98: 'Offline Status',
    99: 'Disconnected Status',
    default: 'Connection Error'
  },
  footer: {
    version: 'Version',
    poweredBy: 'Powered by',
    uptimeRobot: 'UptimeRobot',
    apiInterface: 'API',
    checkFrequency: 'Check frequency 5 minutes',
    copyright: 'Copyright',
    duration: 'About {hours} hours',
    hours: '{h}h',
    minutes: '{m}m',
    seconds: '{s}s'
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