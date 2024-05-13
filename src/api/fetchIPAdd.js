import request from '@/utils/request'

export function opIP(data) {
  return request({
    url: 'http://127.0.0.1:8080/api/ingress/whitelist',
    method: 'post',
    data
  })
}

export function getLog() {
  return request({
    url: 'http://127.0.0.1:8080/api/ingress/whitelistLog',
    method: 'get'
  })
}
