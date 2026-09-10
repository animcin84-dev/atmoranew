type P={index:string;title:string;description:string;status?:'raw'|'treated'|'pending'|'verified'}
export function EvidenceState({index,title,description,status='raw'}:P){return <li className={`evidence-state evidence-state--${status}`} data-reveal><div className="evidence-state__index mono">{index}</div><div><h3>{title}</h3><p>{description}</p></div></li>}
