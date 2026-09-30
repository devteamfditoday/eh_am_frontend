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
    edit: 'Sửa',
    deactivate: 'Ngừng',
    retry: 'Thử lại',
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
    address: {
      provinceLabel: 'Tỉnh/Thành',
      wardLabel: 'Phường/Xã',
      detailLabel: 'Số nhà, tên đường',
      provincePlaceholder: 'Chọn tỉnh/thành',
      wardPlaceholder: 'Chọn phường/xã',
      detailPlaceholder: 'VD: 12 Nguyễn Huệ',
    },
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
    brandHeadline: 'Mỗi tài sản, một câu chuyện được ghi lại.',
    brandTagline:
      'Từ cửa hàng đến kho, xưởng rang và văn phòng — quản lý mọi tài sản và công cụ ở một nơi.',
    brandFooter: 'EH-AM · Hệ điều hành tài sản',
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
    groupMasterData: 'Danh mục nền',
    groupSystem: 'Hệ thống',
    dashboard: 'Tổng quan',
    locations: 'Địa điểm',
    costCenters: 'Trung tâm chi phí',
    departments: 'Phòng ban',
    assetTypes: 'Loại tài sản',
    reasonCodes: 'Lý do',
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

  masterData: {
    codeSuggestion: 'Gợi ý mã tiếp theo:',
    deactivate: {
      title: 'Ngừng {{code}}',
      description:
        'Mục đã ngừng sẽ không còn xuất hiện ở các danh sách chọn, nhưng vẫn giữ nguyên trong lịch sử cũ.',
      reasonLabel: 'Lý do ngừng',
      reasonPlaceholder: 'Chọn lý do ngừng',
      reasonRequired: 'Hãy chọn một lý do trước khi ngừng.',
      reasonInvalid: 'Lý do vừa chọn không còn dùng được. Hãy chọn lại.',
      noteLabel: 'Ghi chú thêm',
      notePlaceholder: 'Nêu rõ lý do khi bạn chọn “Khác”.',
      noteRequired: 'Hãy ghi rõ lý do khi chọn “Khác”.',
      confirm: 'Xác nhận ngừng',
      success: 'Đã ngừng {{code}}.',
      versionConflict:
        'Người khác vừa thay đổi mục này. Hãy tải lại để xem trạng thái mới nhất rồi thử lại nếu vẫn cần.',
      reload: 'Tải lại',
    },
    locations: {
      title: 'Danh mục địa điểm',
      description: 'Nơi ghi nhận tài sản và phạm vi gán vai trò cho nhân viên.',
      addButton: 'Thêm địa điểm',
      searchPlaceholder: 'Tìm mã hoặc tên…',
      noMatch: 'Không có địa điểm khớp bộ lọc.',
      emptyTitle: 'Chưa có địa điểm nào',
      emptyDescription:
        'Thêm địa điểm đầu tiên để bắt đầu lập hồ sơ tài sản và gán vai trò.',
      emptyAction: 'Thêm địa điểm đầu tiên',
      loadErrorTitle: 'Không tải được danh sách',
      loadErrorDescription:
        'Có lỗi khi tải danh mục địa điểm. Kiểm tra kết nối rồi thử lại.',
      reload: 'Tải lại',
      saved: 'Đã lưu địa điểm {{code}}.',
      columns: {
        code: 'Mã',
        name: 'Tên',
        type: 'Loại',
        costCenter: 'Trung tâm chi phí',
        status: 'Trạng thái',
      },
      type: {
        STORE: 'Cửa hàng',
        WAREHOUSE: 'Kho',
        ROASTERY: 'Xưởng rang',
        OFFICE: 'Văn phòng',
        EXTERNAL: 'Bên ngoài',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      createTitle: 'Thêm địa điểm',
      createDescription: 'Điền thông tin địa điểm mới.',
      editTitle: 'Sửa địa điểm — {{code}}',
      editDescription: 'Sửa tên, địa chỉ hoặc trung tâm chi phí mặc định.',
      form: {
        code: 'Mã địa điểm',
        codeReadonly: 'Mã không đổi được sau khi tạo.',
        name: 'Tên địa điểm',
        type: 'Loại',
        typePlaceholder: 'Chọn loại',
        address: 'Địa chỉ',
        costCenter: 'Trung tâm chi phí mặc định',
        costCenterPlaceholder: 'Chọn trung tâm chi phí',
        costCenterEmpty:
          'Chưa có trung tâm chi phí nào đang hoạt động. Hãy tạo trung tâm chi phí trước.',
        createCostCenterCta: 'Tạo trung tâm chi phí',
      },
      errors: {
        duplicateCode:
          'Mã đã dùng (kể cả địa điểm đã ngừng cũng không dùng lại).',
        versionConflict:
          'Có người vừa sửa địa điểm này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
      },
    },
    costCenters: {
      title: 'Danh mục trung tâm chi phí',
      description:
        'Mã chi phí dùng chung với phần mềm kế toán FAST để đối chiếu về sau.',
      addButton: 'Thêm trung tâm chi phí',
      searchPlaceholder: 'Tìm mã hoặc tên…',
      noMatch: 'Không có trung tâm chi phí khớp bộ lọc.',
      emptyTitle: 'Chưa có trung tâm chi phí nào',
      emptyDescription:
        'Mỗi địa điểm cần một trung tâm chi phí mặc định, nên hãy thêm ít nhất một.',
      emptyAction: 'Thêm trung tâm chi phí đầu tiên',
      loadErrorTitle: 'Không tải được danh sách',
      loadErrorDescription:
        'Có lỗi khi tải danh mục trung tâm chi phí. Kiểm tra kết nối rồi thử lại.',
      reload: 'Tải lại',
      saved: 'Đã lưu trung tâm chi phí {{code}}.',
      columns: {
        code: 'Mã',
        name: 'Tên',
        status: 'Trạng thái',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      createTitle: 'Thêm trung tâm chi phí',
      createDescription: 'Nhập mã theo danh mục trung tâm chi phí trên FAST.',
      editTitle: 'Sửa trung tâm chi phí — {{code}}',
      editDescription: 'Sửa tên trung tâm chi phí.',
      form: {
        code: 'Mã trung tâm chi phí',
        codeReadonly: 'Mã không đổi được sau khi tạo.',
        name: 'Tên trung tâm chi phí',
      },
      errors: {
        duplicateCode:
          'Mã đã dùng (kể cả trung tâm chi phí đã ngừng cũng không dùng lại).',
        versionConflict:
          'Có người vừa sửa trung tâm chi phí này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
      },
    },
    departments: {
      title: 'Danh mục phòng ban',
      description:
        'Đơn vị công tác của nhân viên khối văn phòng và sơ đồ tổ chức.',
      addButton: 'Thêm phòng ban',
      searchPlaceholder: 'Tìm mã hoặc tên…',
      noMatch: 'Không có phòng ban khớp bộ lọc.',
      emptyTitle: 'Chưa có phòng ban nào',
      emptyDescription: 'Thêm phòng ban để hồ sơ nhân viên có đơn vị công tác.',
      emptyAction: 'Thêm phòng ban đầu tiên',
      loadErrorTitle: 'Không tải được danh sách',
      loadErrorDescription:
        'Có lỗi khi tải danh mục phòng ban. Kiểm tra kết nối rồi thử lại.',
      reload: 'Tải lại',
      saved: 'Đã lưu phòng ban {{code}}.',
      columns: {
        code: 'Mã',
        name: 'Tên',
        status: 'Trạng thái',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      createTitle: 'Thêm phòng ban',
      createDescription: 'Điền mã và tên phòng ban. Trưởng phòng gán sau.',
      editTitle: 'Sửa phòng ban — {{code}}',
      editDescription: 'Sửa tên phòng ban.',
      form: {
        code: 'Mã phòng ban',
        codeReadonly: 'Mã không đổi được sau khi tạo.',
        name: 'Tên phòng ban',
      },
      errors: {
        duplicateCode:
          'Mã đã dùng (kể cả phòng ban đã ngừng cũng không dùng lại).',
        versionConflict:
          'Có người vừa sửa phòng ban này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
      },
    },
    assetTypes: {
      title: 'Cây loại tài sản',
      description:
        'Loại quyết định tài sản là TSCĐ hay CCDC và có bắt buộc nhập serial hay không.',
      addGroupButton: 'Thêm nhóm',
      addTypeButton: 'Thêm loại',
      searchPlaceholder: 'Tìm mã hoặc tên…',
      showInactive: 'Hiện mục đã ngừng',
      noMatch: 'Không có nhóm hay loại nào khớp.',
      noTypeInGroup: 'Nhóm này chưa có loại nào.',
      serialBadge: 'Cần serial',
      emptyTitle: 'Chưa có nhóm loại tài sản',
      emptyDescription:
        'Thêm nhóm đầu tiên, rồi thêm các loại bên trong để bắt đầu lập hồ sơ tài sản.',
      emptyAction: 'Thêm nhóm đầu tiên',
      loadErrorTitle: 'Không tải được cây loại tài sản',
      loadErrorDescription: 'Vui lòng thử lại sau giây lát.',
      savedGroup: 'Đã lưu nhóm {{code}}.',
      savedType: 'Đã lưu loại {{code}}.',
      reload: 'Tải lại',
      createGroupTitle: 'Thêm nhóm loại tài sản',
      editGroupTitle: 'Sửa nhóm {{code}}',
      groupDescription: 'Nhóm gom các loại tài sản cùng tính chất.',
      createTypeTitle: 'Thêm loại vào "{{group}}"',
      editTypeTitle: 'Sửa loại {{code}}',
      typeDescription:
        'Loại cho biết là TSCĐ hay CCDC và các thuộc tính áp cho hồ sơ tài sản.',
      kind: {
        FIXED_ASSET: 'TSCĐ',
        TOOL: 'CCDC',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Đã ngừng',
      },
      form: {
        groupCode: 'Mã nhóm',
        groupName: 'Tên nhóm',
        typeCode: 'Mã loại',
        typeName: 'Tên loại',
        codeReadonly: 'Mã không đổi được sau khi tạo.',
        assetKind: 'Phân loại',
        serialRequired: 'Bắt buộc nhập serial',
        serialRequiredHint:
          'Khi bật, hồ sơ tài sản của loại này phải nhập số serial.',
        usefulLifeMonths: 'Thời gian sử dụng (tháng)',
        fastGroupCode: 'Mã nhóm FAST',
      },
      errors: {
        duplicateCode:
          'Mã đã dùng (kể cả mục đã ngừng cũng không dùng lại).',
        versionConflict:
          'Có người vừa sửa mục này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
      },
    },
    reasonCodes: {
      title: 'Danh mục lý do',
      description:
        'Lý do chuẩn cho các thao tác cần ghi "vì sao", để nhật ký thống nhất.',
      addButton: 'Thêm lý do',
      searchPlaceholder: 'Tìm mã hoặc tên…',
      noMatch: 'Không có lý do khớp bộ lọc.',
      emptyTitle: 'Chưa có lý do nào',
      emptyDescription:
        'Mỗi nhóm đã có sẵn mục "Khác". Thêm lý do cụ thể để người dùng chọn nhanh hơn.',
      emptyAction: 'Thêm lý do đầu tiên',
      loadErrorTitle: 'Không tải được danh sách',
      loadErrorDescription:
        'Có lỗi khi tải danh mục lý do. Kiểm tra kết nối rồi thử lại.',
      reload: 'Tải lại',
      saved: 'Đã lưu lý do {{code}}.',
      columns: {
        group: 'Nhóm',
        code: 'Mã',
        label: 'Tên lý do',
        status: 'Trạng thái',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      group: {
        ROLE_ASSIGNMENT: 'Gán vai trò',
        ROLE_REVOKE: 'Thu hồi vai trò',
        PROFILE_EDIT: 'Điều chỉnh hồ sơ',
        ACCOUNT_LOCK: 'Khoá tài khoản',
        ACCOUNT_UNLOCK: 'Mở khoá tài khoản',
        TERMINATION: 'Cho nghỉ việc',
        EMAIL_CHANGE: 'Đổi email công việc',
        TRANSFER: 'Điều chuyển',
        VOUCHER_CANCEL: 'Huỷ phiếu',
        APPROVAL_REJECT: 'Từ chối duyệt',
        DISPOSAL: 'Thanh lý / báo giảm',
        PROPOSAL_CANCEL: 'Huỷ đề nghị',
        LOSS_CONFIRM: 'Xác nhận mất',
        ASSET_RECOVERY: 'Khôi phục tài sản',
        LABEL_REPRINT: 'In lại nhãn',
        ASSET_CANCEL: 'Huỷ hồ sơ tài sản',
        FINANCE_ADJUST: 'Điều chỉnh tài chính',
        USE_STATUS_CHANGE: 'Đưa vào / ngừng sử dụng',
        CATALOG_DEACTIVATE: 'Ngừng mục danh mục',
        LOCATION_CLOSE: 'Đóng location',
        CONFIG_CHANGE: 'Đổi cấu hình',
        ACCEPTANCE_FAIL: 'Nghiệm thu không đạt',
      },
      createTitle: 'Thêm lý do',
      createDescription: 'Chọn nhóm, nhập mã và tên lý do.',
      editTitle: 'Sửa lý do — {{code}}',
      editDescription: 'Sửa tên lý do (mã và nhóm không đổi).',
      form: {
        group: 'Nhóm thao tác',
        groupPlaceholder: 'Chọn nhóm',
        code: 'Mã lý do',
        codeReadonly: 'Mã không đổi được sau khi tạo.',
        label: 'Tên lý do',
      },
      errors: {
        duplicateCode: 'Mã đã dùng trong nhóm này (kể cả lý do đã ngừng).',
        versionConflict:
          'Có người vừa sửa lý do này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
        systemProtected:
          'Đây là mục hệ thống ("Khác"), không sửa hay ngừng được.',
      },
    },
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
