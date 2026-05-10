import axiosClient from './axiosClient'

export const getProfileApi = () => axiosClient.get('/users/profile')
export const updateProfileApi = (payload) => axiosClient.put('/users/profile', payload)