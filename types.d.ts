interface LearnaConfig {
  phone: string
  shopId: string
  captcha?: string
}

interface Course {
  productId: number
  courseId: number
  courseName: string
}

interface Lesson {
  isPlayed: string
  videoId: number
  duration: number
  lessonsId: number
  lessonId: number
  videoTitle: string
  watchedTime: number
}
