export class FormError extends Error {
  constructor (data) {
    super('FormError')
    this.data = data
  }
}
