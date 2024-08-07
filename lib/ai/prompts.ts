import { DbDesign } from '@/types'

interface IPrompts {
  organizeRequirementsPrompt(requirements: string, database: string): string
  updateRequirementsPrompt(userRequirements: string, databaseDesign: object): string
  databaseDesignPrompt(requirements: string, database: string, styles?: string): string
  extendDatabaseDesignPrompt(requirements: string, databaseDesign: object, styles?: string): string
  updateDatabasePrompt(dbDesign: DbDesign, changes: string, styles?: string): string
  generateDescriptionAboutDbChanges(prevDbDesign: object, newDbDesign: object, changesRequired: string): string
  generateSQLCommandsPrompt(jsonDbDesign: DbDesign, database: string, styles?: string): string
  updateSQLDesignPrompt(oldJsonDesign: DbDesign, newJsonDesign: DbDesign, oldSqlDbDesign: string, changes: string, database: string, styles?: string): string
  getDbDesignDescriptionPrompt(design: DbDesign, requirements: string): string
}

export const Prompts = (lang: string): IPrompts => {
  switch (lang) {
    case 'en':
      return new EnglishPrompts()
    case 'es':
      return new SpanishPrompts()
    default:
      throw new Error('Invalid language')
  }
}

class SpanishPrompts implements IPrompts {
  organizeRequirementsPrompt(requirements: string, database: string): string {
    return `
      Dado los requerimientos de software siguentes de una aplicación, analiza detalladamente el texto y organiza las ideas en un texto coherente en donde tenga toda la información proporcionada por el ususario.
      Debido a que los requeriemientos son para diseñar una base de datos ${database}, no incluyas información innecesaria que no aporte nada al diseño de la misma.       
  
      REQUERIMIENTOS DEL USUARIO:
      ${requirements}
  
      Tu respuesta:
    `
  }

  updateRequirementsPrompt(userRequirements: string, databaseDesign: object): string {
    return `
      Dado una descripción de los requerimientos para el diseño de una base de datos para una aplicación y el diseño creado, tu tarea actualizar dichos requerimientos, cambiando el nombre de las entidades y propiedades mensionadas por las definidas en el diseño hecho.

      REQUERIMIENTOS DEL USUARIO:
      ---------------------------
      ${userRequirements}
      ---------------------------
      
      DISEÑO DE LA BASE DE DATOS:
      ${JSON.stringify(databaseDesign)}

      TU RESPUESTA:
    `
  }

  databaseDesignPrompt(requirements: string, database: string, styles?: string): string {
    return `
      Dado los requerimientos de una aplicación, los cuales mencionan el funcionamiento principal de la misma y un conjunto de características que describen a la aplicación,
      tu tarea es extraer el conjunto de entidades, propiedades y relaciones que intervienen en un diseño de una base de datos ${database} que modele la aplicación. 
      Extrae detalladamente cada entidad, sus propiedades y relaciones entre ellos, mirando principalemente que resuelva todos los casos de uso de la aplicación.
      Devuelve el resultado en formato json y ten en cuenta lo siguente:
      - Para cada entidad menciona además que propiedades son primary key y cuales son foreign key.
      - Si la relacion es "many_to_many" entonces crea una nueva entidad que agrupe la relación entre las dos entidadades.
      - Si la relacion es otra entonces añade el id de una tabla como foreign key de la otra tabla.
      - Los primery keys de las entidades deben ser llamados solo como id siempre que sea posible.

      ${styles ? `Al diseñar la base de datos ten en cuenta los estilos y lineamientos de diseño establecidos por el usuario:\n${styles}` : ''}
      
      -------------------------------------
      Ejemplos:
      - Requerimientos: Quiero desarrollar una red social en donde los usuario puedan interactuar con otros usuarios mediante la creación de posts. Los usuarios pueden dar like y comentar tambien las publicaciones, además que los usuarios pueden seguir a otros usuarios.
      - Respuesta: 
      {
        "design": [
          {
            "name": "User",
            "attributes": [
              "id",
              "name",
              "email",
              "password"
            ],
            "primary_keys": ["id"],
            "foreign_keys": []
          },
          {
            "name": "Post",
            "attributes": [
              "id",
              "content",
              "creation_date",
              "user_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              }
            ]
          },
          {
            "name": "Comment",
            "attributes": [
              "id",
              "content",
              "creation_date",
              "post_id",
              "user_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              },
              {
                "id": "post_id",
                "reference": "Post(id)"
              }
            ]
          },
          {
            "name": "User_Likes",
            "attributes": [
              "id",
              "user_id",
              "post_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              },
              {
                "id": "post_id",
                "reference": "Post(id)"
              }
            ]
          }
        ]
      }
  
      -------------------------------------
  
      REQUERIMIENTOS DEL USUARIO:
      ${requirements}
  
      TU RESPUESTA:
    `
  }

