import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosStatic } from "axios";
import { IApiGetResult, IApiResult } from "../api";

export class ApiClientUtils {
  static getErrorMessage(error: unknown) {
    return typeof error === 'string' ? error :
      (error as AxiosError).response?.data || (error as AxiosError).message || (error as any).data || (error as any).message || (error as any).msg
  }

  static async post<DataType, ResponseType>(args: {
    apiUrl: string,
    data: DataType | undefined,
    axios?: AxiosStatic | AxiosInstance,
    status?: number[],
    config?: AxiosRequestConfig<DataType> | undefined
  }): Promise<IApiResult<ResponseType>> {
    const result: IApiResult<ResponseType> = {}

    try {
      const response = await (args.axios || axios).post(args.apiUrl, args.data, args.config)

      if ((args.status?.indexOf(response.status) || [200, 201].indexOf(response.status)) != -1) {
        if (response.data)
          result.data = response.data as ResponseType
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error: unknown) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }

  static async get<DataType, WhereType>(args: {
    apiUrl: string,
    axios?: AxiosStatic | AxiosInstance,
    params?: any,
    config?: AxiosRequestConfig<DataType> | undefined
    status?: number[],
    where?: WhereType,
    sort?: any,
    select?: any,
    nested?: any,
    exclude?: any,
    limit?: number,
    skip?: number,
    page?: number,

  }): Promise<IApiResult<IApiGetResult<DataType[]>>> {
    const result: IApiResult<IApiGetResult<DataType[]>> = {}
    result.data = {}

    try {
      const response = await (args.axios || axios).get<IApiGetResult<DataType[]>>(args.apiUrl, {
        params: {
          where: JSON.stringify(args.where),
          sort: JSON.stringify(args.sort),
          select: args.select,
          nested: args.nested,
          exclude: args.exclude,
          limit: args.limit,
          skip: args.skip,
          page: args.page,
          ...args.params,
          ...args.config?.params
        },
        ...args.config
      })

      if (args.status?.indexOf(response.status) != -1 || response.status === 200) {
        result.data = response.data
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error: unknown) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }

  static async put<DataType, ResponseType>(args: {
    apiUrl: string,
    data: DataType,
    axios?: AxiosStatic | AxiosInstance,
    config?: AxiosRequestConfig<DataType> | undefined
    status?: number[],
  }): Promise<IApiResult<ResponseType>> {
    const result: IApiResult<ResponseType> = {}

    try {
      const response = await (args.axios || axios).put(args.apiUrl, args.data, args.config)

      if (args.status?.indexOf(response.status) != -1 || response.status === 200) {
        if (response.data)
          result.data = response.data as ResponseType
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error: unknown) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }

  static async delete<KeyType>(args: {
    apiUrl: string,
    key: KeyType,
    axios?: AxiosStatic | AxiosInstance,
    config?: AxiosRequestConfig<any> | undefined
    status?: number[],
  }) {
    const result: IApiResult<boolean> = {}

    try {
      const response = await (args.axios || axios).delete(`${args.apiUrl}/${args.key}`, args.config)

      if (args.status?.indexOf(response.status) != -1 || response.status === 200) {
        result.data = true
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error: unknown) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }
}

export abstract class BaseApiClient<DataType, KeyType, WhereType, PostResponseType, PutResponseType> {
  axios?: AxiosStatic | AxiosInstance
  apiUrl: string

  constructor(args: {
    apiUrl: string,
    axios?: AxiosStatic | AxiosInstance,
  }) {
    this.apiUrl = args.apiUrl
    this.axios = args.axios
  }

  async post(args: {
    data: DataType,
    status?: number[],
    config?: AxiosRequestConfig<DataType> | undefined
  }): Promise<IApiResult<PostResponseType>> {
    return ApiClientUtils.post<DataType, PostResponseType>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      config: args.config,
      status: args.status,
      data: args.data,
    })
  }

  async get(args?: {
    params?: any,
    config?: AxiosRequestConfig<DataType> | undefined
    status?: number[],
    where?: WhereType,
    sort?: any,
    select?: any,
    nested?: any,
    exclude?: any,
    limit?: number,
    skip?: number,
    page?: number,
  }): Promise<IApiResult<IApiGetResult<DataType[]>>> {
    return ApiClientUtils.get<DataType, WhereType>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      params: args?.params,
      config: args?.config,
      status: args?.status,
      where: args?.where,
      sort: args?.sort,
      select: args?.select,
      nested: args?.nested,
      exclude: args?.exclude,
      limit: args?.limit,
      skip: args?.skip,
      page: args?.page,
    })
  }

  async put(args: {
    data: DataType,
    status?: number[],
    config?: AxiosRequestConfig<DataType> | undefined
  }): Promise<IApiResult<PutResponseType>> {
    return ApiClientUtils.put<DataType, PutResponseType>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      config: args.config,
      status: args.status,
      data: args.data,
    })
  }

  async delete(args: {
    key: KeyType,
    config?: AxiosRequestConfig<DataType> | undefined
    status?: number[],
  }) {
    return ApiClientUtils.delete({
      apiUrl: `${this.apiUrl}`,
      axios: this.axios,
      config: args.config,
      status: args.status,
      key: args.key,
    })
  }
}