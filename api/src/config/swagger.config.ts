import swaggerJsDoc from 'swagger-jsdoc';

interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
      contact: {
        name: string;
        email: string;
      };
    };
    servers: Array<{
      url: string;
      description: string;
    }>;
    components: {
      schemas: {
        Post: {
          type: string;
          required: string[];
          properties: {
            _id: {
              type: string;
              description: string;
            };
            title: {
              type: string;
              description: string;
            };
            content: {
              type: string;
              description: string;
            };
            author: {
              type: string;
              description: string;
            };
            createdAt: {
              type: string;
              format: string;
              description: string;
            };
            updatedAt: {
              type: string;
              format: string;
              description: string;
            };
          };
        };
        PostResponse: {
          type: string;
          properties: {
            posts: {
              type: string;
              items: {
                $ref: string;
              };
            };
            currentPage: {
              type: string;
            };
            totalPages: {
              type: string;
            };
            totalPosts: {
              type: string;
            };
          };
        };
      };
    };
  };
  apis: string[];
}

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog dos Professores API',
      version: '1.0.0',
      description: 'API para gerenciamento de conteúdo educacional',
      contact: {
        name: 'Suporte',
        email: 'joandeitos@outlook.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Post: {
          type: 'object',
          required: ['title', 'content', 'author'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID do post'
            },
            title: {
              type: 'string',
              description: 'Título do post'
            },
            content: {
              type: 'string',
              description: 'Conteúdo do post'
            },
            author: {
              type: 'string',
              description: 'ID do autor'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização'
            }
          }
        },
        PostResponse: {
          type: 'object',
          properties: {
            posts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Post'
              }
            },
            currentPage: {
              type: 'integer'
            },
            totalPages: {
              type: 'integer'
            },
            totalPosts: {
              type: 'integer'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Atualizado para arquivos .ts
};

export default swaggerJsDoc(options); 