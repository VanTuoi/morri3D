import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { HttpStatusCode } from '~/constants'
import type { LoginData, ResponseData } from '~/types'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

const privateApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

privateApi.interceptors.request.use(
  async (config) => {
    const token = getAccessTokenFromLS()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

publicApi.interceptors.response.use(
  (response) => {
    const { url } = response.config
    const data = response.data as ResponseData<LoginData>

    if (url === '/login') {
      setAccessTokenToLS(data.data.accessToken)
      setProfileToLS(data.data.user)
    }

    return response
  },
  (error: AxiosError) => {
    if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
      const data: any | undefined = error.response?.data
      const message = data?.message || error.message
      toast.error(message)
    }
    return Promise.reject(error.response?.data)
  }
)

privateApi.interceptors.response.use(
  (response) => {
    const { url } = response.config
    if (url === '/logout') {
      clearLS()
    }

    return response
  },
  (error: AxiosError) => {
    if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
      const data: any | undefined = error.response?.data
      const message = data?.message || error.message
      toast.error(message)
    }
    return Promise.reject(error.response?.data)
  }
)

export function apiSelector(type: 'public' | 'private' = 'public') {
  return type === 'public' ? publicApi : privateApi
}
