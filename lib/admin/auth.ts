export function verifyAdminRequest(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;

  return auth.slice("Bearer ".length) === secret;
}
