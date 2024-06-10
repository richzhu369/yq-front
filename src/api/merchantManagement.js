import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/merchant/get',
    method: 'get',
    params: query
  })
}

export function createProgress(query) {
  return request({
    url: '/api/merchant/createProgress',
    method: 'get',
    params: {
      merchantName: query
    }
  })
}

export function createMerchant(data) {
  return request({
    url: '/api/merchant/create',
    method: 'post',
    data: data
  })
}

export function fetchLogList(query) {
  return request({
    url: '/api/ingress/fetchWhitelistLogs',
    method: 'get',
    params: query
  })
}
