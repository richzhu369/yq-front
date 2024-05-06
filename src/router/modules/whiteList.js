/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cwWhitelist = {
  path: '/whitelist',
  component: Layout,
  redirect: '/whitelist/complex-table',
  name: 'whitelist',
  meta: {
    title: 'whitelist',
    icon: 'table'
  },
  children: [
    {
      path: 'cw-whitelist',
      component: () => import('@/views/table/white-list'),
      name: 'cw-whitelist',
      meta: { title: '财务白名单' }
    }
  ]
}
export default cwWhitelist
