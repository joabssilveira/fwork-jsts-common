export interface IApiResult<T> {
  data?: T
  success?: boolean
  msg?: string
}

export interface IApiGetResult<T> {
  payload?: T,
  pagination?: {
    skip?: number,
    limit?: number,
    count?: number,
    pageCount?: number,
    currentPage?: number,
  }
}

export interface IApiGetResultExt<T> extends IApiResult<IApiGetResult<T>> {

}