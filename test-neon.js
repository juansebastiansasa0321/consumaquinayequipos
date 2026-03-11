const { neon } = require('@neondatabase/serverless');

// Test 1: Without channel_binding
const sql1 = neon('postgresql://neondb_owner:npg_jyI7elH5brdu@ep-winter-flower-ah8k70wr.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require');
sql1`SELECT 1 as alive`.then(r => console.log('UNPOOLED OK:', r)).catch(e => console.error('UNPOOLED FAIL:', e.message));

// Test 2: With pooler
const sql2 = neon('postgresql://neondb_owner:npg_jyI7elH5brdu@ep-winter-flower-ah8k70wr-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require');
sql2`SELECT 1 as alive`.then(r => console.log('POOLED OK:', r)).catch(e => console.error('POOLED FAIL:', e.message));
