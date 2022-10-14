const swaggerAutogen = require('swagger-autogen')({openapi: "3.0.0"})

const doc = {
   info: {
      version: "1.0.0",
      title: "API Library",
      description: "Contain all api from kulony backend"
   },
   host: "localhost:4000",
   securityDefinitions: {
      bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
      }
   },
   security: [{
      "bearerAuth": []
   }]
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./server.js']

swaggerAutogen(outputFile, endpointsFiles, doc)