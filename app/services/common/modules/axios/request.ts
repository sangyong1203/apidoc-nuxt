import type { AxiosRequestConfig, Method, ResponseType } from 'axios'
import { useUserStore } from '~/stores/UserStore'
import { forEach, get, isArray, isBoolean, isEmpty, isNil, isNumber, isObject, keys, replace, set } from 'lodash'

type KeyValue = { [key: string]: string | number | boolean | undefined | null }
export type PathVariables = { [key: string]: any }
export type Params = { [key: string]: any }

export interface PayloadModel {
    path?: any
    query?: KeyValue
    body?: any
}

const replaceUrl = (url: string, pathVariables?: PathVariables) => {
    let result = url
    if (isNil(pathVariables)) return result
    forEach(keys(pathVariables), key => {
        result = replace(result, `{${key}}`, get(pathVariables, key))
    })
    return result
}
const getDataCleansing = (obj: any, filedName: string) => {
    const data = get(obj, filedName)
    if (isEmpty(data)) return

    const result = {}
    forEach(keys(data), key => {
        const value = get(data, key)
        if (isBoolean(value) || isNumber(value)) {
            set(result, key, value)
            return
        }
        if (isNil(value)) return
        set(result, key, value)
    })
    if (isEmpty(result)) return
    return result
}
export const makeRequiredRequestConfig = (method: Method) => {
    return (props: { url: string; opt?: RequestOption }): AxiosRequestConfig => {
        const { url, opt } = props
        const { headers = {}, payload, responseType } = opt ?? {}

        const path = get(payload, 'pathVariables')
            ? get(payload, 'pathVariables', {})
            : getDataCleansing(payload, 'path')
        const data =
            !isObject(payload?.body) || payload?.body instanceof FormData || isArray(payload?.body)
                ? payload?.body
                : getDataCleansing(payload, 'body')
        const params = get(payload, 'params') ? get(payload, 'params', {}) : getDataCleansing(payload, 'query')

        const { getAuthToken, loggedInUser } = useUserStore()

        return {
            url: replaceUrl(url, path),
            method,
            headers: {
                Authorization: getAuthToken,
                SystemId: 'IM',
                validateKey: loggedInUser.validateKey,
                ...headers,
            },
            data,
            params,
            responseType,
        } as AxiosRequestConfig
    }
}

export type RequestOption = {
    headers?: any
    payload?: PayloadModel
    responseType?: ResponseType
    auth?: boolean
    progress?: boolean
}
