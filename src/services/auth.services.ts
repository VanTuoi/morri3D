import type { LoginData, ResponseData, TypeUserSchema, User } from '~/types'
import { apiSelector } from '~/utils'

const URL_LOGIN = '/login'
const URL_REGISTER = '/register'
const URL_LOGOUT = '/logout'

export const authApi = (type: 'public' | 'private' = 'public') => {
  const http = apiSelector(type)
  return {
    login: (user: Pick<TypeUserSchema, 'email' | 'password'>) => http.post<ResponseData<LoginData>>(URL_LOGIN, user),

    register: (user: Pick<TypeUserSchema, 'email' | 'password' | 'name'>) =>
      http.post<ResponseData<User>>(URL_REGISTER, user),

    logout: () => http.post<ResponseData<null>>(URL_LOGOUT)
  }
}
