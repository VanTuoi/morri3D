import { z } from 'zod'

export const userSchema = z.object({
    email: z.string().email('Email không hợp lệ').min(1, 'Email không được để trống'),
    name: z
        .string({ required_error: 'Tên không được để trống' })
        .min(1, 'Tên ít nhất 1 kí tự')
        .max(50, 'Tên tối đa 50 kí tự'),
    password: z
        .string({ required_error: 'Mật khẩu không được để trống' })
        .min(8, 'Mật khẩu ít nhất 8 kí tự')
        .max(20, 'Mật khẩu tối đa 20 kí tự')
})

export type TypeUserSchema = z.infer<typeof userSchema>

export const categorySchema = z.object({
    id: z.string().trim().min(1, 'ID danh mục là bắt buộc'),
    name: z.string().trim().min(1, 'Tên danh mục là bắt buộc')
})

export type TypeCategorySchema = z.infer<typeof categorySchema>

export const courseSchema = z.object({
    id: z.string().trim().optional(),
    name: z.string().trim().min(1, 'Tên khoá học là bắt buộc'),
    image: z.string().trim().optional(),
    category: z.string().trim().optional()
})

export type TypeCourseSchema = z.infer<typeof courseSchema>
