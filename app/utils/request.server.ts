/**
 * Reject cross-site POSTs: a legitimate submission from this site always
 * carries an Origin (or at least a Referer) matching the deployment's host.
 * Fails closed when neither header is present.
 */
export function isSameOrigin(request: Request): boolean {
  const host = request.headers.get('host');
  if (!host) return false;
  const source = request.headers.get('origin') ?? request.headers.get('referer');
  if (!source) return false;
  try {
    return new URL(source).host === host;
  } catch {
    return false;
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Parse a form body, or return null for anything that isn't one. A JSON or
 * empty body made `request.formData()` throw, which surfaced as a 500.
 */
export async function readFormData(request: Request): Promise<FormData | null> {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}
