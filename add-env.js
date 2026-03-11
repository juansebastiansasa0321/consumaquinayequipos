const { spawnSync } = require('child_process');

// Use the unpooled URL with only sslmode=require (no channel_binding)
// The neon serverless driver uses WebSockets and doesn't support channel_binding
const url = 'postgresql://neondb_owner:npg_jyI7elH5brdu@ep-winter-flower-ah8k70wr.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const result = spawnSync(
    'npx',
    ['vercel', 'env', 'add', 'POSTGRES_URL', 'production'],
    {
        input: url,
        encoding: 'utf8',
        shell: true
    }
);
console.log(result.stdout);
console.error(result.stderr);
