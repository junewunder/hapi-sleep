

function routesToObject(routes, baseUrl) {
  const folders = {}
  for (let route of routes) {
    const path = route.path
      .replace(baseUrl, '')
      .split('/')
      .filter(str => str !== '')

    let ref = folders
    for (let i in path) { i = parseInt(i)
      const part = path[i]
      const last = i === (path.length - 1)

      if (!ref[part]) ref[part] = last ? route : {}
      ref = ref[part]
    }
  }
  return folders
}

let folderId = 0
let routeId = 0
const isRoute = route => typeof route.path === 'string'
function objectToResources(folders, baseUrl='/', parentId='__workspace_1__') {
  const names = Object.keys(folders)
  const resources = []

  for (let i in names) { i = parseInt(i)
    const name = names[i]
    const part = folders[name]

    if (isRoute(part)) {

      resources.push(routeToResource(part, baseUrl, i, name, parentId))

    } else {

      const _id = `__folder_${++folderId}__`
      resources.push({
        _id, parentId, name,
        _type: 'request_group',
        metaSortKey: i,
      })

      console.log('part', part)

      resources.push(...objectToResources(
        part,
        baseUrl,
        _id
      ))
    }
  }

  return resources
}

function routeToResource(route, baseUrl, metaSortKey, name, parentId) {
  const _id = `__request_${++routeId}__`
  const path = route.path.replace(baseUrl, '')

  const body = route.method.toLowerCase === '' ? {} : {
      mimeType: 'text/json',
      text: '{\n  \n}'
    }

  return {
    _id, metaSortKey, name, parentId,
    _type: 'request',
    method: route.method,
    url: `{{api}}${path}`,
  }
}

module.exports = {
  routesToObject,
  objectToResources,
}
