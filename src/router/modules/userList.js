/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userList = {
  path: '/userList',
  component: Layout,
  redirect: '/table/complex-table',
  name: 'Table',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'userList',
      component: () => import('@/views/table/user-list.vue'),
      name: 'userList',
      meta: { title: '用户列表' }
    }
  ]
}
export default userList
