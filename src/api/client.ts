import axios, { AxiosError } from 'axios'

export const AUTH_TOKEN_KEY = 'jungle_nft_auth_token'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for session expiration and error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      // If token expired, clear token and notify session
      const currentToken = localStorage.getItem(AUTH_TOKEN_KEY)
      if (currentToken) {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        window.dispatchEvent(new CustomEvent('jungle:auth-expired'))
      }
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Ocorreu uma falha na comunicação com o servidor'
    return Promise.reject(new Error(message))
  }
)
