import request from '@/utils/request'

export function getPublicProperty() {
  return request({
    url: '/api/publicProperty/get',
    method: 'get'
  })
}

export function editPublicProperty(data) {
  return request({
    url: '/api/publicProperty/edit',
    method: 'post',
    data
  })
}
