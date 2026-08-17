/**
 * Document metadata for Bharat Electrosafe.
 *
 * Only genuine, locally-stored document files are listed here. Each entry pairs
 * a public path with its verified byte size so the UI can show an accurate
 * "PDF · N KB" label without inventing figures. When a file does not exist,
 * it is simply absent from this map — the UI then falls back to a
 * "Request document" action routed to the prefilled contact form.
 *
 * File sizes are read from the filesystem at build time and transcribed here
 * so they remain stable (no runtime stat calls, no hydration mismatch).
 */
export interface DocumentMeta {
  /** Public path under /public. */
  path: string;
  /** Verified file size in bytes. */
  sizeBytes: number;
  /** Human-readable label, e.g. "1.8 MB" or "295 KB". */
  sizeLabel: string;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.round(bytes / 1024)} KB`;
}

const RAW: Array<{ path: string; sizeBytes: number }> = [
  {
    path: '/documents/certifications/erda-test-report-2-5mm.pdf',
    sizeBytes: 1882101,
  },
  {
    path: '/documents/certifications/iso-9001-2015-qms.pdf',
    sizeBytes: 302711,
  },
  {
    path: '/documents/certifications/iso-14001-2015-ems.pdf',
    sizeBytes: 302284,
  },
  {
    path: '/documents/certifications/iso-45001-2018-ohsms.pdf',
    sizeBytes: 304108,
  },
  {
    path: '/documents/certifications/ce-marking-certificate.pdf',
    sizeBytes: 318576,
  },
  {
    path: '/documents/certifications/startup-india-recognition.pdf',
    sizeBytes: 1070362,
  },
];

export const documentMeta: Record<string, DocumentMeta> = Object.fromEntries(
  RAW.map(({ path, sizeBytes }) => [
    path,
    { path, sizeBytes, sizeLabel: formatSize(sizeBytes) },
  ])
);

/** Lookup helper. Returns undefined when no genuine file exists. */
export function getDocumentMeta(path?: string): DocumentMeta | undefined {
  if (!path) return undefined;
  return documentMeta[path];
}
