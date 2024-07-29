import * as z from 'zod'

export function organizeRequirementsPrompt(requirements: string): string {
  return `
    Dado los requerimientos de software siguentes de una aplicación, analiza detalladamente el texto y organiza las ideas en un texto coherente en donde tenga toda la información proporcionada por el ususario.
    Debido a que los requeriemientos son para diseñar una base de datos relacional, no incluyas información innecesaria que no aporte nada al diseño de la misma.       

    REQUERIMIENTOS DEL USUARIO:
    ${requirements}

    Tu respuesta:
  `
}

export function databaseDesignPrompt(requirements: string): string {
  return `
    Dado los requerimientos de una aplicación, los cuales mencionan el funcionamiento principal de la misma y un conjunto de características que describen a la aplicación,
    tu tarea es extraer el cojunto de entidades, propiedades y relaciones que intervienen en un diseño de una base de datos relacional que modele la aplicación. 
    Extrae detalladamente cada entidad, sus propiedades y relaciones entre ellos, mirando principalemente que resuelva todos los casos de uso de la aplicación.
    Devuelve el resultado en formato json y ten en cuenta lo siguente:
    - Para cada entidad menciona además que propiedades son primary key y cuales son foreign key.
    - Si la relacion es "many_to_many" entonces crea una nueva entidad que agrupe la relación entre las dos entidadades.
    - Si la relacion es otra entonces añade el id de una tabla como foreign key de la otra tabla.
    
    -------------------------------------
    Ejemplos:
    - Requerimientos: Quiero desarrollar una red social en donde los usuario puedan interactuar con otros usuarios mediante la creación de posts. Los usuarios pueden dar like y comentar tambien las publicaciones, además que los usuarios pueden seguir a otros usuarios.
    - Respuesta: 
    {
      "design": [
        {
          "nombre": "Usuario",
          "atributos": [
            "id",
            "nombre",
            "email",
            "password"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [],
        },
        {
          "nombre": "Publicacion",
          "atributos": [
            "id",
            "contenido",
            "fecha_creacion",
            "usuario_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"    
            }
          ],
        },
        {
          "nombre": "Comentario",
          "atributos": [
            "id",
            "contenido",
            "fecha_creacion",
            "publicacion_id",
            "usuario_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"    
            },
            {
              "id": "publicacion_id",
              "referencia": "Publicacion(id)"    
            }
          ]
        },
        {
          "nombre": "Usuario_Likes",
          "atributos": [
            "id",
            "usuario_id",
            "publicacion_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"
            },
            {
              "id": "publicacion_id",
              "referencia": "Publicacion(id)"
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

export function extendDatabaseDesignPrompt(requirements: string, databaseDesign: string): string {
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

    -------------------------------------
    Ejemplos:
    - Requerimientos: Quiero desarrollar una red social en donde los usuario puedan interactuar con otros usuarios mediante la creación de posts. Los usuarios pueden dar like y comentar tambien las publicaciones, además que los usuarios pueden seguir a otros usuarios.
    - Diseño de la base de datos: {
      "design": [
        {
          "nombre": "Usuario",
          "atributos": [
            "id",
            "nombre",
            "email",
            "password"
          ],
          "primary_keys": ["id"],
        },
        {
          "nombre": "Publicacion",
          "atributos": [
            "id",
            "contenido",
            "fecha_creacion",
            "usuario_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"    
            }
          ],
        },
        {
          "nombre": "Comentario",
          "atributos": [
            "id",
            "contenido",
            "fecha_creacion",
            "publicacion_id",
            "usuario_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"    
            },
            {
              "id": "publicacion_id",
              "referencia": "Publicacion(id)"    
            }
          ]
        },
        {
          "nombre": "Usuario_Likes",
          "atributos": [
            "id",
            "usuario_id",
            "publicacion_id"
          ],
          "primary_keys": ["id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"
            },
            {
              "id": "publicacion_id",
              "referencia": "Publicacion(id)"
            }
          ]
        }
      ]
    }

    Tu respuesta deberia ser:
    {
      "design": [
        {
          "nombre": "Usuario",
          "atributos": [
            "id",
            "nombre",
            "username",
            "email",
            "password"
          ],
          "primary_keys": ["id"],
        },
        {
          "nombre": "Seguidores",
          "atributos": [
            "usuario_id",
            "seguidor_id"
          ],
          "primary_keys": ["usuario_id", "seguidor_id"],
          "foreign_keys": [
            {
              "id": "usuario_id",
              "referencia": "Usuario(id)"
            },
            {
              "id": "seguidor_id",
              "referencia": "Usuario(id)"
            }
          ],
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

export const dbDesignSchema = z.object({
  design: z.array(
    z.object({
      nombre: z.string(),
      atributos: z.array(z.string()),
      primary_keys: z.array(z.string()),
      foreign_keys: z.array(
        z.object({
          id: z.string(),
          referencia: z.string()
        })
      )
    })
  )
})

export type DbDesign = z.infer<typeof dbDesignSchema>

// Quiero crear una aplicación de chat en la que los usuarios puedan enviar mensajes entre ellos y que estén asociados a una sala de chat.
// Los usuarios pueden tener conversaciones con otros usuarios sólo si son amigos.
// Tambien un usuario puede crear un grupo de varias personas en donde todos puedan hablar con todos en una misma sala.
