// lib/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventSpark API',
      version: '1.0.0',
      description: 'Auto-generated Swagger documentation for EventSpark project',
    },
  },
  apis: ['../app/api/**/*.ts'],
  components: {
  schemas: {
    Event: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        title: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        location: { type: 'object' },
        ticketTypes: { type: 'array', items: { type: 'object' } },
        isPublic: { type: 'boolean' },
        formConfig: { type: 'object' },
        bannerUrl: { type: 'string' },
        brochureUrl: { type: 'string' },
        speakerImages: { type: 'array', items: { type: 'string' } },
        organizer: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          }
        },
        status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer'
    }
  }
}
 // Adjust if your route files are elsewhere
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
