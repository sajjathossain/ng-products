import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';

export const productSchema = {
  title: 'products schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    price: {
      type: 'number',
    },
    createdAt: {
      type: 'string',
      default: new Date(),
    },
  },
  required: ['name', 'price', 'createdAt'],
} as const;

export const productSchemaTyped = toTypedRxJsonSchema(productSchema);
export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof productSchemaTyped
>;
export const PRODUCT_SCHEMA: RxJsonSchema<ProductDocType> = productSchema;
