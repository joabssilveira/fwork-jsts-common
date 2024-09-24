import { IDbGetResult } from 'fwork.db.typescript/dbClient'

export interface IApiResult<T> {
  data?: T
  success?: boolean
  msg?: string
}

export interface IApiGetResult<T> extends IDbGetResult<T> {
  
}

export interface IApiGetResultExt<T> extends IApiResult<IApiGetResult<T>> {
  
}