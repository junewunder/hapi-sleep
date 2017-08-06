const Joi = require('joi')

module.exports = (server) => {
  server.route({
    method: 'GET',
    path: '/api/v1/sounds/cat',
    config: {
      validate: {
        query: { loud: Joi.boolean().required() }
      },
    },
    handler(request, reply) {
      reply({ sound: request.query.loud ? 'MEOW' : 'meow' })
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v1/sounds/dog',
    config: {
      validate: {
        query: { loud: Joi.boolean().required() }
      },
    },
    handler(request, reply) {
      reply({ sound: request.query.loud ? 'WOOF' : 'woof' })
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v1/sounds/birb',
    config: {
      validate: {
        query: { loud: Joi.boolean().required() }
      },
    },
    handler(request, reply) {
      reply({ sound: request.query.loud ? 'SQUAW' : 'squaw' })
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v1/looks/birb',
    handler(request, reply) {
      reply({ look: 'birbs are cute!!!' })
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v1/looks/{animal}',
    handler(request, reply) {
      reply({ look: `${request.params.animal} looks cute!!!` })
    }
  })

  server.route({
    method: 'GET',
    path: '/api/v1/animals/',
    handler(request, reply) {
      reply({ animals: ['cat', 'dog'] })
    }
  })
}
