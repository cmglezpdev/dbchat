import { DbDesign } from '@/types'

export class Prompts {
  static organizeRequirementsPrompt(requirements: string, database: string): string {
    return `
      Dado los requerimientos de software siguentes de una aplicación, analiza detalladamente el texto y organiza las ideas en un texto coherente en donde tenga toda la información proporcionada por el ususario.
      Debido a que los requeriemientos son para diseñar una base de datos ${database}, no incluyas información innecesaria que no aporte nada al diseño de la misma.       
  
      REQUERIMIENTOS DEL USUARIO:
      ${requirements}
  
      Tu respuesta:
    `
  }

  static databaseDesignPrompt(requirements: string, database: string, styles?: string): string {
    return `
      Dado los requerimientos de una aplicación, los cuales mencionan el funcionamiento principal de la misma y un conjunto de características que describen a la aplicación,
      tu tarea es extraer el conjunto de entidades, propiedades y relaciones que intervienen en un diseño de una base de datos ${database} que modele la aplicación. 
      Extrae detalladamente cada entidad, sus propiedades y relaciones entre ellos, mirando principalemente que resuelva todos los casos de uso de la aplicación.
      Devuelve el resultado en formato json y ten en cuenta lo siguente:
      - Para cada entidad menciona además que propiedades son primary key y cuales son foreign key.
      - Si la relacion es "many_to_many" entonces crea una nueva entidad que agrupe la relación entre las dos entidadades.
      - Si la relacion es otra entonces añade el id de una tabla como foreign key de la otra tabla.
      - Los primery keys de las entidades deben ser llamados solo como id siempre que sea posible.
      - Los nombres de las entidades deben ser en plurar
      - Todos los nombres de las entidades, propiedades y demas deben estar en ingles

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

  static extendDatabaseDesignPrompt(requirements: string, databaseDesign: string, styles?: string): string {
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
      ${databaseDesign}
    
      TU RESPUESTA:
    `
  }

  static updateDatabasePrompt(dbDesign: DbDesign, changes: string) {
    return `
      Dado el siguiente esquema de una base de datos, actualiza el esquema según los siguientes cambios:
      ${changes}
      Devuelve solo el esquema actualizado en formato json respetando el mismo formato, propiedades, nombres, etc.
  
      ESQUEMA DE BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(dbDesign)}
  
      TU RESPUESTA:
    `
  }

  static generateDescriptionAboutDbChanges(prevDbDesign: object, newDbDesign: object, changesRequired: string) {
    return `
      Dado los cambios requeridos por un usuario, la versión previa de la base de datos y la versión nueva con los cambios hechos, genérame una descripción detalla de los cambios que se hicieron al diseño de la base de datos.
      El diseño de la base de datos está en formato JSON y los cambios requeridos es el input del usuario:
      
      CAMBIOS REQUERIDOS POR EL USUARIO
      ${changesRequired}
  
      VERSION PREVIA DEL MODELO DE LA BASE DE DATOS
      ${JSON.stringify(prevDbDesign)}
  
      VERSION NUEVA CON LOS CAMBIOS SOLICITADOS POR EL USUARIO DE LA BASE DE DATOS
      ${JSON.stringify(newDbDesign)}
  
      TU RESPUESTA:
    `
  }

  static generateSQLCommandsPrompt(jsonDbDesign: DbDesign, database: string) {
    return `
      Dado el siguiente esquema de una base de datos ${database}, genera los commandos de sql necesarios para crear todas esas tablas, propiedades y relaciones.
      Devuelve solo el código sql necesario. No añadas ninguna información extra.
  
      ESQUEMA DE BASE DE DATOS EN FORMATO JSON:
      ${JSON.stringify(jsonDbDesign)}
  
      TU RESPUESTA:
    `
  }

  static updateSQLDesignPrompt(oldJsonDesign: DbDesign, newJsonDesign: DbDesign, oldSqlDbDesign: string, changes: string, database: string) {
    return `
      Dado el siguiente esquema en formato json de una base de datos ${database}, la cual fue actualizada a una nueva versión realizando un conjunto de cambios,
      y un esquema anterior de la base de datos en sql referente a la primera versión de la misma, genere una nueva versión sql del esquema nuevo siguiendo detalladamente los cambios
      hechos del esquema viejo al nuevo y siguiendo detalladamente la descripción de los cambios hechos y tomamando como base el esquema en sql del diseño previo.

      NO generes texto ni nada extra, solo devuelve el sql de la nueva versión de la base de datos que  mejor describe la nueva versión con los cambios realizados.

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

  static getDbDesignDescriptionPrompt(design: DbDesign, requirements: string) {
    return `
        Dado el siguiente esquema que representa la modelación de una base de datos para una aplicación con unos requerimientos específicos. 
        Tu tarea es generar una descripción coherente de dicha modelación que explique en que consiste el modelo creado y como resulve los requerimientos del usuario.
        Solo responde con la información necesaria. NO añadas text adicional para adornar la respuesta.
        
        REQUERIMIENTOS DE LA APLICACIÓN:
        ${requirements}
  
        DISEÑO DE LA BASE DE DATOS:
        ${JSON.stringify(design)}
  
        TU RESPUESTA:
      `
  }
}

// Quiero crear una aplicación de chat en la que los usuarios puedan enviar mensajes entre ellos y que estén asociados a una sala de chat.
// Los usuarios pueden tener conversaciones con otros usuarios sólo si son amigos.
// Tambien un usuario puede crear un grupo de varias personas en donde todos puedan hablar con todos en una misma sala.