  extendDatabaseDesignPrompt(requirements: string, databaseDesign: object, styles?: string): string {
    return `
      Dado los requerimientos de una aplicación y un primer diseño de una base de datos relacional que modele dicha aplicación, tu tarea es analizar detalladamente los requerimientos del usuario y el diseño de la base de datos que se dió.
      Utiliza tus conocimientos relacionados con el tipo de aplicación y añade entidades importantes con sus correspondientes propiedades y relaciones que sean importantes para el diseño de la aplicación y no hallan sido añadidas.
      A la hora de añadir una nueva entidad ten presente si realmente es necesaria para la aplicaición o por el contrario solo es un complemento extra que no es impresindible.
      Por ejemplo si es un chat deben tener principalmente los usuarios y mensajes, ademas los usuarios deberían tener un username, etc.
      Si es un ecommerce deberían tener productos, ordenes, categorías, carrito, usuarios, etc.
  
      Devuelve el resultado en formato json y ten en cuenta lo siguente para tu respuesta.
      - Devuelve solo las entidades que no existen previamente o las que tienen alguna actualización en sus atributos o relaciones.
      - Si la entidad es nueva entonces añádela a la respuesta
      - Si la entidad ya existe pero tiene alguna actualización entonces añádela completamente a la respuesta, con todas sus propiedades y relaciones incluyendo las nuevas modificaciones
      En ambos casos mantén una consistencia en los nombres de las entidades y propiedades
      - Mantén el mismo formato que el diseño de base de datos proporcionado.
  
      ${styles ? `Al diseñar la base de datos ten en cuenta los estilos y lineamientos de diseño establecidos por el usuario:\n${styles}` : ''}
      
      -------------------------------------
      Ejemplos:
      - Requerimientos: Quiero desarrollar una red social en donde los usuario puedan interactuar con otros usuarios mediante la creación de posts. Los usuarios pueden dar like y comentar tambien las publicaciones, además que los usuarios pueden seguir a otros usuarios.
      - Diseño de la base de datos: {
        "design": [
          {
            "name": "User",
            "attributes": [
              "id",
              "name",
              "email",
              "password"
            ],
            "primary_keys": ["id"]
          },
          {
            "name": "Post",
            "attributes": [
              "id",
              "content",
              "creation_date",
              "user_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              }
            ]
          },
          {
            "name": "Comment",
            "attributes": [
              "id",
              "content",
              "creation_date",
              "post_id",
              "user_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              },
              {
                "id": "post_id",
                "reference": "Post(id)"
              }
            ]
          },
          {
            "name": "User_Likes",
            "attributes": [
              "id",
              "user_id",
              "post_id"
            ],
            "primary_keys": ["id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              },
              {
                "id": "post_id",
                "reference": "Post(id)"
              }
            ]
          }
        ]
      }
  
  
      Tu respuesta deberia ser:
      {
        "design": [
          {
            "name": "User",
            "attributes": [
              "id",
              "name",
              "username",
              "email",
              "password"
            ],
            "primary_keys": ["id"]
          },
          {
            "name": "Followers",
            "attributes": [
              "user_id",
              "follower_id"
            ],
            "primary_keys": ["user_id", "follower_id"],
            "foreign_keys": [
              {
                "id": "user_id",
                "reference": "User(id)"
              },
              {
                "id": "follower_id",
                "reference": "User(id)"
              }
            ]
          }
        ]
      }
  
  
    -------------------------------------
  
      REQUERIMIENTOS DE LA APLICACIÓN:
      ${requirements}
  
      DISEÑO DE LA BASE DE DATOS:
      ${JSON.stringify(databaseDesign)}
    
      TU RESPUESTA:
    `
  }

