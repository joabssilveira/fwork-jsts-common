import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosStatic } from "axios";
import { ApiResponseDeleteData, ApiResponseGetListData, ApiResponsePostData, ApiResponsePutData } from "../api";
import { Where } from "../api/query";

export interface ApiClientGetOptions<DataType, WhereType extends Where<DataType>> {
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
}

export interface IApiClientResult<T> {
  data?: T
  success?: boolean
  msg?: string
}

export class ApiClientUtils {
  static getErrorMessage(error: any) {
    return typeof error === 'string' ? error :
      (error as AxiosError).response?.data || (error as AxiosError).message || (error as any).data || (error as any).message || (error as any).msg
  }

  static async post<DataType, ResponseType>(args: {
    apiUrl: string,
    data: DataType | undefined,
    axios?: AxiosStatic | AxiosInstance,
    status?: number[],
    config?: AxiosRequestConfig<DataType> | undefined
  }): Promise<IApiClientResult<ApiResponsePostData<ResponseType>>> {
    const result: IApiClientResult<ApiResponsePostData<ResponseType>> = {}

    try {
      const response = await (args.axios || axios).post(args.apiUrl, args.data, args.config)

      if ((args.status?.indexOf(response.status) || [200, 201].indexOf(response.status)) != -1) {
        if (response.data)
          result.data = response.data as ApiResponsePostData<ResponseType>
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }

  static async get<DataType, WhereType extends Where<DataType>>(args: {
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
  }): Promise<IApiClientResult<ApiResponseGetListData<DataType>>> {
    const result: IApiClientResult<ApiResponseGetListData<DataType>> = {}
    result.data = {}

    try {
      const response = await (args.axios || axios).get<ApiResponseGetListData<DataType>>(args.apiUrl, {
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
        result.data = response.data as ApiResponseGetListData<DataType>
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error) {
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
  }): Promise<IApiClientResult<ApiResponsePutData<ResponseType>>> {
    const result: IApiClientResult<ApiResponsePutData<ResponseType>> = {}

    try {
      const response = await (args.axios || axios).put(args.apiUrl, args.data, args.config)

      if (args.status?.indexOf(response.status) != -1 || response.status === 200) {
        if (response.data)
          result.data = response.data as ApiResponsePutData<ResponseType>
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error) {
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
  }): Promise<IApiClientResult<ApiResponseDeleteData>> {
    const result: IApiClientResult<ApiResponseDeleteData> = {}

    try {
      const response = await (args.axios || axios).delete(`${args.apiUrl}/${args.key}`, args.config)

      if (args.status?.indexOf(response.status) != -1 || response.status === 200) {
        result.data = response.data as ApiResponseDeleteData
        result.success = true
      }
      else {
        result.success = false
      }
    } catch (error) {
      result.success = false
      result.msg = ApiClientUtils.getErrorMessage(error)
    }

    return result
  }
}

export abstract class BaseApiClient<DataType, KeyType, WhereType extends Where<DataType>, PostResponseType, PutResponseType> {
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
  }): Promise<IApiClientResult<ApiResponsePostData<PostResponseType>>> {
    return ApiClientUtils.post<DataType, ApiResponsePostData<PostResponseType>>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      ...args,
    })
  }

  async get(args?: ApiClientGetOptions<DataType, WhereType>): Promise<IApiClientResult<ApiResponseGetListData<DataType>>> {
    return ApiClientUtils.get<DataType, WhereType>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      ...args,
    })
  }

  async put(args: {
    data: DataType,
    status?: number[],
    config?: AxiosRequestConfig<DataType> | undefined
  }): Promise<IApiClientResult<ApiResponsePutData<PutResponseType>>> {
    return ApiClientUtils.put<DataType, PutResponseType>({
      apiUrl: this.apiUrl,
      axios: this.axios,
      ...args,
    })
  }

  async delete(args: {
    key: KeyType,
    config?: AxiosRequestConfig<DataType> | undefined
    status?: number[],
  }): Promise<IApiClientResult<ApiResponseDeleteData>> {
    return ApiClientUtils.delete({
      apiUrl: `${this.apiUrl}`,
      axios: this.axios,
      ...args,
    })
  }
}