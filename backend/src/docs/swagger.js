// Base configuration for API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notezy API Documentation',
      version: '1.0.0',
      description: 'REST API services for Notezy portals',
      contact: {
        name: 'Developer Support',
        email: 'support@notezy.com'
      }
    },
    servers: [
      {
        url: 'https://notezy-u585.onrender.com/api/',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerOptions;
