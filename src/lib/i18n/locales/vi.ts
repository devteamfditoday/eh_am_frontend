/**
 * Bản dịch tiếng Việt — **ngôn ngữ gốc** của giao diện.
 *
 * ⚠️ VIẾT TIẾNG VIỆT TRƯỚC, DỊCH SANG TIẾNG ANH SAU
 *
 * Người dùng chính là nhân viên cửa hàng, thủ kho, xưởng rang, kế toán — làm việc bằng tiếng
 * Việt, nhiều người thao tác trên điện thoại giữa ca. Viết tiếng Anh trước rồi dịch sang tiếng
 * Việt cho ra những câu đúng ngữ pháp mà không ai nói như vậy.
 *
 * ⚠️ `en.ts` phải có **đúng cùng bộ khoá** — thiếu một khoá là lỗi biên dịch (xem
 * `TranslationKeys` bên dưới).
 *
 * ⚠️ Nhãn cho từng module nghiệp vụ (tài sản, kiểm kê, điều chuyển…) CHƯA có ở đây — thêm cùng lúc
 * với màn hình của module, sau khi có thiết kế giao diện.
 */
export const vi = {
  common: {
    appName: 'Every Half · Tài sản',
    appSubtitle: 'Quản lý tài sản & CCDC',
    search: 'Tìm kiếm',
    filter: 'Bộ lọc',
    reset: 'Đặt lại',
    save: 'Lưu',
    saved: 'Đã lưu',
    cancel: 'Huỷ',
    confirm: 'Xác nhận',
    close: 'Đóng',
    back: 'Quay lại',
    next: 'Tiếp',
    previous: 'Trước',
    loading: 'Đang tải…',
    noData: 'Không có dữ liệu',
    rowsSelected: 'Đã chọn {{count}} dòng',
    of: 'trên',
    rowsPerPage: 'Số dòng mỗi trang',
    page: 'Trang',
    actions: 'Hành động',
    details: 'Chi tiết',
    copy: 'Sao chép',
    copied: 'Đã sao chép',
    signOut: 'Đăng xuất',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    language: 'Ngôn ngữ',
    theme: 'Chủ đề',
  },

  env: {
    // ⚠️ Dải cảnh báo môi trường. Xem `EnvironmentBanner` về lý do nó tồn tại.
    development: 'MÔI TRƯỜNG PHÁT TRIỂN',
    staging: 'MÔI TRƯỜNG THỬ NGHIỆM',
    production: 'MÔI TRƯỜNG THẬT — mọi thao tác có hiệu lực ngay',
  },

  auth: {
    signInTitle: 'Đăng nhập',
    signInDescription:
      'Dùng tài khoản Every Half được cấp. Tài khoản chưa được gán vai trò sẽ chưa vào được hệ thống.',
    email: 'Email',
    password: 'Mật khẩu',
    signIn: 'Đăng nhập',
    forgotPassword: 'Quên mật khẩu?',
    forgotPasswordTitle: 'Quên mật khẩu',
    forgotPasswordDescription:
      'Nhập email của bạn. Nếu email có tài khoản, hệ thống sẽ gửi liên kết đặt lại mật khẩu.',
    sendResetLink: 'Gửi liên kết đặt lại',
    backToSignIn: 'Về trang đăng nhập',
    resetPasswordTitle: 'Đặt mật khẩu mới',
    resetPasswordDescription:
      'Mật khẩu mới áp dụng ngay, và mọi thiết bị đang đăng nhập tài khoản này sẽ bị đăng xuất.',
    newPassword: 'Mật khẩu mới',
    confirmNewPassword: 'Nhập lại mật khẩu mới',
    passwordRules:
      'Tối thiểu 8 ký tự, gồm ít nhất 1 chữ, 1 số và 1 ký tự đặc biệt.',
    passwordsDoNotMatch: 'Hai mật khẩu không khớp.',
    resetPasswordSubmit: 'Đặt mật khẩu mới',
    // ⚠️ Không nói lý do cụ thể (hết hạn / đã dùng / sai) — xem `ResetPasswordForm`.
    resetLinkInvalid:
      'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu một liên kết mới.',
    requestNewLink: 'Yêu cầu liên kết mới',
    signingOut: 'Đang đăng xuất…',
    signOutConfirmTitle: 'Đăng xuất?',
    signOutConfirmDescription:
      'Phiên hiện tại sẽ bị thu hồi ở phía máy chủ. Các thiết bị khác của bạn vẫn giữ nguyên.',
    sessionEnded: 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.',
    noRole:
      'Tài khoản đăng nhập được nhưng chưa được gán vai trò nào (toàn hệ thống hoặc tại một cửa hàng/kho). Vui lòng liên hệ quản lý của bạn hoặc quản trị hệ thống.',
  },

  nav: {
    groupGeneral: 'Chung',
    groupSystem: 'Hệ thống',
    dashboard: 'Tổng quan',
  },

  dashboard: {
    title: 'Tổng quan',
    purpose:
      'Số liệu nhanh về tài sản & CCDC: tổng giá trị, phân bổ theo cửa hàng/kho/xưởng rang, khấu hao, tài sản mất/hỏng, tiến độ kiểm kê và chênh lệch với FAST.',
  },

  notBuiltYet: {
    status: 'Chưa triển khai — chờ thiết kế giao diện và đặc tả đã duyệt.',
    spec: 'Đặc tả',
  },

  settings: {
    title: 'Cài đặt',
    description: 'Tài khoản, bảo mật và giao diện.',
    security: 'Tài khoản & bảo mật',
    securityDescription:
      'Thông tin tài khoản, đổi mật khẩu và thu hồi phiên đăng nhập trên mọi thiết bị.',
    appearance: 'Giao diện',
    appearanceDescription: 'Chủ đề sáng/tối và phông chữ trên thiết bị này.',
    appearanceSaved: 'Đã áp dụng giao diện.',
    accountInfo: 'Thông tin tài khoản',
    displayName: 'Họ tên',
    employeeCode: 'Mã nhân viên',
    notAssigned: 'Chưa gắn',
    platformRoles: 'Vai trò toàn hệ thống',
    locationRoles: 'Vai trò theo điểm',
    noRoles: 'Chưa có',
    changePassword: 'Đổi mật khẩu',
    changePasswordDescription:
      'Sau khi đổi, mọi phiên đăng nhập (kể cả phiên này) bị thu hồi — bạn sẽ đăng nhập lại bằng mật khẩu mới.',
    currentPassword: 'Mật khẩu hiện tại',
    changePasswordSubmit: 'Đổi mật khẩu',
    logoutAll: 'Đăng xuất khỏi mọi thiết bị',
    logoutAllDescription:
      'Dùng khi nghi tài khoản bị người khác sử dụng (mất điện thoại, lộ mật khẩu). Mọi thiết bị, kể cả thiết bị này, sẽ phải đăng nhập lại.',
    logoutAllConfirm: 'Đăng xuất mọi thiết bị',
  },

  /**
   * Thông báo validation của form — Zod dùng qua `src/lib/zod-config.ts`, không gọi trực tiếp.
   * Schema nào cần câu riêng (vd. luật mật khẩu) thì truyền `{ message }` ngay tại schema.
   */
  validation: {
    required: 'Vui lòng nhập trường này.',
    requiredChoice: 'Vui lòng chọn một giá trị.',
    tooShort: 'Tối thiểu {{min}} ký tự.',
    tooLong: 'Tối đa {{max}} ký tự.',
    numberMin: 'Giá trị phải từ {{min}} trở lên.',
    numberMinExclusive: 'Giá trị phải lớn hơn {{min}}.',
    numberMax: 'Giá trị không được vượt quá {{max}}.',
    numberMaxExclusive: 'Giá trị phải nhỏ hơn {{max}}.',
    notNumber: 'Vui lòng nhập một số.',
    notInteger: 'Vui lòng nhập số nguyên.',
    tooFewItems: 'Chọn ít nhất {{min}} mục.',
    tooManyItems: 'Chọn tối đa {{max}} mục.',
    email: 'Email không hợp lệ.',
    invalidFormat: 'Định dạng không hợp lệ.',
    invalidDate: 'Ngày không hợp lệ.',
    invalidOption: 'Giá trị không nằm trong danh sách cho phép.',
    invalid: 'Giá trị không hợp lệ.',
  },

  errors: {
    pageTitle401: 'Chưa đăng nhập',
    pageDesc401:
      'Vui lòng đăng nhập bằng tài khoản phù hợp để xem nội dung này.',
    pageTitle403: 'Không có quyền',
    pageDesc403:
      'Bạn không có vai trò cần thiết để xem nội dung này. Liên hệ quản lý của bạn hoặc quản trị hệ thống nếu cho rằng đây là nhầm lẫn.',
    pageTitle404: 'Không tìm thấy trang',
    pageDesc404: 'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.',
    pageTitle500: 'Lỗi máy chủ',
    pageDesc500: 'Đã có lỗi không mong muốn. Vui lòng thử lại sau ít phút.',
    pageTitle503: 'Đang bảo trì',
    pageDesc503:
      'Hệ thống đang được bảo trì và sẽ hoạt động lại trong ít phút.',
    goHome: 'Về trang tổng quan',
    goBack: 'Quay lại',
    retry: 'Thử lại',
    requestId: 'Mã tra cứu',
  },
} as const

/**
 * Hình dạng bộ bản dịch, với mọi lá là `string`.
 *
 * ⚠️ VÌ SAO CẦN ÁNH XẠ ĐỆ QUY CHỨ KHÔNG DÙNG `typeof vi` TRỰC TIẾP
 *
 * `vi` khai `as const`, nên `typeof vi` cho ra kiểu **literal**: trường `save` có kiểu `'Lưu'`,
 * không phải `string`. Gán `'Save'` vào đó là lỗi biên dịch — tức bản tiếng Anh **không thể tồn
 * tại**. Ánh xạ dưới đây giữ **đúng bộ khoá** (thiếu một khoá vẫn là lỗi biên dịch) nhưng nới kiểu
 * của giá trị thành `string`.
 */
type Translations<T> = {
  [K in keyof T]: T[K] extends string ? string : Translations<T[K]>
}

export type TranslationKeys = Translations<typeof vi>
