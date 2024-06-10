/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cwWhitelist = {
  path: '/whitelist',
  component: Layout,
  redirect: '/whitelist/complex-table',
  name: 'whitelist',
  meta: {
    title: '财务类操作',
    icon: 'table'
  },
  children: [
    {
      path: 'cw-whitelist',
      component: () => import('@/views/table/white-list'),
      name: 'cw-whitelist',
      meta: { title: '财务回调白名单' }
    },
    {
      path: 'cw-whitelist-log',
      component: () => import('@/views/table/white-list-log'),
      name: 'cw-whitelist-log',
      meta: { title: '加白日志' }
    }
  ]
}
export default cwWhitelist
