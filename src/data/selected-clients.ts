/**
 * Shared selected client list — consumed by both Homepage and About Us.
 *
 * Reliance Industries Limited must be first per client directive.
 * No logos are supplied for text-only entries.
 *
 * Updated 2026-08-14 per client update bundle.
 */

export interface SelectedClient {
  name: string;
}

export const selectedClients: SelectedClient[] = [
  { name: 'Reliance Industries Limited' },
  { name: 'Tata Steel Limited' },
  { name: 'MRL Tyre Limited' },
  { name: 'ArcelorMittal Nippon Steel India' },
  { name: 'Ampin Energy' },
  { name: 'KPI Green Energy' },
  { name: 'Jindal India Power Limited' },
  { name: 'Delhi Transco Limited' },
  { name: 'Airport Authority of India' },
  { name: 'Indian Navy' },
  { name: 'Chennai Metro Rail Limited' },
  { name: 'Metro Railway Kolkata' },
  { name: 'NLC India Limited' },
  { name: 'NMDC Steel Limited' },
  { name: 'Rail Vikas Nigam Limited' },
  { name: 'Punjab National Bank' },
  { name: 'Uttar Pradesh Power Corporation Limited' },
];
