const pkg = require('./package.json')
const util = require('util')
const fs = require('fs')
const path = require('path')

const rootExport = {
  "_type": "export",
  "__export_format": 3,
  "__export_date": (new Date(Date.now())).toISOString(),
  "__export_source": `hapi-sleep:${pkg.version}`,
  "resources": [{
    "_type": "workspace",
    "_id": "__workspace_1__",
  }]
}

/* *
 * options: {
 *  baseUrl: string,
 *  name: string,
 *  fileOutput: false default
 * }
 */
exports.register = function (server, options, next) {
  const transforms = require('./src/transforms')(server, options)
  // console.log(util.inspect(server.table(), false, 3))
  const [{ info, labels, table }] = server.table()

  const routes = table.filter(elem => elem.path.startsWith(options.baseUrl))
  const folders = transforms.routesToObject(routes)

  rootExport.resources[0].name = options.name

  rootExport.resources.push({
    _id: '__environment_1__',
    _type: 'environment',
    parentId: '__workspace_1__',
    name: options.name,
    data: Object.assign({
      api: `${server.info.uri}${options.baseUrl}`
    }, options.environment)
  })

  rootExport.resources.push(...transforms.objectToResources(folders))

  const exportPath = path.join(process.cwd(), 'export.json')
  if (options.fileOutput) fs.writeFileSync(exportPath, JSON.stringify(rootExport), err => {
    console.log('err', err)
  })

  server.route({
    method: 'GET',
    path: '/insomnia',
    config: { auth: false },
    handler(request, reply) { reply(rootExport) }
  })

  console.log(`Import insomia config from ${server.info.uri}/insomnia`);

  next()
}

exports.register.attributes = {
  pkg: require('./package.json')
}
