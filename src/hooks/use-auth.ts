import { useMutation } from '@tanstack/react-query'
import { authApi } from '~/services'
import type { LoginData, ResponseData, TypeUserSchema, User } from '~/types'

export const useLogin = (onSuccessCallback?: () => void) => {
    const {
        data,
        mutate: login,
        isPending: loading,
        error
    } = useMutation<LoginData, ResponseData<null> | undefined, Pick<TypeUserSchema, 'email' | 'password'>>({
        mutationFn: async (credentials) => {
            const { data } = await authApi('public').login(credentials)
            if (!data?.data?.user) throw new Error('Login failed: user data not found')
            return {
                user: data.data.user,
                accessToken: data.data.accessToken
            }
        },
        onSuccess: () => {
            onSuccessCallback?.()
        }
    })

    return { data, login, loading, error }
}

export const useRegister = (onSuccessCallback?: () => void) => {
    const {
        mutate: register,
        isPending: loading,
        error
    } = useMutation<User | null, ResponseData<null> | undefined, Pick<TypeUserSchema, 'name' | 'email' | 'password'>>({
        mutationFn: async (userData: Pick<TypeUserSchema, 'name' | 'email' | 'password'>): Promise<User | null> => {
            const { data } = await authApi('public').register(userData)
            return data.data
        },
        onSuccess: (data) => {
            if (data) {
                onSuccessCallback?.()
            }
        }
    })

    return {
        register,
        loading,
        error
    }
}

export const useLogout = (onSuccessCallback?: () => void) => {
    const {
        data,
        mutate: logout,
        isPending: loading,
        error
    } = useMutation<void, ResponseData<null> | undefined, void>({
        mutationFn: async () => {
            await authApi('private').logout()
        },
        onSuccess: () => {
            onSuccessCallback?.()
        }
    })

    return { data, logout, loading, error }
}