  updateDatabasePrompt(dbDesign: DbDesign, changes: string, styles?: string) {
    return `
      Dado el siguiente esquema de una base de datos, actualiza el esquema según los siguientes cambios:
      ${changes}
      Devuelve solo el esquema actualizado en formato json respetando el mismo formato, propiedades, nombres, etc.
  
      ${styles ? `Al diseñar la base de datos ten en cuenta los estilos y lineamientos de diseño establecidos por el usuario:\n${styles}` : ''}

      ESQUEMA DE BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(dbDesign)}
  
      TU RESPUESTA:
    `
  }

  generateDescriptionAboutDbChanges(prevDbDesign: object, newDbDesign: object, changesRequired: string) {
    return `
      Dado los cambios requeridos por un usuario, la versión previa de la base de datos y la versión nueva con los cambios hechos, genérame una descripción detalla de los cambios que se hicieron al diseño de la base de datos.
      - El diseño de la base de datos está en formato JSON y los cambios requeridos es el input del usuario. 
      - No me devuelvas en la descripción algún tipo de diseño, json, código u otra cosa, solo devuelve la explicación en lenguage natural de los cambios realizados.
      - Al mensionar el nombre de alguna entidad o propiedad de los diseños, no traduzcas el nombre, refierete a ellos con su mismo nombre. 

      CAMBIOS REQUERIDOS POR EL USUARIO
      ${changesRequired}
  
      VERSION PREVIA DEL MODELO DE LA BASE DE DATOS
      ${JSON.stringify(prevDbDesign)}
  
      VERSION NUEVA CON LOS CAMBIOS SOLICITADOS POR EL USUARIO DE LA BASE DE DATOS
      ${JSON.stringify(newDbDesign)}
  
      TU RESPUESTA:
    `
  }

  generateSQLCommandsPrompt(jsonDbDesign: DbDesign, database: string, styles?: string) {
    return `
      Dado el siguiente esquema de una base de datos ${database}, genera los commandos de sql necesarios para crear todas esas tablas, propiedades y relaciones.
      Devuelve solo el código sql necesario. No añadas ninguna información extra.
  
      ${styles ? `Al diseñar la base de datos ten en cuenta los estilos y lineamientos de diseño establecidos por el usuario:\n${styles}` : ''}

      ESQUEMA DE BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(jsonDbDesign)}
  
      TU RESPUESTA:
    `
  }

  updateSQLDesignPrompt(oldJsonDesign: DbDesign, newJsonDesign: DbDesign, oldSqlDbDesign: string, changes: string, database: string, styles?: string) {
    return `
      Dado el siguiente esquema en formato json de una base de datos ${database}, la cual fue actualizada a una nueva versión realizando un conjunto de cambios,
      y un esquema anterior de la base de datos en sql referente a la primera versión de la misma, genere una nueva versión sql del esquema nuevo siguiendo detalladamente los cambios
      hechos del esquema viejo al nuevo y siguiendo detalladamente la descripción de los cambios hechos y tomamando como base el esquema en sql del diseño previo.

      NO generes texto ni nada extra, solo devuelve el sql de la nueva versión de la base de datos que  mejor describe la nueva versión con los cambios realizados.

      ${styles ? `Al diseñar la base de datos ten en cuenta los estilos y lineamientos de diseño establecidos por el usuario:\n${styles}` : ''}

      DISEÑO ANTERIOR DE LA BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(oldJsonDesign)}

      DISEÑO NUEVO DE LA BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(newJsonDesign)}

      EXPLICACIÓN DETALLADA DE LOS CAMBIOS REALIZADOS ENTRE UNA VERSIÓN Y LA OTRA:
      ${changes}

      COMANDOS SQL DE LA VERSIÓN ANTIGUA DE LA BASE DE DATOS:
      ${oldSqlDbDesign}
      
      COMMANDOS SQL DE LA VERSIÓM NUEVA DE LA BASE DE DATOS:
    `
  }

