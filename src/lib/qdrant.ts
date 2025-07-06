import { QdrantClient } from '@qdrant/js-client-rest';

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

export const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'music';
