import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

export function create_user(data) {
  return request({
    url: 'http://127.0.0.1:8080/api/user/new',
    method: 'post',
    data
  })
}

export function delete_user(data) {
  return request({
    url: 'http://127.0.0.1:8080/api/user/delete',
    method: 'delete',
    data
  })
}

export function update_user(data) {
  return request({
    url: 'http://127.0.0.1:8080/api/user/update',
    method: 'put',
    data
  })
}