  getDbDesignDescriptionPrompt(design: DbDesign, requirements: string) {
    return `
        Dado el siguiente esquema que representa la modelación de una base de datos para una aplicación con unos requerimientos específicos. 
        Tu tarea es generar una descripción coherente de dicha modelación que explique en que consiste el modelo creado y como resulve los requerimientos del usuario.
        - Solo responde con la información necesaria. NO añadas text adicional para adornar la respuesta.
        - No me devuelvas en la descripción algún tipo de diseño, json, código u otra cosa, solo devuelve la explicación en lenguage natural de los cambios realizados.
        - Al mensionar el nombre de alguna entidad o propiedad de los diseños, no traduzcas el nombre, refierete a ellos con su mismo nombre. 

        
        REQUERIMIENTOS DE LA APLICACIÓN:
        ${requirements}
  
        DISEÑO DE LA BASE DE DATOS:
        ${JSON.stringify(design)}
  
        TU RESPUESTA:
      `
  }
}

class EnglishPrompts implements IPrompts {
  organizeRequirementsPrompt(requirements: string, database: string): string {
    return `
    Given the following software requirements for an application, analyze the text in detail and organize the ideas into a coherent text that contains all the information provided by the user. Since the requirements are for designing a ${database} database, do not include unnecessary information that does not contribute to its design.

    USER REQUIREMENTS:
    ${requirements}

    Your response:
    `
  }

  updateRequirementsPrompt(userRequirements: string, databaseDesign: object): string {
    return `
    Given a description of the requirements for designing a database for an application and the created design, your task is to update these requirements, changing the names of the entities and properties mentioned to those defined in the completed design.

    USER REQUIREMENTS:
    ---------------------------
    ${userRequirements}
    ---------------------------

    DATABASE DESIGN:
    ${JSON.stringify(databaseDesign)}

    YOUR RESPONSE:
    `
  }

  databaseDesignPrompt(requirements: string, database: string, styles?: string): string {
    return `
    Given the requirements of an application, which mention its main functionality and a set of characteristics that describe the application, your task is to extract the set of entities, properties, and relationships involved in a ${database} database design that models the application. Extract in detail each entity, its properties, and relationships between them, mainly looking at solving all use cases of the application.

    Return the result in JSON format and consider the following:
    - For each entity, also mention which properties are primary keys and which are foreign keys.
    - If the relationship is "many_to_many", then create a new entity that groups the relationship between the two entities.
    - If the relationship is something else, then add the id of one table as a foreign key to the other table.
    - The primary keys of the entities should be called just "id" whenever possible.

    ${styles ? `When designing the database, take into account the styles and design guidelines established by the user:\n${styles}` : ''}

    -------------------------------------
    Examples:
    - Requirements: I want to develop a social network where users can interact with other users by creating posts. Users can also like and comment on posts, and users can follow other users.
    - Response:
    "design": [
      {
        "name": "User",
        "attributes": [
          "id",
          "name",
          "email",
          "password"
        ],
        "primary_keys": ["id"],
        "foreign_keys": []
      },
      {
        "name": "Post",
        "attributes": [
          "id",
          "content",
          "creation_date",
          "user_id"
        ],
        "primary_keys": ["id"],
        "foreign_keys": [
          {
            "id": "user_id",
            "reference": "User(id)"
          }
        ]
      },
      {
        "name": "Comment",
        "attributes": [
          "id",
          "content",
          "creation_date",
          "post_id",
          "user_id"
        ],
        "primary_keys": ["id"],
        "foreign_keys": [
          {
            "id": "user_id",
            "reference": "User(id)"
          },
          {
            "id": "post_id",
            "reference": "Post(id)"
          }
        ]
      },
      {
        "name": "User_Likes",
        "attributes": [
          "id",
          "user_id",
          "post_id"
        ],
        "primary_keys": ["id"],
        "foreign_keys": [
          {
            "id": "user_id",
            "reference": "User(id)"
          },
          {
            "id": "post_id",
            "reference": "Post(id)"
          }
        ]
      }
    ]
    -------------------------------------

    USER REQUIREMENTS:
    ${requirements}

    YOUR RESPONSE:
    `
  }

