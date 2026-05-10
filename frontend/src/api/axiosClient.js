import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const axiosClient = axios.create({
  baseURL,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('srm_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      'Something went wrong. Please try again.'

    const normalizedError = new Error(message)
    normalizedError.status = error.response?.status
    throw normalizedError
  }
)

export default axiosClient