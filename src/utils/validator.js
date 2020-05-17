export function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min))
}
export function isLegalUsername(str) {
  let pattern = /^[0-9a-zA-Z_]+$/
  return pattern.test(str)
}
export function isLegalEmail(str) {
  let pattern = new RegExp('^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$', 'g')
  return pattern.test(str)
}
export function isLegalPassword(str) {
  let pattern = new RegExp('^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*]{6,18}$', 'g')
  return pattern.test(str)
}
