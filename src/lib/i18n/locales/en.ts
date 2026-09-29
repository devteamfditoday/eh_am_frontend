import { type TranslationKeys } from './vi'

/**
 * Bản dịch tiếng Anh.
 *
 * ⚠️ Khai kiểu `TranslationKeys` (suy từ `vi.ts`) nên **thiếu một khoá là lỗi biên dịch** —
 * cùng nguyên tắc với `satisfies Record<ErrorCode, …>` ở backend.
 */
export const en: TranslationKeys = {
  common: {
    appName: 'Every Half · Assets',
    appSubtitle: 'Asset & tool management',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    save: 'Save',
    saved: 'Saved',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading…',
    noData: 'No data',
    rowsSelected: '{{count}} row(s) selected',
    of: 'of',
    rowsPerPage: 'Rows per page',
    page: 'Page',
    actions: 'Actions',
    details: 'Details',
    copy: 'Copy',
    copied: 'Copied',
    signOut: 'Sign out',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
  },

  env: {
    development: 'DEVELOPMENT',
    staging: 'STAGING',
    production: 'PRODUCTION — every action takes effect immediately',
  },

  auth: {
    signInTitle: 'Sign in',
    signInDescription:
      'Use the Every Half account you were given. Accounts without an assigned role cannot enter yet.',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    forgotPassword: 'Forgot password?',
    forgotPasswordTitle: 'Forgot password',
    forgotPasswordDescription:
      'Enter your email. If it has an account, we will send a password reset link.',
    sendResetLink: 'Send reset link',
    backToSignIn: 'Back to sign in',
    resetPasswordTitle: 'Set a new password',
    resetPasswordDescription:
      'The new password applies immediately, and every device signed in to this account will be signed out.',
    newPassword: 'New password',
    confirmNewPassword: 'Confirm new password',
    passwordRules:
      'At least 8 characters, with at least 1 letter, 1 number and 1 special character.',
    passwordsDoNotMatch: 'The two passwords do not match.',
    resetPasswordSubmit: 'Set new password',
    resetLinkInvalid:
      'This password reset link is invalid or has expired. Please request a new one.',
    requestNewLink: 'Request a new link',
    signingOut: 'Signing out…',
    signOutConfirmTitle: 'Sign out?',
    signOutConfirmDescription:
      'This session will be revoked on the server. Your other devices stay signed in.',
    sessionEnded: 'Your session has ended. Please sign in again.',
    noRole:
      'This account can sign in but has no role yet (company-wide or at a store/warehouse). Please contact your manager or the system administrator.',
  },

  nav: {
    groupGeneral: 'General',
    groupSystem: 'System',
    dashboard: 'Overview',
  },

  dashboard: {
    title: 'Overview',
    purpose:
      'Quick figures on assets & tools: total value, split by store/warehouse/roastery, depreciation, lost/damaged assets, stock-take progress and differences with FAST.',
  },

  notBuiltYet: {
    status:
      'Not built yet — waiting for the UI design and an approved specification.',
    spec: 'Specification',
  },

  settings: {
    title: 'Settings',
    description: 'Account, security and appearance.',
    security: 'Account & security',
    securityDescription:
      'Account details, password change and revoking sessions on every device.',
    appearance: 'Appearance',
    appearanceDescription: 'Light/dark theme and font on this device.',
    appearanceSaved: 'Appearance applied.',
    accountInfo: 'Account details',
    displayName: 'Full name',
    employeeCode: 'Employee code',
    notAssigned: 'Not assigned',
    platformRoles: 'Company-wide roles',
    locationRoles: 'Location roles',
    noRoles: 'None',
    changePassword: 'Change password',
    changePasswordDescription:
      'After the change, every session (including this one) is revoked — you will sign in again with the new password.',
    currentPassword: 'Current password',
    changePasswordSubmit: 'Change password',
    logoutAll: 'Sign out of every device',
    logoutAllDescription:
      'Use this if you think someone else is using your account (lost phone, leaked password). Every device, including this one, will need to sign in again.',
    logoutAllConfirm: 'Sign out everywhere',
  },

  validation: {
    required: 'This field is required.',
    requiredChoice: 'Please choose a value.',
    tooShort: 'Must be at least {{min}} characters.',
    tooLong: 'Must be at most {{max}} characters.',
    numberMin: 'Must be {{min}} or more.',
    numberMinExclusive: 'Must be greater than {{min}}.',
    numberMax: 'Must not exceed {{max}}.',
    numberMaxExclusive: 'Must be less than {{max}}.',
    notNumber: 'Please enter a number.',
    notInteger: 'Please enter a whole number.',
    tooFewItems: 'Select at least {{min}} item(s).',
    tooManyItems: 'Select at most {{max}} item(s).',
    email: 'Invalid email address.',
    invalidFormat: 'Invalid format.',
    invalidDate: 'Invalid date.',
    invalidOption: 'Value is not one of the allowed options.',
    invalid: 'Invalid value.',
  },

  errors: {
    pageTitle401: 'Not signed in',
    pageDesc401:
      'Please sign in with an appropriate account to view this content.',
    pageTitle403: 'No permission',
    pageDesc403:
      'You do not hold a role needed for this content. Contact your manager or the system administrator if you think this is a mistake.',
    pageTitle404: 'Page not found',
    pageDesc404: 'The page you are looking for does not exist or has moved.',
    pageTitle500: 'Server error',
    pageDesc500:
      'Something unexpected happened. Please try again in a few minutes.',
    pageTitle503: 'Under maintenance',
    pageDesc503: 'The system is under maintenance and will be back shortly.',
    goHome: 'Back to overview',
    goBack: 'Go back',
    retry: 'Retry',
    requestId: 'Reference code',
  },
}
