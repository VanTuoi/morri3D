export interface Errors {
  [field: string]: string[]
}

export interface Meta {
  total_pages: number
  total_items: number
  page: number
  limit: string
}
export interface ResponseData<T> {
  message: string
  success: boolean
  meta?: Meta
  data: T
  errors: Errors
}
