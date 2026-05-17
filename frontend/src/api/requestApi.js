import axiosClient from './axiosClient'

export const createRequestApi = (payload) => axiosClient.post('/requests', payload)
export const getMyRequestsApi = () => axiosClient.get('/requests/my-requests')
export const getRequestByIdApi = (requestId) => axiosClient.get(`/requests/${requestId}`)
export const getAllRequestsApi = (filters) => axiosClient.get('/requests/all', { params: filters })
export const updateRequestStatusApi = (requestId, payload) => axiosClient.patch(`/requests/${requestId}/status`, payload)
export const deleteRequestApi = (requestId) => axiosClient.delete(`/requests/${requestId}`)
export const addCommentApi = (requestId, payload) => axiosClient.post(`/requests/${requestId}/comments`, payload)
export const getCommentsApi = (requestId) => axiosClient.get(`/requests/${requestId}/comments`)
export const getAnalyticsApi = () => axiosClient.get('/requests/admin/analytics')
export const exportRequestsApi = (filters) => axiosClient.get('/requests/export', { params: filters, responseType: 'blob' })
export const getAuditsApi = () => axiosClient.get('/requests/admin/audit')