/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const publicProperty = {
  path: '/publicProperty',
  component: Layout,
  redirect: '/table/complex-table',
  name: '公共配置',
  meta: {
    title: '公共配置',
    icon: 'el-icon-s-order'
  },
  children: [
    {
      path: 'publicProperty',
      component: () => import('@/views/table/publicProperty.vue'),
      name: '公共配置',
      meta: { title: '公共配置' }
    }
  ]
}
export default publicProperty
