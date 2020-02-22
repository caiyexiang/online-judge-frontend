/**
 * @author PanJiaChen
 * @description 在生产模式下预览文件的打包情况和运行情况
 */

const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
  const report = rawArgv.includes('--report')

  run(`vue-cli-service build ${args}`)

  const port = 8849
  const publicPath = config.publicPath

  var express = require('express')
  var serveStatic = require('serve-static')
  const app = express()

  app.use(
    publicPath,
    serveStatic('./dist', {
      index: ['index.html', '/'],
    }),
  )

  app.listen(port, function() {
    console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
    if (report) {
      console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
    }
  })
} else {
  run(`vue-cli-service build ${args}`)
}