  extendDatabaseDesignPrompt(requirements: string, databaseDesign: object, styles?: string): string {
    return `
    Given the requirements of an application and an initial design of a relational database that models said application, your task is to analyze in detail the user requirements and the given database design. Use your knowledge related to the type of application and add important entities with their corresponding properties and relationships that are important for the application design and have not been added.

    When adding a new entity, consider if it is really necessary for the application or if it is just an extra complement that is not essential. For example, if it's a chat, they should mainly have users and messages,... also users should have a username, etc. If it's an e-commerce, they should have products, orders, categories, cart, users, etc.

    Return the result in JSON format and consider the following for your response:
    - Return only the entities that do not exist previously or those that have some update in their attributes or relationships.
    - If the entity is new, then add it to the response
    - If the entity already exists but has some update, then add it completely to the response, with all its properties and relationships including the new modifications
    In both cases, maintain consistency in the names of entities and properties
    - Maintain the same format as the provided database design.

    ${styles ? `When designing the database, take into account the styles and design guidelines established by the user:\n${styles}` : ''}

    -------------------------------------
    Examples:
    - Requirements: I want to develop a social network where users can interact with other users by creating posts. Users can also like and comment on posts, and users can follow other users.
    - Database design:
    {
      "design": [
        {
          "name": "User",
          "attributes": [
            "id",
            "name",
            "email",
            "password"
          ],
          "primary_keys": ["id"]
        },
        {
          "name": "Post",
          "attributes": [
            "id",
            "content",
            "creation_date",
            "user_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "user_id",
              "reference": "User(id)"
            }
          ]
        },
        {
          "name": "Comment",
          "attributes": [
            "id",
            "content",
            "creation_date",
            "post_id",
            "user_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "user_id",
              "reference": "User(id)"
            },
            {
              "id": "post_id",
              "reference": "Post(id)"
            }
          ]
        },
        {
          "name": "User_Likes",
          "attributes": [
            "id",
            "user_id",
            "post_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "user_id",
              "reference": "User(id)"
            },
            {
              "id": "post_id",
              "reference": "Post(id)"
            }
          ]
        }
      ]
    }

    Your response should be:
    "design": [
      {
        "name": "User",
        "attributes": [
          "id",
          "name",
          "username",
          "email",
          "password"
        ],
        "primary_keys": ["id"]
      },
      {
        "name": "Followers",
        "attributes": [
          "user_id",
          "follower_id"
        ],
        "primary_keys": ["user_id", "follower_id"],
        "foreign_keys": [
          {
            "id": "user_id",
            "reference": "User(id)"
          },
          {
            "id": "follower_id",
            "reference": "User(id)"
          }
        ]
      }
    ]
    -------------------------------------

    APPLICATION REQUIREMENTS:
    ${requirements}

    DATABASE DESIGN:
    ${JSON.stringify(databaseDesign)}

    YOUR RESPONSE:
    `
  }

