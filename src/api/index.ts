import { Where } from "./query"

// request types

export type ApiRequestPostOptions<T> = T

export type ApiRequestGetOptions<T, TWhere extends Where<T>> = {
  where?: TWhere,
  sort?: any,
  select?: any,
  nested?: any,
  exclude?: any,
  limit?: number,
  skip?: number,
  page?: number,
}

export type ApiRequestPutOptions<T> = T

export type ApiRequestDeleteOptions<T, TWhere extends Where<T>> = {
  where: TWhere | undefined
}

// response types

export type ApiResponsePostData<T> = T

export type ApiResponseGetData<T> = T

export type ApiResponseGetListData<T> = {
  payload?: T[],
  pagination?: {
    skip?: number,
    limit?: number,
    count?: number,
    pageCount?: number,
    currentPage?: number,
  }
}

export type ApiResponsePutData<T> = T

export type ApiResponseDeleteData = {
  deletedCount: number
}