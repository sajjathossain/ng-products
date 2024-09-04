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
      minimum: 1,
    },
    quantity: {
      type: 'number',
      minimum: 1,
    },
    category: {
      type: 'string',
      minLength: 1,
    },
    createdAt: {
      type: 'string',
      minLength: 1,
    },
  },
  attachments: {
    encrypted: true,
  },
  required: ['name', 'price', 'createdAt', 'category', 'quantity'],
} as const;

export const productSchemaTyped = toTypedRxJsonSchema(productSchema);
export type ProductDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof productSchemaTyped
>;
export const PRODUCT_SCHEMA: RxJsonSchema<ProductDocType> = productSchema;
