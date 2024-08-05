import { Message } from 'ai'

export type Entity = {
  name: string;
  attributes: string[];
  primary_keys: string[];
  foreign_keys: {
    id: string;
    reference: string
  }[];
}

export type DbDesign = {
  design: Entity[];
}

export type Config = {
  model: string;
  apiKey: string;
  database: string;
}

export type BodyType = {
  message: Message,
  jsonDesign: DbDesign
  sqlDesign: string
  config: Config
}
