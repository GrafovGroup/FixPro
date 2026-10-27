import {env} from 'cloudflare:workers';
export function storage(){const bindings=env as unknown as {DB:D1Database;BUCKET:R2Bucket};if(!bindings.DB||!bindings.BUCKET)throw new Error('Storage unavailable');return bindings;}
