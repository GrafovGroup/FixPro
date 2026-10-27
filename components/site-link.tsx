import type {ComponentProps} from 'react';
// Use native navigation for this multi-page service website. It also keeps
// navigation independent of client-router prefetching and JavaScript hydration.
export default function SiteLink(props:ComponentProps<'a'>){return <a {...props}/>}
