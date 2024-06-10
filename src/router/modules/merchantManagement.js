/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const merchantManagement = {
  path: '/createSite',
  component: Layout,
  redirect: '/merchantManagement/complex-table',
  name: 'new site',
  meta: {
    title: '商户管理',
    icon: 'table'
  },
  children: [
    {
      path: 'merchantManagement',
      component: () => import('@/views/table/merchantManagement.vue'),
      name: 'merchantManagement',
      meta: { title: '商户列表' }
    },
    {
      path: 'merchantManagementLog',
      component: () => import('@/views/table/merchantManagement-log.vue'),
      name: 'merchantManagementLog',
      meta: { title: '站点操作日志' }
    }
  ]
}
export default merchantManagement
