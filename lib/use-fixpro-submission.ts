'use client';

import {useRef} from 'react';
import {useSubmit} from '@formspree/react';
import {requestSchema, type ServiceRequest} from '@/lib/request-schema';

export const FIXPRO_FORMSPREE_ID = 'mvkgzkqe';

/** Keep the existing backup while using Formspree as the delivery destination. */
export function useFixProSubmission() {
  const sendToFormspree = useSubmit(FIXPRO_FORMSPREE_ID);
  const inFlight = useRef(false);
  const snapshot = useRef<{fingerprint: string; id: string} | null>(null);

  return async function submitRequest(input: unknown, photos: File[] = []) {
    if (inFlight.current) throw new Error('Your request is already being sent.');
    inFlight.current = true;
    try {
      const data = requestSchema.parse(input);
      const fingerprint = JSON.stringify({data, photos: photos.map(f => [f.name, f.size, f.lastModified])});
      if (snapshot.current?.fingerprint !== fingerprint) {
        snapshot.current = {fingerprint, id: snapshot.current ? crypto.randomUUID() : data.id};
      }
      const submission = {...data, id: snapshot.current.id};
      const backup = new FormData();
      backup.set('payload', JSON.stringify(submission));
      photos.forEach(file => backup.append('photos', file));
      const response = await fetch('/api/requests', {method: 'POST', body: backup});
      const saved = await response.json() as {id?: string; error?: string};
      if (!response.ok || !saved.id) throw new Error(saved.error || 'Your request could not be saved. Please try again.');

      const result = await sendToFormspree(formspreeFields(submission, photos));
      if (result.kind === 'error') {
        const errors = [
          ...result.getFormErrors(),
          ...result.getAllFieldErrors().flatMap(([, fields]) => fields),
        ];
        if (errors.some(error => error.code === 'NO_FILE_UPLOADS')) {
          throw new Error('Your details have been saved, but the photos could not be delivered. Please call FixPro with reference ' + submission.id.slice(0, 8).toUpperCase() + ', or remove the photos and try again.');
        }
        throw new Error('Your details have been saved, but delivery was not confirmed. ' + (errors.map(e => e.message).join(' ') || 'Please try again or call FixPro.'));
      }
      return {id: submission.id};
    } finally {
      inFlight.current = false;
    }
  };
}

export function formspreeFields(data: ServiceRequest, photos: File[]) {
  const body = new FormData();
  const fields: Record<string, string> = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company || data.business,
    subject: data.kind === 'service'
      ? `FixPro ${data.urgency === 'Emergency' ? 'URGENT ' : ''}service request — ${data.task || data.category} — ${data.city}`
      : `FixPro inquiry — ${data.city}`,
    message: data.description,
    request_reference: data.id.slice(0, 8).toUpperCase(),
    request_id: data.id,
    request_type: data.kind === 'service' ? 'Service request' : 'Contact inquiry',
    service_category: data.category,
    specific_repair: data.task,
    street_address: data.address,
    city: data.city,
    province: data.province,
    postal_code: data.postal,
    preferred_timing: data.urgency,
    property_type: data.property,
    business_name: data.business,
    number_of_locations: String(data.locations),
    po_reference: data.reference,
    facility_type: data.facility,
    recurring_service: data.recurring,
    access_and_po_requirements: data.access,
    onsite_contact: data.onsite,
    preferred_scheduling: data.scheduling,
    consent: 'Contact consent provided for this request',
    photo_count: String(photos.length),
    source: 'FixPro.ca',
    language: data.language,
  };
  for (const [name, value] of Object.entries(fields)) if (value) body.set(name, value);
  photos.forEach(file => body.append('attachment', file, file.name));
  return body;
}
