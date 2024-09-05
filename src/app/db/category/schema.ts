import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema,
} from 'rxdb';

export const categorySchema = {
  title: 'category schema',
  version: 0,
  type: 'object',
  primaryKey: 'name',
  properties: {
    name: {
      type: 'string',
      maxLength: 200,
    },
    currentQuantity: {
      type: 'number',
    },
    products: {
      type: 'array',
      ref: 'products',
      items: {
        type: 'string',
      },
    },
  },
  required: ['name', 'products', 'currentQuantity'],
} as const;

export const categorySchemaTyped = toTypedRxJsonSchema(categorySchema);
export type CategoryDocType = ExtractDocumentTypeFromTypedRxJsonSchema<
  typeof categorySchemaTyped
>;
export const CATEGORY_SCHEMA: RxJsonSchema<CategoryDocType> = categorySchema;
