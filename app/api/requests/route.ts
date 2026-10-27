import {requestSchema,MAX_PHOTOS,MAX_PHOTO_SIZE,PHOTO_TYPES} from '@/lib/request-schema';
import {storage} from '@/lib/storage';
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'This request must be submitted from the FixPro website.'},{status:403});
 if(Number(request.headers.get('content-length')||0)>32*1024*1024)return Response.json({error:'Your upload is too large. Use up to 6 photos, 5 MB each.'},{status:413});
 let uploaded:string[]=[];let store:ReturnType<typeof storage>|undefined;
 try{
  const form=await request.formData();if(form.get('website'))return Response.json({error:'Unable to accept this request.'},{status:400});
  let raw;try{raw=JSON.parse(String(form.get('payload')||''));}catch{return Response.json({error:'Please check the request details and try again.'},{status:400});}
  const result=requestSchema.safeParse(raw);if(!result.success)return Response.json({error:result.error.issues[0].message},{status:400});
  const data=result.data; const files=form.getAll('photos').filter((f):f is File=>typeof f!=='string'&&f.size>0);
  if(files.length>MAX_PHOTOS||files.some(f=>f.size>MAX_PHOTO_SIZE||!PHOTO_TYPES.includes(f.type)))return Response.json({error:'Use up to 6 JPG, PNG or WebP photos, each no larger than 5 MB.'},{status:400});
  store=storage();const existing=await store.DB.prepare('SELECT id FROM requests WHERE id = ?').bind(data.id).first();if(existing)return Response.json({id:data.id,status:'received'});
  for(const file of files){const bytes=new Uint8Array(await file.arrayBuffer());const jpeg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP';if(!(jpeg||png||webp))throw new Error('INVALID_PHOTO');const key=`requests/${data.id}/${crypto.randomUUID()}`;await store.BUCKET.put(key,bytes,{httpMetadata:{contentType:jpeg?'image/jpeg':png?'image/png':'image/webp'}});uploaded.push(key);}
  await store.DB.prepare('INSERT INTO requests (id, kind, category, city, status, payload, photo_keys, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').bind(data.id,data.kind,data.category,data.city,'received',JSON.stringify(data),JSON.stringify(uploaded),new Date().toISOString()).run();
  return Response.json({id:data.id,status:'received'},{status:201});
 }catch(error){if(store&&uploaded.length)await store.BUCKET.delete(uploaded).catch(()=>{});console.error('Request persistence failed',error instanceof Error?error.message:'unknown');return Response.json({error:error instanceof Error&&error.message==='INVALID_PHOTO'?'One photo could not be read. Please use a valid JPG, PNG or WebP image.':'Your request could not be saved. Your details are still here; please try again or call FixPro.'},{status:503});}
}
