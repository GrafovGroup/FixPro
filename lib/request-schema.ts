import {z} from 'zod';
import {requestCategories} from '@/data/services';
import {provinces} from '@/data/locations';
const short=z.string().trim().max(200);
export const requestSchema=z.object({
 id:z.string().uuid(),language:z.enum(['en-CA','fr-CA']).default('en-CA'),task:short.default(''),kind:z.enum(['service','inquiry']).default('service'),category:z.string().refine(v=>requestCategories.includes(v),'Choose a service category.'),description:z.string().trim().min(15,'Please describe the issue in at least 15 characters.').max(5000),
 address:short,city:short.min(2,'Enter the job city.'),province:z.string().refine(v=>provinces.some(p=>p[1]===v)||['Yukon','Northwest Territories','Nunavut'].includes(v),'Choose a province or territory.'),postal:short,
 urgency:z.enum(['Emergency','Today','Within 48 hours','This week','Flexible']),property:z.enum(['Commercial','Residential']),business:short,locations:z.coerce.number().int().min(1).max(100000),reference:short,facility:short,recurring:short,access:short,onsite:short,scheduling:short,
 name:short.min(2,'Enter your name.'),company:short,phone:z.string().trim().refine(v=>/^\+?[\d\s().-]{10,25}$/.test(v)&&v.replace(/\D/g,'').length>=10,'Enter a valid phone number.'),email:z.string().trim().email('Enter a valid email address.').max(254),consent:z.literal(true,{errorMap:()=>({message:'Please agree to be contacted about this request.'})})
}).superRefine((v,c)=>{if(v.kind==='service'){if(v.address.length<5)c.addIssue({code:'custom',path:['address'],message:'Enter the street address.'});if(!/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(v.postal))c.addIssue({code:'custom',path:['postal'],message:'Enter a valid Canadian postal code.'});if(v.property==='Commercial'&&v.business.length<2)c.addIssue({code:'custom',path:['business'],message:'Enter your business name.'});}});
export type ServiceRequest=z.infer<typeof requestSchema>;
export const MAX_PHOTOS=6,MAX_PHOTO_SIZE=5*1024*1024;
export const PHOTO_TYPES=['image/jpeg','image/png','image/webp'];
