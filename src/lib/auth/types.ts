export type UserRole = "admin" | "office";

export type SessionUser = {
  username: string;
  role: UserRole;
};

export function resolveSessionRole(role?: UserRole): UserRole {
  return role === "office" ? "office" : "admin";
}