  updateDatabasePrompt(dbDesign: DbDesign, changes: string, styles?: string) {
    return `
    Given the following database schema, update the schema according to these changes:
    ${changes}

    Return only the updated schema in JSON format respecting the same format, properties, names, etc.

    ${styles ? `When designing the database, take into account the styles and design guidelines established by the user:\n${styles}` : ''}

    DATABASE SCHEMA IN JSON FORMAT:
    ${JSON.stringify(dbDesign)}

    YOUR RESPONSE:
    `
  }

  generateDescriptionAboutDbChanges(prevDbDesign: object, newDbDesign: object, changesRequired: string) {
    return `
    Given the changes required by a user, the previous version of the database, and the new version with the changes made, generate a detailed description of the changes made to the database design.
    - The database design is in JSON format and the required changes are the user's input.
    - Do not return any type of design, JSON, code, or anything else in the description, only return the explanation in natural language of the changes made.
    - When mentioning the name of any entity or property of the designs, do not translate the name, refer to them by their same name.

    CHANGES REQUIRED BY THE USER
    ${changesRequired}

    PREVIOUS VERSION OF THE DATABASE MODEL
    ${JSON.stringify(prevDbDesign)}

    NEW VERSION WITH THE CHANGES REQUESTED BY THE USER OF THE DATABASE
    ${JSON.stringify(newDbDesign)}

    YOUR RESPONSE:
    `
  }

  generateSQLCommandsPrompt(jsonDbDesign: DbDesign, database: string, styles?: string) {
    return `
    Given the following ${database} database schema, generate the necessary SQL commands to create all those tables, properties, and relationships.
    Return only the necessary SQL code. Do not add any extra information.

    ${styles ? `When designing the database, take into account the styles and design guidelines established by the user:\n${styles}` : ''}

    DATABASE SCHEMA IN JSON FORMAT:
    ${JSON.stringify(jsonDbDesign)}

    YOUR RESPONSE:
    `
  }

  updateSQLDesignPrompt(oldJsonDesign: DbDesign, newJsonDesign: DbDesign, oldSqlDbDesign: string, changes: string, database: string, styles?: string) {
    return `
    Given the following schema in JSON format of a ${database} database, which was updated to a new version by making a set of changes, and a previous schema of the database in SQL referring to the first version of it, generate a new SQL version of the new schema following in detail the changes made from the old schema to the new one and following in detail the description of the changes made and taking as a base the SQL schema of the previous design.

    DO NOT generate text or anything extra, just return the SQL of the new version of the database that best describes the new version with the changes made.

    ${styles ? `When designing the database, take into account the styles and design guidelines established by the user:\n${styles}` : ''}

    PREVIOUS DATABASE DESIGN IN JSON FORMAT:
    ${JSON.stringify(oldJsonDesign)}

    NEW DATABASE DESIGN IN JSON FORMAT:
    ${JSON.stringify(newJsonDesign)}

    DETAILED EXPLANATION OF THE CHANGES MADE BETWEEN ONE VERSION AND THE OTHER:
    ${changes}

    SQL COMMANDS OF THE OLD VERSION OF THE DATABASE:
    ${oldSqlDbDesign}

    SQL COMMANDS OF THE NEW VERSION OF THE DATABASE:
    `
  }

  getDbDesignDescriptionPrompt(design: DbDesign, requirements: string) {
    return `
    Given the following schema that represents the modeling of a database for an application with specific requirements. Your task is to generate a coherent description of said modeling that explains what the created model consists of and how it solves the user's requirements.
    - Only respond with the necessary information. DO NOT add additional text to embellish the response.
    - Do not return any type of design, JSON, code, or anything else in the description, only return the explanation in natural language of the changes made.
    - When mentioning the name of any entity or property of the designs, do not translate the name, refer to them by their same name.

    APPLICATION REQUIREMENTS:
    ${requirements}

    DATABASE DESIGN:
    ${JSON.stringify(design)}

    YOUR RESPONSE:
    `
  }
}
