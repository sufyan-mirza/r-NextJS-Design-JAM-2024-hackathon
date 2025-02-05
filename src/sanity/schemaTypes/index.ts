import { type SchemaTypeDefinition } from 'sanity'
import { productSchema } from './product'
import orders from './orders'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema,orders],
}
