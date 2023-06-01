import { join } from 'node:path'
import axios from 'axios'
import consola from 'consola'
import { readJson } from 'fs-extra'
import { BASE_URL, FETCH_COURSES, FETCH_IF_WATCHED, FETCH_LESSONS, SET_VISIT_LOG, SIGN_IN } from './consts'
import { RequestMethod, RequestStatusCode } from './enums'

let token = ''

export const useConfig = (): Promise<LearnaConfig> => {
  return readJson(join(process.cwd(), 'learna.config.json'))
}

const useFetch = axios.create({
  baseURL: BASE_URL
})

useFetch.interceptors.request.use((config) => {
  if (token) { config.headers.token = token }
  return config
})

useFetch.interceptors.response.use((response) => {
  if (response.data.status === RequestStatusCode.FAILED) {
    const err = new Error(`Request error: ${response.data.msg}`)
    consola.error(err)
    throw err
  }
  return response.data
})

export const useAccessToken = async (conf: LearnaConfig) => {
  const data = { phoneNum: conf.phone, shopId: conf.shopId, vCode: conf.captcha || '9999' }
  const response = await useFetch({ url: SIGN_IN, method: RequestMethod.POST, data })
  token = response.data.sessionId
  return token
}

export const useCourses = async ({ shopId }: LearnaConfig): Promise<Course[]> => {
  const params = { shopId }
  const response = await useFetch({ url: FETCH_COURSES, method: RequestMethod.GET, params })
  const courses = response.data.selectProductVos

  if (!courses?.length) {
    const err = new Error('Do not have courses')
    consola.error(err)
    throw err
  }

  return courses
}

export const useLessons = async ({ shopId }: LearnaConfig, { courseId }: Course): Promise<Lesson[]> => {
  const params = { courseId, shopId }
  const response = await useFetch({ url: FETCH_LESSONS, method: RequestMethod.GET, params })
  return response.data
}

export const useVisitLog = async ({ shopId }: LearnaConfig, { productId }: Course, { lessonsId, videoId, duration: time }: Lesson) => {
  const data = { shopId: Number(shopId), lessonsId, videoId, time, productId, auto: false }
  const response = await useFetch({ url: SET_VISIT_LOG, method: RequestMethod.POST, data })
  return response.data
}

export const useCheck = async ({ shopId }: LearnaConfig, { courseId, productId }: Course, { videoId, duration }: Lesson) => {
  const params = { shopId, courseId, productId, videoId }
  const response = await useFetch({ url: FETCH_IF_WATCHED, method: RequestMethod.GET, params })
  return response.data.watchedDuration >= duration
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => { resolve() }, ms)
  })
}
