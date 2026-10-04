export const AUTH_ENDPOINTS = {
  register: "/api/register-user",
  login: "/api/ldap-login",
  logout: "/api/logout",
  profile: "/api/admin/user",
  userRoles: (userId: number) => `/api/admin/users/${userId}/roles`,
  updateProfile: "/api/admin/user/update-profile",
  changePassword: "/api/admin/change-password",
  forgotPassword: "/api/password-reset/send-otp",
  verifyPasswordReset: "/api/password-reset/verify-otp",
  resetPassword: "/api/password-reset/change-password",
  changePasswordOnExpiry: "/api/change-password-on-expiry",
} as const;
