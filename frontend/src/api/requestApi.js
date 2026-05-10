import axiosClient from './axiosClient'

export const createRequestApi = (payload) => axiosClient.post('/requests', payload)
export const getMyRequestsApi = () => axiosClient.get('/requests/my')
export const getAllRequestsApi = (params) => axiosClient.get('/admin/requests', { params })
export const updateRequestStatusApi = (id, payload) =>
  axiosClient.patch(`/admin/requests/${id}/status`, payload)
export const deleteRequestApi = (id) => axiosClient.delete(`/admin/requests/${id}`)