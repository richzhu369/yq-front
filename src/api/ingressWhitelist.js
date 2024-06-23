import request from '@/utils/request'

export function opIP(data) {
  return request({
    url: '/api/ingress/whitelist',
    method: 'post',
    data
  })
}

export function fetchList(query) {
  return request({
    url: '/api/ingress/fetchWhitelist',
    method: 'get',
    params: query
  })
}

export function fetchLogList(query){
  return request({
    url: '/api/ingress/fetchWhitelistLogs',
    method: 'get',
    params: query
  })
}

export function getStatus(query) {
  return request({
    url: '/api/ingress/getStatus',
    method: 'get',
    params: query
  })
}
