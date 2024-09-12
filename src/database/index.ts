import { Pool, QueryResult } from 'pg';
import { URL } from 'url';

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    throw new Error("process.env.POSTGRES_URL not existe")
}
const url = new URL(connectionString);


const config = {
  user: url.username,
  host: url.hostname,
  database: url.pathname.split('/')[1],
  password: url.password,
  port: parseInt(url.port, 10)
};

const pool = new Pool(config);

let data: any = {}
let def: any = {}
export async function getPool(query: string, params?: string[]): Promise<QueryResult<any>>{
    if(def[query] > Date.now()){
        data[query] = void 0
    }
    data[query] ??= await pool.query(query, params)
    def[query] = Date.now() - 1000 * 60 * 60
    return data[query]
}
export default pool;