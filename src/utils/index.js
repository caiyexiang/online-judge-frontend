export function _debounce(fn, delay) {
  delay = delay || 600
  let timer
  return function() {
    let ctx = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(ctx, args)
    }, delay)
  }
}

export function parseTime(time) {
  const date = new Date(time)
  const format = '{y}-{m}-{d} {h}:{i}:{s}'
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

export function parseSeconds(seconds) {
  let h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  let m = Math.floor(Math.floor(seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  let s = Math.floor(seconds % 60)
    .toString()
    .toString()
    .padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function compareTime(t1, t2) {
  const date1 = new Date(t1)
  const date2 = new Date(t2)
  return date1 > date2 ? 1 : 0
}

export const getDefaultProblem = () => {
  return { 0: [], 1: [], 2: [], 3: [], 4: [] }
}

export const getDefaultScore = () => {
  return { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} }
}
