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
    edit: 'Edit',
    deactivate: 'Deactivate',
    retry: 'Retry',
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
    address: {
      provinceLabel: 'Province/City',
      wardLabel: 'Ward/Commune',
      detailLabel: 'House number, street',
      provincePlaceholder: 'Select province/city',
      wardPlaceholder: 'Select ward/commune',
      detailPlaceholder: 'e.g. 12 Nguyen Hue',
    },
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
    brandHeadline: 'Every asset, a story worth keeping.',
    brandTagline:
      'From stores to the warehouse, roastery and office — every asset and tool in one place.',
    brandFooter: 'EH-AM · Asset operating system',
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
    groupMasterData: 'Master data',
    groupSystem: 'System',
    dashboard: 'Overview',
    locations: 'Locations',
    costCenters: 'Cost centers',
    departments: 'Departments',
    assetTypes: 'Asset types',
    reasonCodes: 'Reasons',
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

  masterData: {
    codeSuggestion: 'Suggested next code:',
    deactivate: {
      title: 'Deactivate {{code}}',
      description:
        'A deactivated item no longer appears in pickers, but it stays in past records.',
      reasonLabel: 'Reason for deactivating',
      reasonPlaceholder: 'Choose a reason',
      reasonRequired: 'Choose a reason before deactivating.',
      reasonInvalid: 'That reason is no longer available. Please choose another.',
      noteLabel: 'Additional note',
      notePlaceholder: 'Spell out the reason when you choose “Other”.',
      noteRequired: 'Add a note when you choose “Other”.',
      confirm: 'Deactivate',
      success: '{{code}} deactivated.',
      versionConflict:
        'Someone else just changed this item. Reload to see the latest state, then try again if you still need to.',
      reload: 'Reload',
    },
    locations: {
      title: 'Locations',
      description:
        'Where assets are recorded and the scope for assigning staff roles.',
      addButton: 'Add location',
      searchPlaceholder: 'Search code or name…',
      noMatch: 'No locations match the filter.',
      emptyTitle: 'No locations yet',
      emptyDescription:
        'Add the first location to start recording assets and assigning roles.',
      emptyAction: 'Add the first location',
      loadErrorTitle: 'Could not load the list',
      loadErrorDescription:
        'Something went wrong loading locations. Check your connection and retry.',
      reload: 'Reload',
      saved: 'Location {{code}} saved.',
      columns: {
        code: 'Code',
        name: 'Name',
        type: 'Type',
        costCenter: 'Cost center',
        status: 'Status',
      },
      type: {
        STORE: 'Store',
        WAREHOUSE: 'Warehouse',
        ROASTERY: 'Roastery',
        OFFICE: 'Office',
        EXTERNAL: 'External',
      },
      status: {
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
      },
      createTitle: 'Add location',
      createDescription: 'Fill in the new location details.',
      editTitle: 'Edit location — {{code}}',
      editDescription: 'Edit the name, address, or default cost center.',
      form: {
        code: 'Location code',
        codeReadonly: 'Code cannot be changed after creation.',
        name: 'Location name',
        type: 'Type',
        typePlaceholder: 'Select a type',
        address: 'Address',
        costCenter: 'Default cost center',
        costCenterPlaceholder: 'Select a cost center',
        costCenterEmpty:
          'No active cost center yet. Create a cost center first.',
        createCostCenterCta: 'Create a cost center',
      },
      errors: {
        duplicateCode:
          'Code already in use (including retired locations — it cannot be reused).',
        versionConflict:
          'Someone just changed this location. Reload the latest data and re-enter your changes.',
      },
    },
    costCenters: {
      title: 'Cost centers',
      description:
        'Cost codes shared with the FAST accounting software for later reconciliation.',
      addButton: 'Add cost center',
      searchPlaceholder: 'Search code or name…',
      noMatch: 'No cost centers match the filter.',
      emptyTitle: 'No cost centers yet',
      emptyDescription:
        'Every location needs a default cost center, so add at least one.',
      emptyAction: 'Add the first cost center',
      loadErrorTitle: 'Could not load the list',
      loadErrorDescription:
        'Something went wrong loading cost centers. Check your connection and retry.',
      reload: 'Reload',
      saved: 'Cost center {{code}} saved.',
      columns: {
        code: 'Code',
        name: 'Name',
        status: 'Status',
      },
      status: {
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
      },
      createTitle: 'Add cost center',
      createDescription: 'Enter the code from the FAST cost-center catalog.',
      editTitle: 'Edit cost center — {{code}}',
      editDescription: 'Edit the cost center name.',
      form: {
        code: 'Cost center code',
        codeReadonly: 'Code cannot be changed after creation.',
        name: 'Cost center name',
      },
      errors: {
        duplicateCode:
          'Code already in use (including retired cost centers — it cannot be reused).',
        versionConflict:
          'Someone just changed this cost center. Reload the latest data and re-enter your changes.',
      },
    },
    departments: {
      title: 'Departments',
      description: 'Office staff work units and the organization chart.',
      addButton: 'Add department',
      searchPlaceholder: 'Search code or name…',
      noMatch: 'No departments match the filter.',
      emptyTitle: 'No departments yet',
      emptyDescription:
        'Add a department so employee profiles have a work unit.',
      emptyAction: 'Add the first department',
      loadErrorTitle: 'Could not load the list',
      loadErrorDescription:
        'Something went wrong loading departments. Check your connection and retry.',
      reload: 'Reload',
      saved: 'Department {{code}} saved.',
      columns: {
        code: 'Code',
        name: 'Name',
        status: 'Status',
      },
      status: {
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
      },
      createTitle: 'Add department',
      createDescription:
        'Enter the department code and name. Assign the head later.',
      editTitle: 'Edit department — {{code}}',
      editDescription: 'Edit the department name.',
      form: {
        code: 'Department code',
        codeReadonly: 'Code cannot be changed after creation.',
        name: 'Department name',
      },
      errors: {
        duplicateCode:
          'Code already in use (including retired departments — it cannot be reused).',
        versionConflict:
          'Someone just changed this department. Reload the latest data and re-enter your changes.',
      },
    },
    assetTypes: {
      title: 'Asset type tree',
      description:
        'The type decides whether an asset is a fixed asset or a tool, and whether a serial is required.',
      addGroupButton: 'Add group',
      addTypeButton: 'Add type',
      searchPlaceholder: 'Search code or name…',
      showInactive: 'Show retired items',
      noMatch: 'No group or type matches.',
      noTypeInGroup: 'This group has no types yet.',
      serialBadge: 'Serial',
      emptyTitle: 'No asset type groups yet',
      emptyDescription:
        'Add the first group, then add types inside it to start building asset records.',
      emptyAction: 'Add the first group',
      loadErrorTitle: 'Could not load the asset type tree',
      loadErrorDescription: 'Please try again in a moment.',
      savedGroup: 'Group {{code}} saved.',
      savedType: 'Type {{code}} saved.',
      reload: 'Reload',
      createGroupTitle: 'Add asset type group',
      editGroupTitle: 'Edit group {{code}}',
      groupDescription: 'A group bundles asset types of the same nature.',
      createTypeTitle: 'Add a type to "{{group}}"',
      editTypeTitle: 'Edit type {{code}}',
      typeDescription:
        'The type marks fixed asset vs tool and the attributes applied to asset records.',
      kind: {
        FIXED_ASSET: 'Fixed asset',
        TOOL: 'Tool',
      },
      status: {
        ACTIVE: 'Active',
        INACTIVE: 'Retired',
      },
      form: {
        groupCode: 'Group code',
        groupName: 'Group name',
        typeCode: 'Type code',
        typeName: 'Type name',
        codeReadonly: 'The code cannot change after creation.',
        assetKind: 'Classification',
        serialRequired: 'Require a serial number',
        serialRequiredHint:
          'When on, asset records of this type must have a serial number.',
        usefulLifeMonths: 'Reference useful life (months)',
        fastGroupCode: 'FAST group code',
      },
      errors: {
        duplicateCode:
          'Code already in use (including retired items — it cannot be reused).',
        versionConflict:
          'Someone just changed this item. Reload the latest data and re-enter your changes.',
      },
    },
    reasonCodes: {
      title: 'Reasons',
      description:
        'Standard reasons for actions that record a "why", to keep the log consistent.',
      addButton: 'Add reason',
      searchPlaceholder: 'Search code or name…',
      noMatch: 'No reasons match the filter.',
      emptyTitle: 'No reasons yet',
      emptyDescription:
        'Every group already has an "Other" entry. Add specific reasons for quicker selection.',
      emptyAction: 'Add the first reason',
      loadErrorTitle: 'Could not load the list',
      loadErrorDescription:
        'Something went wrong loading reasons. Check your connection and retry.',
      reload: 'Reload',
      saved: 'Reason {{code}} saved.',
      columns: {
        group: 'Group',
        code: 'Code',
        label: 'Reason',
        status: 'Status',
      },
      status: {
        ACTIVE: 'Active',
        INACTIVE: 'Inactive',
      },
      group: {
        ROLE_ASSIGNMENT: 'Grant role',
        ROLE_REVOKE: 'Revoke role',
        PROFILE_EDIT: 'Edit profile',
        ACCOUNT_LOCK: 'Lock account',
        ACCOUNT_UNLOCK: 'Unlock account',
        TERMINATION: 'Terminate employment',
        EMAIL_CHANGE: 'Change work email',
        TRANSFER: 'Transfer',
        VOUCHER_CANCEL: 'Cancel voucher',
        APPROVAL_REJECT: 'Reject approval',
        DISPOSAL: 'Disposal / write-off',
        PROPOSAL_CANCEL: 'Cancel proposal',
        LOSS_CONFIRM: 'Confirm loss',
        ASSET_RECOVERY: 'Recover asset',
        LABEL_REPRINT: 'Reprint label',
        ASSET_CANCEL: 'Void asset record',
        FINANCE_ADJUST: 'Finance adjustment',
        USE_STATUS_CHANGE: 'Put in / out of use',
        CATALOG_DEACTIVATE: 'Deactivate catalog item',
        LOCATION_CLOSE: 'Close location',
        CONFIG_CHANGE: 'Change configuration',
        ACCEPTANCE_FAIL: 'Acceptance failed',
      },
      createTitle: 'Add reason',
      createDescription: 'Pick a group, enter the code and reason name.',
      editTitle: 'Edit reason — {{code}}',
      editDescription: 'Edit the reason name (code and group stay fixed).',
      form: {
        group: 'Action group',
        groupPlaceholder: 'Select a group',
        code: 'Reason code',
        codeReadonly: 'Code cannot be changed after creation.',
        label: 'Reason name',
      },
      errors: {
        duplicateCode:
          'Code already used in this group (including retired reasons).',
        versionConflict:
          'Someone just changed this reason. Reload the latest data and re-enter your changes.',
        systemProtected:
          'This is a system entry ("Other"). It cannot be edited or deactivated.',
      },
    },
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
