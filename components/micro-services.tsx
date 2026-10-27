import Link from '@/components/site-link';
import {Action} from '@/components/site';
import {RequestSection} from '@/components/request-form';
import {microServices,microServicePath,type MicroService} from '@/data/micro-services';
import {localMicroServices} from '@/data/local-micro-services';
import {locations,locationPath,provinces} from '@/data/locations';
import {services} from '@/data/services';

type Location = typeof locations[number];
type LocalContent = typeof localMicroServices[number];
export function MicroServiceLinks({parent,city}:{parent?:string;city?:Location}) {
 const items=microServices.filter(s=>(!parent||s.parent===parent)&&(!city||localMicroServices.some(x=>x.city===city.slug&&x.micro===s.slug)));
 if(!items.length)return null;
 return <section className="container section"><div className="section-heading"><div><span className="eyebrow">Specific repairs</span><h2>{city?`Repair help in ${city.name}`:'Find the repair you need.'}</h2></div><p>Choose the issue for assessment details, what to include and the next step.</p></div><div className="service-grid compact">{items.map(s=><Link className="service-card" key={s.slug} href={city?`${locationPath(city)}${s.slug}/`:microServicePath(s)}><h3>{s.name}</h3><p>{s.summary}</p><span className="text-link">View repair details ↗</span></Link>)}</div></section>;
}
export function MicroServiceContent({micro,location,local}:{micro:MicroService;location?:Location;local?:LocalContent}) {
 const parent=services.find(s=>s.slug===micro.parent)!;
 const province=location?provinces.find(p=>p[0]===location.province)?.[1]:'';
 const related=microServices.filter(s=>s.parent===micro.parent&&s.slug!==micro.slug);
 const cityEntries=localMicroServices.filter(s=>s.micro===micro.slug&&s.city!==location?.slug);
 return <>
  <section className="container section" style={{paddingTop:0}}><div className="content-grid repair-copy"><div><h2>{local?.heading||'What is happening at the property?'}</h2>{local?local.paragraphs.map(t=><p key={t}>{t}</p>):<p>{micro.intro}</p>}<h3>Problems to describe</h3><ul className="plain-list">{micro.symptoms.map(t=><li key={t}>{t}</li>)}</ul><Action href="#request">Request This Repair</Action></div><aside><h3>{location?`Plan the visit in ${location.name}`:'Before you send a request'}</h3><ul className="plain-list">{(local?.checklist||micro.prepare).map(t=><li key={t}>{t}</li>)}</ul><p>Availability, the appropriate trade, access and the scope are confirmed before scheduling. A request does not confirm an appointment.</p></aside></div></section>
  <section className="soft section"><div className="container content-grid repair-copy"><div><h2>What the assessment covers</h2><p>{micro.assessment}</p>{local&&<><h3>Useful details and photos</h3><ul className="plain-list">{micro.prepare.map(t=><li key={t}>{t}</li>)}</ul></>}</div><div><h3>Scope and practical limits</h3><p>{micro.limits}</p><p>Pricing, any assessment fee and work authorization are agreed before service. For several properties, include a site reference and on-site contact for each request.</p><Link className="text-link" href="/commercial/national-accounts/">Multi-location repair coordination →</Link></div></div></section>
  <section className="container section"><h2>{micro.name}: common questions</h2><div className="faq-list">{micro.faq.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
  <section className="container section" style={{paddingTop:0}}><h2>Related repair help</h2><div className="link-grid"><Link href={`/services/${parent.slug}/`}>All {parent.name.toLowerCase()} services ↗</Link>{related.map(s=><Link key={s.slug} href={location&&localMicroServices.some(x=>x.city===location.slug&&x.micro===s.slug)?`${locationPath(location)}${s.slug}/`:microServicePath(s)}>{s.name} ↗</Link>)}{location&&<Link href={locationPath(location)}>More repairs in {location.name} ↗</Link>}{location&&<Link href={microServicePath(micro)}>{micro.name} service guide ↗</Link>}</div>{!location&&cityEntries.length>0&&<><h3 style={{marginTop:40}}>Local job planning</h3><div className="link-grid">{cityEntries.map(entry=>{const city=locations.find(l=>l.slug===entry.city)!;return <Link key={city.slug} href={`${locationPath(city)}${micro.slug}/`}>{micro.name} in {city.name==='London'?'London, Ontario':city.name} ↗</Link>})}</div></>}</section>
  <RequestSection city={location?.name} province={province} category={parent.name} task={micro.name}/>
 </>;
}
