import {config} from '@/lib/config';export default function robots(){return {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:config.origin+'/sitemap.xml'};}
