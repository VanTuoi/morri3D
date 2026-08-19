type Role = 'user' | 'admin'

export interface User {
    id: string
    roles: Role[]
    name: string
    email: string
    avatar: string
    phone: string
    gender: string
    date_of_birth: string
    created_at: string
    updated_at: string
}

export interface LoginData {
    user: User
    accessToken: string
}

export interface Category {
    id: string
    name: string
    created_at: string
    updated_at?: string
}

export interface Course {
    id: string
    image?: string
    name: string
    category?: Category
    created_at: string
    updated_at?: string
}

export interface CourseQueryParams {
    page?: number | string
    limit?: number | string
    sort_by?: 'name' | 'created_at'
    order?: 'asc' | 'desc'
    name?: string
}
