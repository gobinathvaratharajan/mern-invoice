export type RoleType = {
  Admin: 'admin';
  User: 'user';
};

export const Roles: RoleType = {
  Admin: 'admin',
  User: 'user',
} as const;
