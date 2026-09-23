export function isWettWorkspacePath(pathname: string) {
  return pathname === "/admin/office/wett" || pathname.startsWith("/admin/office/wett/");
}
