import { TIMEOUT_SEC } from './config.js'
const timeout = (seconds) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(`Request took too long! timeout after ${seconds} seconds`)
      )
    }, seconds * 1000)
  })
}
export const getJson = async (url) => {
  try {
    // const res = await fetch(url)
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)])
    const data = await res.json()
    if (!res.ok) throw new Error(`${data.message}`)
    return data
  } catch (err) {
    throw err
  }
}
