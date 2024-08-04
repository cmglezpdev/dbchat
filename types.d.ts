export type ChatMessage = {
  id: number;
  role: 'user' | 'system',
  content: string
}

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
