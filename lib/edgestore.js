import { EdgeStore } from '@edgestore/sdk';

const edgeStore = new EdgeStore({
  apiKey: process.env.EDGESTORE_API_KEY,
});

export default edgeStore;