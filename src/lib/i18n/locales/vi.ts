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
    firstPage: 'Về trang đầu',
    previousPage: 'Về trang trước',
    nextPage: 'Sang trang sau',
    lastPage: 'Đến trang cuối',
    goToPage: 'Đến trang {{page}}',
    view: 'Hiển thị',
    toggleColumns: 'Chọn cột hiển thị',
    selectedCount: 'Đã chọn {{count}}',
    noResults: 'Không có kết quả.',
    clearFilters: 'Xoá bộ lọc',
    ascending: 'Tăng dần',
    descending: 'Giảm dần',
    hideColumn: 'Ẩn cột',
    selectPlaceholder: 'Chọn một giá trị',
    selectDate: 'Chọn ngày',
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

  personalProfile: {
    title: 'Hồ sơ cá nhân',
    description:
      'Kiểm tra thông tin công việc, quyền truy cập và ngôn ngữ bạn đang dùng.',
    phone: 'Số điện thoại',
    jobTitle: 'Chức danh',
    workTitle: 'Thông tin công việc',
    location: 'Địa điểm chính',
    department: 'Phòng ban',
    manager: 'Cấp trên trực tiếp',
    employmentType: 'Loại hình làm việc',
    languageTitle: 'Ngôn ngữ hiển thị',
    languageDescription:
      'Giao diện và thông báo từ máy chủ sẽ dùng ngôn ngữ đã lưu.',
    saveLanguage: 'Lưu ngôn ngữ',
    savingLanguage: 'Đang lưu…',
    languageSaved: 'Đã đổi ngôn ngữ hiển thị.',
    rolesTitle: 'Vai trò và phạm vi',
    rolesDescription: 'Các quyền đang có hoặc sắp có hiệu lực trên hệ thống.',
    noRolesTitle: 'Bạn chưa được gán vai trò',
    noRolesDescription:
      'Hãy liên hệ Quản trị hệ thống để được gán vai trò. Khi chưa có vai trò, bạn chưa thể xem dữ liệu của địa điểm nào.',
    platformScope: 'Toàn hệ thống',
    locationScope: 'Theo địa điểm',
    noEndDate: 'Không giới hạn',
    superAdmin: 'Quản trị tối cao',
    loadErrorTitle: 'Không tải được hồ sơ',
    loadErrorDescription:
      'Chưa thể tải thông tin của bạn. Kiểm tra kết nối rồi thử lại.',
    roleStatus: {
      ACTIVE: 'Đang hiệu lực',
      UPCOMING: 'Sắp hiệu lực',
    },
    employment: {
      FULL_TIME: 'Toàn thời gian',
      PART_TIME: 'Bán thời gian',
      CONTRACT: 'Hợp đồng',
      INTERN: 'Thực tập',
    },
    roleCodes: {
      SYSTEM_ADMIN: 'Quản trị hệ thống',
      EXECUTIVE: 'Ban điều hành',
      CHIEF_ACCOUNTANT: 'Kế toán trưởng',
      ASSET_ACCOUNTANT: 'Kế toán tài sản',
      ASSET_MANAGER: 'Quản lý tài sản',
      LOCATION_MANAGER: 'Quản lý địa điểm',
      LOCATION_STAFF: 'Nhân viên địa điểm',
      TECHNICIAN: 'Kỹ thuật viên',
      AUDITOR: 'Kiểm soát viên',
    },
  },

  env: {
    // ⚠️ Dải cảnh báo môi trường. Xem `EnvironmentBanner` về lý do nó tồn tại.
    development: 'MÔI TRƯỜNG PHÁT TRIỂN',
    staging: 'MÔI TRƯỜNG THỬ NGHIỆM',
    production: 'MÔI TRƯỜNG THẬT — mọi thao tác có hiệu lực ngay',
  },

  employees: {
    create: {
      title: 'Thêm nhân viên',
      description:
        'Nhập thông tin theo 4 bước. Dữ liệu chỉ được lưu khi bạn bấm Tạo tài khoản.',
      stepperLabel: 'Các bước thêm nhân viên',
      submit: 'Tạo tài khoản',
      steps: {
        workUnit: 'Đơn vị công tác',
        workUnitHint: 'Địa điểm và phòng ban',
        personal: 'Thông tin cá nhân',
        personalHint: 'Tên và thông tin liên hệ',
        job: 'Chi tiết công việc',
        jobHint: 'Thông tin không bắt buộc',
        account: 'Tài khoản và vai trò',
        accountHint: 'Cách kích hoạt và quyền ban đầu',
      },
      form: {
        location: 'Địa điểm làm việc chính',
        department: 'Phòng ban',
        departmentHidden:
          'Phòng ban chỉ áp dụng khi địa điểm chính là văn phòng.',
        displayName: 'Họ và tên',
        email: 'Email công việc',
        phone: 'Số điện thoại',
        language: 'Ngôn ngữ hiển thị',
        employeeCode: 'Mã nhân viên',
        jobTitle: 'Chức danh',
        employmentType: 'Loại hình làm việc',
        startDate: 'Ngày vào làm',
        manager: 'Cấp trên trực tiếp',
        activation: 'Cách kích hoạt',
        temporaryPassword: 'Mật khẩu tạm',
        role: 'Vai trò ban đầu',
        effectiveFrom: 'Hiệu lực từ',
        effectiveTo: 'Hiệu lực đến',
        reason: 'Lý do gán vai trò',
        reasonNote: 'Ghi thêm lý do',
      },
      employment: {
        FULL_TIME: 'Toàn thời gian',
        PART_TIME: 'Bán thời gian',
        CONTRACT: 'Hợp đồng',
        INTERN: 'Thực tập',
      },
      activation: {
        EMAIL_INVITE: 'Gửi lời mời qua email',
        TEMPORARY_PASSWORD: 'Dùng mật khẩu tạm',
      },
      noRoleNotice:
        'Chưa gán vai trò: nhân viên chưa xem được dữ liệu của địa điểm nào.',
      summary: {
        title: 'Tóm tắt nhanh',
        status: 'Trạng thái',
        pending: 'Chờ kích hoạt',
        invitation: 'Kích hoạt',
        temporaryPassword: 'Mật khẩu tạm',
        emailSent: 'Đã gửi email mời',
        emailNotSent: 'Chưa gửi được email mời',
        notSelected: 'Chưa chọn',
        notEntered: 'Chưa nhập',
        noRole: 'Chưa gán vai trò',
      },
      success: {
        title: 'Đã tạo hồ sơ nhân viên',
        description: '{{name}} đang ở trạng thái Chờ kích hoạt.',
        addAnother: 'Thêm nhân viên khác',
        temporaryPasswordTitle: 'Mật khẩu tạm chỉ hiển thị lần này',
        temporaryPasswordHint:
          'Hãy sao chép và chuyển trực tiếp cho nhân viên. Hệ thống sẽ không hiển thị lại mật khẩu này.',
      },
      errors: {
        departmentRequired:
          'Vui lòng chọn phòng ban cho nhân viên làm việc tại văn phòng.',
        loadOptions:
          'Không tải được dữ liệu cho biểu mẫu. Kiểm tra kết nối rồi thử lại.',
        noLocationsTitle: 'Chưa có địa điểm hoạt động',
        noLocations:
          'Hãy tạo hoặc kích hoạt một địa điểm nội bộ trước khi thêm nhân viên.',
      },
    },
    list: {
      title: 'Nhân viên',
      description: 'Tra cứu và quản lý tài khoản nhân viên.',
      addButton: 'Thêm nhân viên',
      searchPlaceholder: 'Tìm theo tên, email hoặc mã nhân viên',
      total: 'Tổng: {{count}} nhân viên',
      clearFilters: 'Xoá lọc',
      columns: {
        name: 'Họ tên',
        email: 'Email',
        location: 'Địa điểm',
        department: 'Phòng ban',
        jobTitle: 'Chức danh',
        status: 'Trạng thái',
        startDate: 'Ngày vào làm',
      },
      filters: {
        location: 'Địa điểm',
        department: 'Phòng ban',
        role: 'Vai trò',
        status: 'Trạng thái',
        employmentType: 'Loại hình',
        all: 'Tất cả',
      },
      status: {
        PENDING_ACTIVATION: 'Chờ kích hoạt',
        ACTIVE: 'Đã kích hoạt',
        SUSPENDED: 'Đã khoá',
        DEACTIVATED: 'Đã ngừng',
      },
      invite: {
        label: 'Lời mời',
        SENT: 'Đã gửi',
        EXPIRED: 'Hết hạn',
        resend: 'Gửi lại lời mời',
        confirmTitle: 'Gửi lại lời mời kích hoạt?',
        confirmDescription:
          'Một lời mời mới sẽ được gửi tới {{email}}. Lời mời cũ sẽ mất hiệu lực ngay.',
        confirm: 'Gửi lời mời',
        sending: 'Đang gửi…',
        success: 'Đã gửi lời mời mới lúc {{sentAt}}.',
        stateConflict:
          'Trạng thái tài khoản vừa thay đổi. Danh sách đã được làm mới để bạn kiểm tra lại.',
        emailFailed:
          'Lời mời mới đã được lưu nhưng email chưa gửi được. Bạn có thể gửi lại bằng một lần thao tác mới.',
        uncertain:
          'Chưa xác định được kết quả. Hãy xem lời mời mới nhất trong danh sách trước khi gửi lại.',
      },
      notProvided: '—',
      emptyTitle: 'Chưa có nhân viên nào',
      emptyDescription:
        'Hãy thêm nhân viên đầu tiên để bắt đầu quản lý tài khoản.',
      noMatchTitle: 'Không có nhân viên khớp bộ lọc',
      noMatchDescription: 'Thử bỏ bớt bộ lọc hoặc sửa từ khoá tìm kiếm.',
      loadErrorTitle: 'Không tải được danh sách nhân viên',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử lại.',
    },
    access: {
      backToList: 'Nhân viên',
      sectionTitle: 'Quyền truy cập',
      addRole: 'Thêm vai trò',
      empty:
        'Chưa gán vai trò nào. Nhân viên chưa xem được dữ liệu địa điểm nào.',
      loadErrorTitle: 'Không tải được quyền truy cập',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử lại.',
      scopePlatform: 'Toàn hệ thống',
      columns: {
        role: 'Vai trò',
        scope: 'Phạm vi',
        effective: 'Hiệu lực',
        status: 'Trạng thái',
        reason: 'Lý do',
        actions: 'Thao tác',
      },
      status: {
        UPCOMING: 'Sắp hiệu lực',
        ACTIVE: 'Đang hiệu lực',
        EXPIRED: 'Hết hiệu lực',
        REVOKED: 'Đã thu hồi',
      },
      revoke: {
        button: 'Thu hồi',
        title: 'Thu hồi vai trò',
        description:
          'Thu hồi {{role}} ở phạm vi {{scope}} của {{name}}. Vai trò sẽ mất hiệu lực từ thao tác kế tiếp; lịch sử vẫn được giữ lại.',
        reason: 'Lý do thu hồi',
        reasonPlaceholder: 'Ví dụ: chuyển sang cửa hàng khác',
        reasonRequired: 'Vui lòng nhập lý do (2–500 ký tự).',
        submit: 'Xác nhận thu hồi',
        success: 'Đã thu hồi vai trò.',
      },
      accountStatus: {
        lockButton: 'Khóa tài khoản',
        unlockButton: 'Mở khóa tài khoản',
        lockTitle: 'Khóa tài khoản',
        unlockTitle: 'Mở khóa tài khoản',
        lockDescription:
          '{{name}} sẽ bị chặn từ yêu cầu kế tiếp và các phiên đang mở sẽ được thu hồi. Hồ sơ và vai trò vẫn được giữ nguyên để có thể mở lại sau.',
        unlockDescription:
          '{{name}} có thể đăng nhập lại sau khi mở khóa. Người dùng cần bắt đầu một phiên đăng nhập mới.',
        lockReason: 'Lý do khóa',
        unlockReason: 'Lý do mở khóa',
        reasonPlaceholder: 'Chọn lý do',
        reasonRequired: 'Vui lòng chọn lý do.',
        note: 'Ghi chú',
        notePlaceholder: 'Mô tả ngắn tình huống cần xử lý',
        noteRequired: 'Vui lòng nhập ít nhất 2 ký tự.',
        lockSubmit: 'Xác nhận khóa',
        unlockSubmit: 'Xác nhận mở khóa',
        lockSuccess: 'Đã khóa tài khoản.',
        unlockSuccess: 'Đã mở khóa tài khoản.',
        sessionWarning:
          'Tài khoản đã bị khóa, nhưng chưa thu hồi hết phiên đang mở. Mọi yêu cầu mới vẫn bị chặn; vui lòng báo bộ phận vận hành kiểm tra.',
      },
      dialog: {
        title: 'Gán vai trò',
        role: 'Vai trò',
        rolePlaceholder: 'Chọn vai trò',
        scopePlatform: 'Phạm vi: Toàn hệ thống',
        locations: 'Địa điểm',
        locationsHint: 'Chọn một hoặc nhiều địa điểm áp dụng vai trò này.',
        locationStaffHint: 'Nhân viên điểm chỉ thuộc một địa điểm.',
        effectiveFrom: 'Hiệu lực từ',
        effectiveTo: 'Hiệu lực đến',
        reason: 'Lý do gán vai trò',
        reasonPlaceholder: 'Ví dụ: nhận việc tại cửa hàng A',
        submit: 'Gán vai trò',
        success: 'Đã gán vai trò cho nhân viên.',
        errors: {
          roleRequired: 'Vui lòng chọn vai trò.',
          locationRequired: 'Vui lòng chọn ít nhất một địa điểm.',
          locationSingle: 'Nhân viên điểm chỉ được gán một địa điểm.',
          dateFrom: 'Vui lòng chọn ngày hiệu lực từ.',
          dateOrder: 'Hiệu lực đến phải sau hiệu lực từ.',
          reason: 'Lý do cần 2–500 ký tự.',
        },
      },
    },
    profile: {
      editButton: 'Sửa hồ sơ',
      emailButton: 'Đổi email',
      contactTitle: 'Liên hệ',
      workTitle: 'Công việc',
      emailSyncWarning:
        'Email đăng nhập chưa đồng bộ xong. Nếu trạng thái này kéo dài, hãy báo bộ phận vận hành kiểm tra.',
      edit: {
        title: 'Sửa hồ sơ {{name}}',
        description:
          'Cập nhật thông tin nhân sự. Vai trò và phạm vi truy cập được giữ nguyên.',
        noManager: 'Không có cấp trên trực tiếp',
        roleHint:
          'Đổi đơn vị công tác không tự đổi vai trò. Hãy kiểm tra lại phần Quyền truy cập sau khi lưu.',
        reason: 'Lý do cập nhật (không bắt buộc)',
        success: 'Đã cập nhật hồ sơ nhân viên.',
        noChanges: 'Hồ sơ không có thay đổi để lưu.',
      },
      email: {
        title: 'Đổi email công việc',
        description:
          'Email này cũng dùng để đăng nhập. Với tài khoản chờ kích hoạt, liên kết cũ sẽ hết hiệu lực và thư mới được gửi lại.',
        newEmail: 'Email mới',
        reason: 'Lý do đổi email',
        note: 'Ghi chú',
        submit: 'Xác nhận đổi email',
        success: 'Đã đổi email công việc.',
        invalid: 'Vui lòng nhập email hợp lệ.',
        reasonRequired: 'Vui lòng chọn lý do.',
        noteRequired: 'Vui lòng nhập ít nhất 2 ký tự.',
      },
    },
    termination: {
      button: 'Cho nghỉ việc',
      title: 'Cho {{name}} nghỉ việc',
      description:
        'Tài khoản sẽ ngừng hoạt động, mọi vai trò và phiên đăng nhập sẽ bị đóng.',
      reports: 'Cấp dưới',
      roles: 'Vai trò mở',
      assets: 'Tài sản',
      assetHandoverTitle: 'Bàn giao tài sản trước khi nghỉ việc',
      assetHandoverDescription:
        'Chọn người nhận mới cho từng tài sản. Việc bàn giao và cho nghỉ được lưu cùng nhau.',
      assetHandoverPlaceholder: 'Chọn người nhận tại địa điểm',
      assetHandoverRequired: 'Vui lòng chọn người nhận cho tất cả tài sản.',
      noAssetCandidate:
        'Chưa có người đủ điều kiện tại địa điểm này. Hãy cấp vai trò phù hợp trước.',
      newManager: 'Cấp trên mới cho cấp dưới',
      reason: 'Lý do nghỉ việc',
      note: 'Ghi chú',
      irreversible:
        'Tài khoản Đã ngừng không thể mở lại từ màn hình này. Hồ sơ và lịch sử vẫn được giữ.',
      submit: 'Xác nhận cho nghỉ việc',
      success: 'Đã cho nhân viên nghỉ việc và đóng quyền truy cập.',
      sessionWarning:
        'Tài khoản đã ngừng nhưng chưa thu hồi hết phiên. Mọi yêu cầu mới vẫn bị chặn; hãy báo bộ phận vận hành kiểm tra.',
      managerRequired: 'Vui lòng chọn cấp trên mới cho các cấp dưới.',
      reasonRequired: 'Vui lòng chọn lý do nghỉ việc.',
      noteRequired: 'Vui lòng nhập ít nhất 2 ký tự.',
    },
  },

  organizationChart: {
    title: 'Sơ đồ tổ chức',
    description:
      'Xem quan hệ báo cáo và những hồ sơ nhân viên còn thiếu thông tin tổ chức.',
    readOnly: 'Chỉ đọc · không cấp quyền',
    search: 'Tìm theo tên hoặc mã nhân viên',
    depth: 'Số cấp hiển thị',
    depthValue: '{{count}} cấp',
    allDepths: 'Toàn bộ cấp',
    results: '{{count}} kết quả',
    noResultsHint: 'Thử từ khóa khác. Cây vẫn được giữ nguyên.',
    treeLabel: 'Cây quan hệ báo cáo',
    expand: 'Mở nhánh của {{name}}',
    collapse: 'Gập nhánh của {{name}}',
    directReports: '{{count}} người báo cáo trực tiếp',
    peopleCount: '{{count}} nhân viên',
    expandAll: 'Mở toàn bộ',
    canvasHint:
      'Kéo nền để di chuyển; dùng nút điều khiển để phóng to hoặc thu nhỏ.',
    openProfile: 'Tìm hồ sơ nhân viên {{name}}',
    location: 'Địa điểm làm việc',
    department: 'Phòng ban',
    issuesTitle: 'Dữ liệu cần hoàn thiện',
    issuesDescription: 'Các hồ sơ đang hoạt động cần được quản trị kiểm tra.',
    loadErrorTitle: 'Không tải được sơ đồ tổ chức',
    loadErrorDescription:
      'Chưa có cây nào được hiển thị. Kiểm tra kết nối rồi tải lại.',
    emptyTitle: 'Chưa có nhân viên trên sơ đồ',
    emptyDescription: 'Thêm hồ sơ nhân viên để bắt đầu dựng cơ cấu báo cáo.',
    addEmployee: 'Thêm nhân viên',
    status: {
      ACTIVE: 'Đang hoạt động',
      PENDING_ACTIVATION: 'Chờ kích hoạt',
      SUSPENDED: 'Tạm khóa',
    },
    issue: {
      MANAGER_MISSING: 'Chưa gắn cấp trên trực tiếp',
      MANAGER_UNAVAILABLE: 'Cấp trên không còn trên sơ đồ',
      WORK_UNIT_MISSING: 'Chưa đủ đơn vị công tác',
      MANAGER_CYCLE: 'Quan hệ cấp trên tạo thành vòng',
    },
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
    activationTitle: 'Kích hoạt tài khoản',
    activationDescription: 'Đặt mật khẩu để bắt đầu sử dụng EH-AM.',
    activationChecking: 'Đang kiểm tra liên kết kích hoạt…',
    activationIdentityLabel: 'Tài khoản được mời',
    activationSubmit: 'Kích hoạt tài khoản',
    activationSuccessTitle: 'Tài khoản đã sẵn sàng',
    activationSuccessDescription:
      'Bạn đã đặt mật khẩu thành công. Hãy đăng nhập để bắt đầu.',
    activationInvalidTitle: 'Liên kết không dùng được',
    activationInvalidDescription:
      'Liên kết kích hoạt không hợp lệ. Hãy mở lại email mới nhất được gửi cho bạn.',
    activationExpiredTitle: 'Liên kết đã hết hạn',
    activationExpiredDescription:
      'Vui lòng liên hệ quản trị hệ thống để được gửi lại lời mời.',
    activationUsedTitle: 'Liên kết không còn hiệu lực',
    activationUsedDescription:
      'Nếu bạn đã kích hoạt tài khoản, hãy đăng nhập. Nếu chưa, hãy dùng email mời mới nhất.',
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
    groupPeople: 'Nhân sự & phân quyền',
    groupAssets: 'Tài sản',
    groupSystem: 'Hệ thống',
    dashboard: 'Tổng quan',
    locations: 'Địa điểm',
    costCenters: 'Trung tâm chi phí',
    suppliers: 'Nhà cung cấp',
    repairVendors: 'Đơn vị sửa chữa',
    departments: 'Phòng ban',
    assetTypes: 'Loại tài sản',
    reasonCodes: 'Lý do',
    employees: 'Nhân viên',
    addEmployee: 'Thêm nhân viên',
    organizationChart: 'Sơ đồ tổ chức',
    assets: 'Tài sản',
    cancellationQueue: 'Duyệt huỷ hồ sơ',
  },

  assets: {
    title: 'Tài sản',
    subtitle: 'Lập hồ sơ tài sản & CCDC để có Asset ID và mã QR.',
    addAsset: 'Thêm tài sản',
    empty: {
      title: 'Lập hồ sơ tài sản đầu tiên',
      description:
        'Danh sách tra cứu đầy đủ sẽ có ở bước sau. Bấm "Thêm tài sản" để lập hồ sơ mới.',
    },
    lifecycle: {
      IN_STORAGE: 'Lưu kho',
      IN_USE: 'Đang sử dụng',
    },
    lifecycleFull: {
      IN_STORAGE: 'Lưu kho',
      IN_USE: 'Đang sử dụng',
      UNDER_REPAIR: 'Đang sửa chữa',
      PENDING_DISPOSAL: 'Chờ thanh lý',
      DISPOSED: 'Đã thanh lý',
      CANCELLED: 'Đã huỷ',
    },
    condition: {
      GOOD: 'Tốt',
      NEEDS_REPAIR: 'Cần sửa',
      BROKEN: 'Hỏng',
    },
    list: {
      notProvided: '—',
      searchPlaceholder: 'Tìm theo tên, Asset ID hoặc serial',
      total: '{{count}} tài sản',
      clearFilters: 'Xoá lọc',
      loadErrorTitle: 'Không tải được danh sách tài sản',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử lại.',
      noMatchTitle: 'Không có tài sản nào khớp',
      noMatchDescription: 'Thử đổi từ khoá hoặc bộ lọc.',
      columns: {
        assetCode: 'Asset ID',
        name: 'Tên tài sản',
        type: 'Loại',
        location: 'Địa điểm',
        responsible: 'Người chịu trách nhiệm',
        status: 'Trạng thái',
        condition: 'Tình trạng',
      },
      filters: {
        all: 'Tất cả',
        type: 'Loại tài sản',
        status: 'Trạng thái',
        condition: 'Tình trạng',
        location: 'Địa điểm',
      },
    },
    detail: {
      back: 'Danh sách tài sản',
      activeProfile: 'Hồ sơ đang hoạt động',
      readOnly: 'Hồ sơ đã kết thúc và chỉ có thể xem.',
      notFoundTitle: 'Không tìm thấy tài sản',
      notFoundDescription:
        'Tài sản không tồn tại hoặc bạn không có quyền xem tại địa điểm này.',
      loadErrorTitle: 'Không tải được hồ sơ tài sản',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử lại.',
      sections: {
        asset: 'Thông tin tài sản',
        responsibility: 'Vị trí và trách nhiệm',
        purchase: 'Thông tin mua',
        financial: 'Tài chính',
        documents: 'Chứng từ',
        timeline: 'Lịch sử tài sản',
      },
      fields: {
        type: 'Loại tài sản',
        serial: 'Serial',
        note: 'Ghi chú',
        createdAt: 'Ngày tạo',
        updatedAt: 'Cập nhật gần nhất',
        location: 'Địa điểm',
        responsible: 'Người chịu trách nhiệm',
        costCenter: 'Trung tâm chi phí',
        purchaseDate: 'Ngày mua',
        supplier: 'Nhà cung cấp',
        invoiceNo: 'Số hóa đơn/PO',
        actor: 'Người thực hiện',
        occurredAt: 'Thời điểm',
        reason: 'Lý do',
      },
      documentsDescription: 'Các tệp đi cùng hồ sơ tài sản.',
      noDocuments: 'Chưa có chứng từ đính kèm.',
      noTimeline: 'Chưa có sự kiện nào trong lịch sử tài sản.',
      eventDetails: 'Xem chi tiết',
      systemActor: 'Hệ thống',
      events: {
        'asset.asset.created': 'Tạo hồ sơ tài sản',
        'asset.description.updated': 'Cập nhật thông tin mô tả',
        'asset.responsible.changed': 'Đổi người chịu trách nhiệm',
      },
      changeFields: {
        name: 'Tên tài sản',
        asset_type_id: 'Loại tài sản',
        serial: 'Serial',
        note: 'Ghi chú',
        lifecycle_status: 'Trạng thái vòng đời',
        physical_condition: 'Tình trạng vật lý',
        responsible_user_id: 'Người chịu trách nhiệm',
        primary_location_id: 'Địa điểm',
        cost_center_id: 'Trung tâm chi phí',
        supplier_id: 'Nhà cung cấp',
        purchase_date: 'Ngày mua',
        invoice_no: 'Số hoá đơn/PO',
        original_cost: 'Nguyên giá',
      },
    },
    edit: {
      action: 'Sửa thông tin',
      title: 'Sửa thông tin tài sản',
      description: 'Cập nhật tên, loại, serial và ghi chú của {{code}}.',
      reason: 'Lý do đổi nhóm tài sản',
      reasonPlaceholder: 'Chọn lý do',
      reasonNote: 'Ghi chú lý do',
      success: 'Đã cập nhật thông tin tài sản.',
      versionConflict:
        'Hồ sơ vừa được người khác cập nhật. Hãy tải bản mới nhất trước khi sửa lại.',
      reload: 'Tải bản mới',
      errors: {
        nameRequired: 'Vui lòng nhập tên tài sản.',
        nameTooLong: 'Tên tài sản tối đa 200 ký tự.',
        typeRequired: 'Vui lòng chọn loại tài sản.',
        serialRequired: 'Loại tài sản này bắt buộc có serial.',
        serialTooLong: 'Serial tối đa 100 ký tự.',
        noteTooLong: 'Ghi chú tối đa 1.000 ký tự.',
        reasonRequired: 'Vui lòng chọn lý do khi đổi giữa TSCĐ và CCDC.',
        reasonNoteRequired: 'Vui lòng ghi rõ lý do.',
        reasonTooLong: 'Ghi chú lý do tối đa 500 ký tự.',
        reasonInvalid:
          'Lý do này không còn sử dụng được. Vui lòng chọn lý do khác.',
      },
    },
    responsibility: {
      action: 'Đổi người chịu trách nhiệm',
      title: 'Đổi người chịu trách nhiệm',
      description: 'Bàn giao trách nhiệm cho {{code}} mà không đổi địa điểm.',
      current: 'Người hiện tại',
      newPerson: 'Người chịu trách nhiệm mới',
      personPlaceholder: 'Chọn người tại địa điểm này',
      reason: 'Lý do',
      reasonPlaceholder: 'Chọn lý do',
      reasonNote: 'Ghi chú lý do',
      submit: 'Xác nhận đổi',
      success: 'Đã đổi người chịu trách nhiệm.',
      optionsError:
        'Không tải được danh sách người nhận và lý do. Đóng rồi thử lại.',
      errors: {
        responsibleRequired: 'Vui lòng chọn người chịu trách nhiệm mới.',
        responsibleUnchanged:
          'Hãy chọn người khác với người đang chịu trách nhiệm.',
        reasonRequired: 'Vui lòng chọn lý do.',
        reasonNoteRequired: 'Vui lòng ghi rõ lý do.',
        reasonTooLong: 'Ghi chú lý do tối đa 500 ký tự.',
        noLongerEligible:
          'Người này không còn đủ điều kiện tại địa điểm. Hãy chọn người khác.',
        reasonInvalid: 'Lý do này không còn sử dụng được. Hãy chọn lý do khác.',
      },
    },
    lifecycleChange: {
      action: {
        IN_STORAGE: 'Đưa vào sử dụng',
        IN_USE: 'Ngừng sử dụng',
      },
      description:
        'Đổi trạng thái vòng đời của {{code}}, giữ nguyên địa điểm và người chịu trách nhiệm.',
      reason: 'Lý do',
      reasonPlaceholder: 'Chọn lý do',
      reasonNote: 'Ghi chú lý do',
      submit: 'Xác nhận',
      success: 'Đã đổi trạng thái tài sản.',
      optionsError: 'Không tải được danh mục lý do. Đóng rồi thử lại.',
      errors: {
        reasonRequired: 'Vui lòng chọn lý do.',
        reasonNoteRequired: 'Vui lòng ghi rõ lý do.',
        reasonTooLong: 'Ghi chú lý do tối đa 500 ký tự.',
        reasonInvalid: 'Lý do này không còn sử dụng được. Hãy chọn lý do khác.',
      },
    },
    documents: {
      attachAction: 'Đính kèm chứng từ',
      view: 'Xem',
      empty: 'Chưa có chứng từ',
      emptyHint:
        'Đính kèm hoá đơn, PO, biên bản, phiếu bảo hành hoặc ảnh cho tài sản này.',
      removeFile: 'Gỡ tệp đã chọn',
      uploadTitle: 'Đính kèm chứng từ',
      uploadDescription:
        'Tải chứng từ cho tài sản {{code}} lên kho tệp riêng tư.',
      docType: 'Loại chứng từ',
      docTypePlaceholder: 'Chọn loại chứng từ',
      file: 'Tệp',
      dropzone: 'Kéo thả tệp vào đây hoặc bấm để chọn',
      dropzoneHint: 'PDF, JPG, PNG, WEBP · tối đa 10MB',
      uploading: 'Đang tải lên…',
      uploadSubmit: 'Tải lên',
      uploadSuccess: 'Đã đính kèm chứng từ.',
      types: {
        INVOICE: 'Hoá đơn',
        PO: 'Đơn mua (PO)',
        HANDOVER: 'Biên bản bàn giao',
        WARRANTY: 'Phiếu bảo hành',
        PHOTO: 'Ảnh',
      },
      errors: {
        fileType: 'Định dạng không hỗ trợ. Chỉ nhận PDF, JPG, PNG, WEBP.',
        fileSize: 'Tệp vượt quá 10MB.',
        storage: 'Không tải được tệp lên kho. Vui lòng thử lại.',
        viewFailed: 'Không mở được chứng từ. Vui lòng thử lại.',
      },
      panel: {
        aria: 'Tiến trình tải chứng từ',
        uploading: 'Đang tải lên... {{done}}/{{total}}',
        done: 'Đã tải lên',
        failed: 'Tải lên lỗi',
        speed: 'Tốc độ: {{speed}}',
        doneSummary: 'Đã tải lên {{count}}, tổng số {{size}}',
        failedSummary: '{{count}} tệp tải lên lỗi',
        collapse: 'Thu gọn',
        expand: 'Mở rộng',
        close: 'Đóng',
        itemDone: 'Đã tải lên',
        itemFailed: 'Tải lên thất bại',
      },
    },
    cancellation: {
      requestAction: 'Đề nghị huỷ hồ sơ',
      requestTitle: 'Đề nghị huỷ hồ sơ tạo sai',
      requestDescription:
        'Gửi đề nghị huỷ hồ sơ {{code}}. Một Quản lý tài sản khác sẽ duyệt; hồ sơ không bị xoá.',
      reason: 'Lý do',
      reasonPlaceholder: 'Chọn lý do',
      reasonNote: 'Ghi chú lý do',
      requestSubmit: 'Gửi đề nghị',
      requestSuccess: 'Đã gửi đề nghị huỷ, chờ duyệt.',
      optionsError: 'Không tải được danh mục lý do. Đóng rồi thử lại.',
      queueTitle: 'Duyệt huỷ hồ sơ',
      queueDescription: 'Các đề nghị huỷ hồ sơ tạo sai đang chờ duyệt.',
      queueEmpty: 'Không có đề nghị nào chờ duyệt',
      queueEmptyHint: 'Khi có đề nghị huỷ mới, nó sẽ hiện ở đây.',
      queueError: 'Không tải được hàng đợi duyệt.',
      requestedBy: 'Người đề nghị',
      actions: 'Thao tác',
      approveAction: 'Duyệt huỷ',
      rejectAction: 'Từ chối',
      approveTitle: 'Duyệt huỷ hồ sơ',
      rejectTitle: 'Từ chối đề nghị huỷ',
      decisionDescription: 'Đề nghị huỷ hồ sơ {{code}}.',
      rejectReason: 'Lý do từ chối',
      approveSubmit: 'Xác nhận huỷ hồ sơ',
      rejectSubmit: 'Xác nhận từ chối',
      approveSuccess: 'Đã huỷ hồ sơ.',
      rejectSuccess: 'Đã từ chối đề nghị huỷ.',
      errors: {
        reasonRequired: 'Vui lòng chọn lý do.',
        reasonNoteRequired: 'Vui lòng ghi rõ lý do.',
        reasonTooLong: 'Ghi chú lý do tối đa 500 ký tự.',
        reasonInvalid: 'Lý do này không còn sử dụng được. Hãy chọn lý do khác.',
        selfApproval: 'Cần một Quản lý tài sản khác người đề nghị duyệt.',
      },
    },
    form: {
      title: 'Thêm tài sản',
      name: 'Tên tài sản',
      assetType: 'Loại tài sản',
      assetTypePlaceholder: 'Chọn loại tài sản',
      serial: 'Serial',
      note: 'Ghi chú',
      purchaseDate: 'Ngày mua',
      supplier: 'Nhà cung cấp',
      supplierPlaceholder: 'Chọn nhà cung cấp',
      invoiceNo: 'Số hoá đơn/PO',
      location: 'Địa điểm ban đầu',
      locationPlaceholder: 'Chọn địa điểm',
      responsible: 'Người chịu trách nhiệm',
      responsiblePlaceholder: 'Chọn người chịu trách nhiệm',
      initialStatus: 'Trạng thái ban đầu',
      initialStatusPlaceholder: 'Chọn trạng thái',
      submit: 'Lưu hồ sơ',
      success: 'Đã tạo hồ sơ {{code}}.',
      optionsError: 'Không tải được danh sách chọn. Đóng và thử lại.',
      errors: {
        nameRequired: 'Vui lòng nhập tên tài sản.',
        nameTooLong: 'Tên tối đa 200 ký tự.',
        typeRequired: 'Vui lòng chọn loại tài sản.',
        locationRequired: 'Vui lòng chọn địa điểm.',
        responsibleRequired: 'Vui lòng chọn người chịu trách nhiệm.',
        serialRequired: 'Loại tài sản này bắt buộc nhập serial.',
        serialTooLong: 'Serial tối đa 100 ký tự.',
        noteTooLong: 'Ghi chú tối đa 1000 ký tự.',
        invoiceTooLong: 'Số hoá đơn/PO tối đa 100 ký tự.',
        responsibleNotOnLocation:
          'Người này không có vai trò tại địa điểm đã chọn. Hãy chọn người có vai trò tại đó.',
        generic: 'Giá trị không hợp lệ.',
      },
    },
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
        addressRequired:
          'Hãy chọn đủ tỉnh/thành, phường/xã và nhập số nhà, tên đường.',
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
    suppliers: {
      title: 'Danh mục nhà cung cấp',
      description:
        'Thông tin pháp lý và đầu mối liên hệ dùng khi tiếp nhận, bảo hành và đối soát tài sản.',
      addButton: 'Thêm nhà cung cấp',
      searchPlaceholder: 'Tìm tên, mã số thuế hoặc liên hệ…',
      noMatch: 'Không có nhà cung cấp khớp từ khoá hoặc bộ lọc.',
      emptyTitle: 'Chưa có nhà cung cấp nào',
      emptyDescription:
        'Thêm nhà cung cấp để chọn nhanh khi lập hồ sơ tiếp nhận tài sản.',
      emptyAction: 'Thêm nhà cung cấp đầu tiên',
      loadErrorTitle: 'Không tải được danh sách nhà cung cấp',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử tải lại danh sách.',
      reload: 'Tải lại',
      saved: 'Đã lưu nhà cung cấp {{name}}.',
      notProvided: 'Chưa cung cấp',
      deactivateDescription:
        'Đơn vị và địa điểm bên ngoài này sẽ cùng ngừng hoạt động. Hãy hoàn tất việc nhận tài sản về và các phiếu đang mở trước.',
      columns: {
        name: 'Nhà cung cấp',
        taxId: 'Mã số thuế',
        contact: 'Đầu mối liên hệ',
        status: 'Trạng thái',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      createTitle: 'Thêm nhà cung cấp',
      createDescription:
        'Nhập tên nhà cung cấp. Thông tin pháp lý và liên hệ có thể bổ sung sau.',
      editTitle: 'Sửa nhà cung cấp',
      editDescription:
        'Cập nhật thông tin dùng khi mua sắm, bảo hành và đối soát.',
      form: {
        name: 'Tên nhà cung cấp',
        namePlaceholder: 'VD: Công ty TNHH Thiết bị An Phát',
        taxId: 'Mã số thuế',
        taxIdPlaceholder: '10 chữ số hoặc 10 chữ số-3 chữ số',
        taxIdHint: 'Ví dụ: 0312345678 hoặc 0312345678-001.',
        contactName: 'Người liên hệ',
        contactNamePlaceholder: 'Họ và tên đầu mối',
        contactPhone: 'Số điện thoại',
        contactEmail: 'Email',
      },
      errors: {
        versionConflict:
          'Có người vừa sửa nhà cung cấp này. Hãy tải lại dữ liệu mới nhất rồi nhập lại thay đổi của bạn.',
      },
    },
    repairVendors: {
      title: 'Danh mục đơn vị sửa chữa',
      description:
        'Đối tác nhận tài sản để sửa chữa hoặc bảo hành, gắn với một địa điểm bên ngoài.',
      addButton: 'Thêm đơn vị sửa chữa',
      searchPlaceholder: 'Tìm tên hoặc thông tin liên hệ…',
      emptyTitle: 'Chưa có đơn vị sửa chữa nào',
      emptyDescription:
        'Thêm đối tác để có điểm đến khi gửi tài sản đi sửa hoặc bảo hành.',
      emptyAction: 'Thêm đơn vị sửa chữa đầu tiên',
      loadErrorTitle: 'Không tải được danh sách đơn vị sửa chữa',
      loadErrorDescription: 'Kiểm tra kết nối rồi thử tải lại danh sách.',
      saved: 'Đã lưu đơn vị sửa chữa {{name}}.',
      reload: 'Tải lại',
      notProvided: 'Chưa cung cấp',
      columns: {
        name: 'Đơn vị',
        services: 'Dịch vụ',
        location: 'Địa điểm đích',
        contact: 'Đầu mối liên hệ',
        status: 'Trạng thái',
      },
      service: {
        REPAIR: 'Sửa chữa',
        WARRANTY: 'Bảo hành',
      },
      status: {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Ngừng hoạt động',
      },
      createTitle: 'Thêm đơn vị sửa chữa',
      createDescription:
        'Chọn địa điểm bên ngoài sẽ dùng làm điểm gửi tài sản.',
      editTitle: 'Sửa đơn vị sửa chữa',
      editDescription:
        'Địa điểm đích được giữ nguyên để lịch sử điều chuyển luôn nhất quán.',
      form: {
        name: 'Tên đơn vị',
        services: 'Loại dịch vụ',
        location: 'Địa điểm bên ngoài',
        locationPlaceholder: 'Chọn địa điểm chưa gắn đơn vị',
        noLocations: 'Chưa có địa điểm bên ngoài còn trống.',
        openLocations: 'Mở Danh mục địa điểm',
        contactName: 'Người liên hệ',
        contactPhone: 'Số điện thoại',
        contactEmail: 'Email',
      },
      errors: {
        locationUnavailable:
          'Địa điểm này vừa được sử dụng hoặc không còn hoạt động. Hãy chọn địa điểm khác.',
        versionConflict:
          'Dữ liệu vừa được người khác thay đổi. Hãy tải lại rồi thực hiện lại thao tác.',
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
        duplicateCode: 'Mã đã dùng (kể cả mục đã ngừng cũng không dùng lại).',
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
        LOCATION_CLOSE: 'Đóng địa điểm',
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
