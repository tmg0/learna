import consola from 'consola'
import { sleep, useAccessToken, useCheck, useConfig, useCourses, useLessons, useVisitLog } from './utils'

const main = async () => {
  const conf = await useConfig()

  await useAccessToken(conf)

  const courses = await useCourses(conf)

  let course = courses[0]

  if (courses.length > 1) {
    const selected = await consola.prompt('Pick a target course', {
      type: 'select',
      options: courses.map(item => ({ label: item.courseName, value: JSON.stringify(item) }))
    })
    course = JSON.parse(selected as any)
  }

  consola.start(`User ${conf.phone} start learning ${course.courseName}...`)

  const src = (await useLessons(conf, course)).filter(({ duration, watchedTime }) => watchedTime < duration)

  for (const item of src) {
    try {
      await useVisitLog(conf, course, item)
      consola.success(`Lesson ${item.videoTitle} log finished.`)
      consola.info('Waiting...')
      for (let n = 0; n < 6; n++) {
        await sleep(30 * 1000)
        if (await useCheck(conf, course, item)) {
          consola.success(`Finished ${item.videoTitle}.`)
          break
        }
        consola.info('Still waiting...')
      }
    } catch {
      break
    }
  }
}

main()
