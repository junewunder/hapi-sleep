const Hapi = require('hapi')
const Joi = require('joi')

const server = new Hapi.Server()
server.connection({ port: 3000 })

require('./routes')(server)

server.register({
  register: require('../'),
  options: {
    baseUrl: '/api/v1',
    name: 'Example Project'
  }
}, () => {

  server.start(() => {

    console.log(`Server running at: ${ server.info.uri }`);

    // server.stop()
  })
})
