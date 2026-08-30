import { neon } from '@neondatabase/serverless';
const sql = neon('postgresql://neondb_owner:npg_Z3byav2rcgnB@ep-morning-shadow-a41evzje-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require');
const m = await sql`SELECT id, title, price, currency, images FROM machines WHERE id = 4`;
console.log(JSON.stringify(m[0], null, 2));
