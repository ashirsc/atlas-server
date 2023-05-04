import axios from "axios";

//  const getPineconeClient = () => {
if (!process.env.PINECONE_API_KEY) {
  throw new Error("PINECONE_API_KEY is not set");
}

const client = axios.create({
  baseURL: "https://imessage-mem-30db765.svc.us-east1-gcp.pinecone.io",
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.PINECONE_API_KEY,
  },
});

//  }

// wirte upsert function
export const upsert = async (id: string, vector: number[], options?: {metadata?: any, nameSpace?:string}) => {
  try {

    // console.log(vector.join(","))
    
    const response = await client.post(`/vectors/upsert`, {
      vectors: [
        {
          id,
          values: vector,
          metadata: options?.metadata,
        },
      ],
      namespace: options?.nameSpace,
    });
    return response.data;
  } catch (error) {
    
    console.log(error)
    return
  }
  };

interface QueryOptions {
    topK: number;
    includeMetadata: boolean;
    includeValues: boolean;
    namespace: string;
}
export const query = async  (vector:number[], options?:QueryOptions) => { 

    const topK = options?.topK ?? 3;
    const includeMetadata = options?.includeMetadata ?? false;
    const includeValues = options?.includeValues ?? false;
    const namespace = options?.namespace ?? "";
    
    const response = await client.post(`/query`, {
        vector,
        topK,
        includeMetadata,
        includeValues,
        namespace
    })

    return response.data;

 }





        
    
