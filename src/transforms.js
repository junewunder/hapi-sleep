module.exports = function(server, options) {
  let folderId = 0
  let routeId = 0
  const isRoute = route => typeof route.path === 'string'

  function routesToObject(routes) {
    const folders = {}
    for (let route of routes) {
      const path = route.path
        .replace(options.baseUrl, '')
        .split('/')
        .filter(str => str !== '')

      let previous = null
      let current = folders
      for (let i in path) { i = parseInt(i)
        const part = path[i]
        const last = i === (path.length - 1)

        // if the part isn't in the folder structure
          // make it an object is it's not the last part of the path
          // or just dump the route
        if (!current[part]) current[part] = last ? route : {}
        previous = current
        current = current[part]

        // if it's the part is already in the folder structure
        // but we have the last part of the path,
          // make a route called index in the folder,
          // and make the part a folder
        if (last && !isRoute(current)) {
          current._index = route
        }

        // if we have more to go, but the current part is a route,
          // make the current part a folder and
          // put the route into the folder and call it index
        if (!last && isRoute(current)) {
          previous[part] = {}
          previous[part]._index = current
        }

      }
    }
    return folders
  }

  function objectToResources(folders, parentId='__workspace_1__') {
    const names = Object.keys(folders)
    const resources = []

    for (let i in names) { i = parseInt(i)
      const name = names[i]
      const part = folders[name]

      if (isRoute(part)) {

        resources.push(routeToResource(part, name, parentId))

      } else {

        const _id = `__folder_${++folderId}__`
        resources.push({
          _id, parentId, name,
          _type: 'request_group',
          metaSortKey: name.charCodeAt(0),
        })

        resources.push(...objectToResources(part, _id))
      }
    }

    return resources
  }

  function routeToResource(route, name, parentId) {
    const _id = `__request_${++routeId}__`
    const path = route.path.replace(options.baseUrl, '')

    const resource = {
      _id, name, parentId,
      _type: 'request',
      method: route.method,
      url: `{{api}}${path}`,
      metaSortKey: name.charCodeAt(0),
    }

    if (options.forEach) options.forEach(resource, route)

    return resource
  }

  return {
    routesToObject,
    objectToResources,
  }
}
