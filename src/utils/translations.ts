export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Header
    appTitle: 'مؤشرات الاداء التشغيلية',
    interactiveBadge: 'تفاعلي',
    appSubTitle: 'تحليل كفاءة العمليات، زمن الانتظار، الديموغرافيا والعيادات',
    tabOverview: 'التحليل العام',
    tabComparison: 'المقارنة التفاعلية',
    tabDataTable: 'جدول البيانات',
    btnDemoData: 'بيانات تجريبية',
    btnClear: 'مسح',
    btnTemplate: 'تنزيل قالب Excel',
    btnCloudflare: 'Cloudflare',

    // File Uploader
    uploaderTitle: 'رفع واستيراد البيانات (Excel / CSV)',
    uploaderSubTitle: 'يمكنك رفع ملف واحد أو ملفات متعددة لمقارنة الفترات الزمنية والمستشفيات مباشرة',
    filesUploadedCount: (files: number, records: number) => `تم رفع ${files} ملف (${records} سجل)`,
    dropzoneText: 'أسقط ملفات Excel (.xlsx) أو CSV هنا، أو انقر للاختيار',
    dropzoneColumnsInfo: 'الأعمدة المطلوبة: Facility Name, Patient ID, Check in Date, Assign Date, Consultation Date, Check Out Date, Queue Status Desc, Consult Performed By',
    uploadedFilesLabel: 'الملفات المرفوعة:',
    noFilePrompt: 'ليس لديك ملف الآن؟ اضغط هنا لتحميل 220 سجلاً تجريبياً فوراً',
    readingFiles: 'جاري قراءة ومعالجة الملفات...',
    fileErrorUnsupported: (ext: string) => `عذراً، امتداد الملف .${ext} غير مدعوم. يرجى اختيار ملف Excel أو CSV.`,
    fileErrorEmpty: (name: string) => `الملف ${name} لا يحتوي على سجلات أو بيانات صالحة.`,
    fileErrorParse: (name: string) => `حدث خطأ أثناء قراءة الملف ${name}. تأكد من تنسيق البيانات.`,

    // Empty State
    emptyStateTitle: 'في انتظار رفع ملفات البيانات',
    emptyStateDesc: 'قم بسحب وإسقاط ملفات Excel أو CSV في المنطقة أعلاه لعرض الداشبورد التفاعلي والمقارنات فوراً.',
    emptyStateBtn: 'أو انقر هنا لتجربة الداشبورد ببيانات تجريبية',

    // Filters Bar
    filtersTitle: 'فلاتر التصفية والتصنيف (Slicers)',
    showingCount: (filtered: number, total: number) => `يعرض ${filtered} من ${total} مريض`,
    datePresetsLabel: 'اختصار الفترة:',
    presetAll: 'الكل',
    presetToday: 'اليوم',
    presetWeek: 'آخر 7 أيام',
    presetMonth: 'آخر 30 يوماً',
    resetFilters: 'إعادة ضبط الفلاتر',
    fromDate: 'من تاريخ:',
    toDate: 'إلى تاريخ:',
    facilityLabel: 'المنشأة / المستشفى:',
    allFacilities: (count: number) => `كافة المنشآت (${count})`,
    billingLabel: 'فئة الفاتورة / التأمين:',
    allBilling: 'كافة فئات التأمين',
    queueLabel: 'حالة الطابور:',
    allQueueStatuses: 'كافة الحالات',
    searchLabel: 'بحث سريع:',
    searchPlaceholder: 'اسم المريض، الطبيب...',

    // KPIs Cards
    kpiTotalPatients: 'إجمالي عدد المرضى',
    kpiTotalPatientsSub: 'عدّاد فريد لـ Patient ID',
    kpiAvgWaitTime: 'متوسط زمن الانتظار',
    kpiAvgWaitTimeSub: '(Assign Date - Check in Date)',
    kpiAvgConsultTime: 'متوسط زمن الكشف',
    kpiAvgConsultTimeSub: '(Check Out - Consultation Date)',
    kpiCompletedConsultations: 'الاستشارات المكتملة',
    kpiCompletedConsultationsSub: 'تصفية حسب Queue Status Desc',
    minutesUnit: 'دقيقة',
    formatDuration: (totalMinutes: number) => {
      if (totalMinutes === null || totalMinutes === undefined || isNaN(totalMinutes)) return '-';
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = Math.floor(totalMinutes % 60);
      
      const parts = [];
      if (days > 0) parts.push(`${days} يوم`);
      if (hours > 0) parts.push(`${hours} ساعة`);
      if (minutes > 0 || parts.length === 0) parts.push(`${minutes} دقيقة`);
      
      return parts.join(' و ');
    },
    completionPercentage: (rate: number) => `${rate}% إنجاز`,

    // Operational Efficiency
    peakHoursTitle: 'تحليل أوقات الذروة خلال اليوم (Peak Hours)',
    peakHoursSub: 'توزيع تسجيل دخول المرضى حسب ساعات اليوم بناءً على Check in Date',
    highestPeakBadge: (hour: string, count: number) => `أعلى ذروة الساعة ${hour} (${count} مريض)`,
    patientsUnit: 'مريض',
    hourLabel: 'الساعة:',
    countLabel: 'عدد المرضى',
    waitTimeTitle: 'تحليل الازدحام متوسط زمن الانتظار (بالدقائق)',
    waitTimeSub: 'تحديد المنشآت أو المناطق الأكثر تضرراً وتأخراً في خدمة المرضى',
    patientFlowTitle: 'تحليل حركة المرضى (تسجيل الدخول مقابل الخروج)',
    patientFlowSub: 'مقارنة بين إجمالي عدد حالات Check in و Check Out حسب التاريخ',
    checkInLabel: 'تسجيل دخول',
    checkOutLabel: 'تسجيل خروج',
    btnHospital: 'المستشفى',
    btnRegion: 'المنطقة',

    // Consultants Analysis
    doctorsTitle: 'ترتيب الأطباء الأكثر إنجازاً للكشوفات (Consult Performed By)',
    doctorsSub: 'ترتيب الأطباء حسب عدد الاستشارات المكتملة ومتوسط زمن الاستشارة',
    searchDoctorPlaceholder: 'بحث عن طبيب...',
    btnChart: 'رسم بياني',
    btnTable: 'جدول',
    colRank: '#',
    colDoctorName: 'اسم الطبيب',
    colFacility: 'المنشأة',
    colCompletedCount: 'الكشوفات المكتملة',
    colAvgConsultTime: 'متوسط زمن الكشف',
    colAvgWaitTime: 'متوسط زمن الانتظار',
    queueStatusTitle: 'توزيع حالة الطابور (Queue Status)',
    queueStatusSub: 'نسبة الحالات المكتملة، الملغاة، وتجربة انتظار المرضى',
    queueCompleted: 'مكتمل',
    queueWaiting: 'قيد الانتظار',
    queueInProgress: 'قيد الكشف',
    queueCancelled: 'ملغاة',

    // Demographics Analysis
    genderTitle: 'توزيع المرضى حسب الجنس (Gender)',
    genderSub: 'نسبة الذكور والإناث من إجمالي المرضى المسجلين',
    genderMale: 'ذكر',
    genderFemale: 'أنثى',
    genderUnknown: 'غير محدد',
    billingTitle: 'فئات الفواتير والتأمين (Billing Group)',
    billingSub: 'توزيع المرضى حسب الشركات أو جهات الضمان الصحي',
    ageGroupTitle: 'فئات الأعمار (Age Groups)',
    ageGroupSub: 'حساب العمر تلقائياً من Birth Date وتقسيمهم لفئات',
    ageChildren: 'أطفال (0-14)',
    ageYouth: 'شباب (15-35)',
    ageAdults: 'بالغين (36-59)',
    ageSeniors: 'كبار السن (60+)',

    // Comparison View
    comparisonMatrixTitle: 'وحدة المقارنة التفاعلية (Comparison Matrix)',
    comparisonMatrixSub: 'اختر نوع المقارنة المطلوبة للتحليل المباشر بين المستشفيات أو بين الفترات الزمنية',
    cmpByFacilityBtn: 'المقارنة بالمنشأة / المستشفى',
    cmpByPeriodBtn: 'المقارنة بالفترة الزمنية',
    cmpFacilityChartTitle: 'مقارنة مؤشرات أداء المستشفيات (Side-by-Side Facility Comparison)',
    cmpFacilityChartSub: 'مقارنة حجم المرضى ومتوسط زمن الانتظار وزمن الكشف بين جميع المنشآت',
    cmpFacilityTableTitle: 'جدول المقارنة التفصيلي للمنشآت',
    colActiveDoctors: 'عدد الأطباء النشطين',
    colCongestionStatus: 'تقييم الازدحام',
    statusHighCongestion: 'ازدحام مرتفع',
    statusBalancedPerformance: 'أداء متوازن',
    doctorsUnit: 'طبيب',
    periodPickerTitle: 'تحديد الفترتين الزمنيتين للمقارنة',
    period1Title: 'الفترة الأولى (المرجعية):',
    period2Title: 'الفترة الثانية (المقارنة):',
    period1LabelText: (start: string, end: string) => `الفترة الأولى (${start || 'البداية'} - ${end || 'النهاية'})`,
    period2LabelText: (start: string, end: string) => `الفترة الثانية (${start || 'البداية'} - ${end || 'النهاية'})`,
    periodVal1: (val: any) => `الفترة 1: ${val}`,
    periodVal2: (val: any) => `الفترة 2: ${val}`,

    // Data Table View
    tableTitle: 'سجل البيانات المعالجة والتفصيلية',
    tableSub: (filtered: number, total: number) => `عرض ${filtered} سجل من إجمالي ${total} سجل متاح`,
    tableSearchPlaceholder: 'بحث باسم المريض أو الطبيب...',
    btnExportExcel: 'تصدير Excel',
    noMatchingRecords: 'لا توجد سجلات مطابقة للبحث أو الفلاتر المحددة.',
    paginationText: (current: number, total: number) => `الصفحة ${current} من ${total}`,

    // Cloudflare Deploy Modal
    cfModalTitle: 'دليل النشر والرفع على Cloudflare Pages',
    cfModalSub: 'خطوات سريعة ومجانية لنشر الداشبورد أونلاين برابط مباشر',
    cfStep1Title: 'بناء نسخة الإنتاج (Production Build):',
    cfStep1Desc: 'قم بفتح أسطر الأوامر في مجلد المشروع وشغل الأمر:',
    cfStep1Note: 'سيتم إنشاء مجلد باسم dist يحتوي على التطبيق الجاهز.',
    cfStep2Title: 'النشر الفوري باستخدام Wrangler (CLI):',
    cfStep3Title: 'النشر التلقائي عبر GitHub:',
    cfStep3Steps: [
      'قم برفع هذا المشروع على مستودع (Repository) في GitHub.',
      'انتقل إلى لوحة التحكم في Cloudflare Dashboard > Workers & Pages > Create Application > Pages.',
      'اختر مستودع GitHub وحدد Framework preset: Vite وقم بالضغط على Save and Deploy.'
    ],
    btnUnderstand: 'فهمت ذلك'
  },
  en: {
    // Header
    appTitle: 'Healthcare KPI & Operational Dashboard',
    interactiveBadge: 'Interactive',
    appSubTitle: 'Operational efficiency, wait times, demographics, and clinic analytics',
    tabOverview: 'Overview',
    tabComparison: 'Comparative Analytics',
    tabDataTable: 'Data Table',
    btnDemoData: 'Demo Data',
    btnClear: 'Clear',
    btnTemplate: 'Download Excel Template',
    btnCloudflare: 'Cloudflare',

    // File Uploader
    uploaderTitle: 'Data Import (Excel / CSV)',
    uploaderSubTitle: 'Upload single or multiple files to instantly compare time periods and facilities',
    filesUploadedCount: (files: number, records: number) => `${files} files uploaded (${records} records)`,
    dropzoneText: 'Drop Excel (.xlsx) or CSV files here, or click to browse',
    dropzoneColumnsInfo: 'Supported Columns: Facility Name, Patient ID, Check in Date, Assign Date, Consultation Date, Check Out Date, Queue Status Desc, Consult Performed By',
    uploadedFilesLabel: 'Uploaded Files:',
    noFilePrompt: 'No file on hand? Click here to load 220 demo records instantly',
    readingFiles: 'Reading & processing files...',
    fileErrorUnsupported: (ext: string) => `Sorry, .${ext} extension is not supported. Please select Excel or CSV.`,
    fileErrorEmpty: (name: string) => `File ${name} contains no valid records.`,
    fileErrorParse: (name: string) => `Error reading file ${name}. Please check column format.`,

    // Empty State
    emptyStateTitle: 'Awaiting Data File Upload',
    emptyStateDesc: 'Drag and drop Excel or CSV files in the zone above to view the interactive dashboard and analytics immediately.',
    emptyStateBtn: 'Or click here to test dashboard with sample demo data',

    // Filters Bar
    filtersTitle: 'Interactive Filters & Slicers',
    showingCount: (filtered: number, total: number) => `Showing ${filtered} of ${total} patients`,
    datePresetsLabel: 'Quick Range:',
    presetAll: 'All',
    presetToday: 'Today',
    presetWeek: 'Last 7 Days',
    presetMonth: 'Last 30 Days',
    resetFilters: 'Reset Filters',
    fromDate: 'From Date:',
    toDate: 'To Date:',
    facilityLabel: 'Facility / Hospital:',
    allFacilities: (count: number) => `All Facilities (${count})`,
    billingLabel: 'Billing / Insurance Group:',
    allBilling: 'All Insurance Groups',
    queueLabel: 'Queue Status:',
    allQueueStatuses: 'All Queue Statuses',
    searchLabel: 'Quick Search:',
    searchPlaceholder: 'Patient name, doctor...',

    // KPIs Cards
    kpiTotalPatients: 'Total Patients',
    kpiTotalPatientsSub: 'Unique counter for Patient ID',
    kpiAvgWaitTime: 'Avg. Wait Time',
    kpiAvgWaitTimeSub: '(Assign Date - Check in Date)',
    kpiAvgConsultTime: 'Avg. Consult Time',
    kpiAvgConsultTimeSub: '(Check Out - Consultation Date)',
    kpiCompletedConsultations: 'Completed Consultations',
    kpiCompletedConsultationsSub: 'Filtered by Queue Status Desc',
    minutesUnit: 'mins',
    formatDuration: (totalMinutes: number) => {
      if (totalMinutes === null || totalMinutes === undefined || isNaN(totalMinutes)) return '-';
      const days = Math.floor(totalMinutes / (24 * 60));
      const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
      const minutes = Math.floor(totalMinutes % 60);
      
      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0 || parts.length === 0) parts.push(`${minutes}m`);
      
      return parts.join(' ');
    },
    completionPercentage: (rate: number) => `${rate}% Completed`,

    // Operational Efficiency
    peakHoursTitle: 'Peak Hours Analysis (Check In Date)',
    peakHoursSub: 'Distribution of patient check-ins across 24 hours (00:00 - 23:00)',
    highestPeakBadge: (hour: string, count: number) => `Highest peak at ${hour} (${count} patients)`,
    patientsUnit: 'patients',
    hourLabel: 'Hour:',
    countLabel: 'Patients Count',
    waitTimeTitle: 'Average Wait Time Congestion Analysis (Minutes)',
    waitTimeSub: 'Identify facilities or regions experiencing bottlenecks and service delays',
    patientFlowTitle: 'Patient Flow Analysis (Check In vs Check Out)',
    patientFlowSub: 'Comparison between total Check ins and Check outs by date',
    checkInLabel: 'Check In',
    checkOutLabel: 'Check Out',
    btnHospital: 'Facility',
    btnRegion: 'Region',

    // Consultants Analysis
    doctorsTitle: 'Consultants Performance Ranking (Consult Performed By)',
    doctorsSub: 'Doctors ranked by completed consultations and average consultation duration',
    searchDoctorPlaceholder: 'Search consultant...',
    btnChart: 'Chart',
    btnTable: 'Table',
    colRank: '#',
    colDoctorName: 'Doctor Name',
    colFacility: 'Facility',
    colCompletedCount: 'Completed Consultations',
    colAvgConsultTime: 'Avg. Consult Time',
    colAvgWaitTime: 'Avg. Wait Time',
    queueStatusTitle: 'Queue Status Distribution',
    queueStatusSub: 'Proportion of completed, waiting, in-progress, and cancelled visits',
    queueCompleted: 'Completed',
    queueWaiting: 'Waiting',
    queueInProgress: 'In-Progress',
    queueCancelled: 'Cancelled',

    // Demographics Analysis
    genderTitle: 'Patient Demographics by Gender',
    genderSub: 'Distribution of Male vs Female registered patients',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderUnknown: 'Unspecified',
    billingTitle: 'Billing & Insurance Groups',
    billingSub: 'Patient distribution across insurance providers and billing tiers',
    ageGroupTitle: 'Age Groups Distribution',
    ageGroupSub: 'Calculated automatically from Birth Date',
    ageChildren: 'Children (0-14)',
    ageYouth: 'Youth (15-35)',
    ageAdults: 'Adults (36-59)',
    ageSeniors: 'Seniors (60+)',

    // Comparison View
    comparisonMatrixTitle: 'Interactive Comparison Matrix',
    comparisonMatrixSub: 'Choose comparison mode to analyze side-by-side performance across facilities or time periods',
    cmpByFacilityBtn: 'Facility Comparison',
    cmpByPeriodBtn: 'Time Period Comparison',
    cmpFacilityChartTitle: 'Side-by-Side Facility Performance Metrics',
    cmpFacilityChartSub: 'Compare patient volume, average wait time, and consult duration across facilities',
    cmpFacilityTableTitle: 'Detailed Facility Comparison Breakdown',
    colActiveDoctors: 'Active Doctors',
    colCongestionStatus: 'Congestion Rating',
    statusHighCongestion: 'High Congestion',
    statusBalancedPerformance: 'Balanced Performance',
    doctorsUnit: 'Doctors',
    periodPickerTitle: 'Select Two Time Periods for Comparison',
    period1Title: 'Period 1 (Baseline):',
    period2Title: 'Period 2 (Comparison):',
    period1LabelText: (start: string, end: string) => `Period 1 (${start || 'Start'} - ${end || 'End'})`,
    period2LabelText: (start: string, end: string) => `Period 2 (${start || 'Start'} - ${end || 'End'})`,
    periodVal1: (val: any) => `Period 1: ${val}`,
    periodVal2: (val: any) => `Period 2: ${val}`,

    // Data Table View
    tableTitle: 'Processed Patient Records Table',
    tableSub: (filtered: number, total: number) => `Showing ${filtered} of ${total} available records`,
    tableSearchPlaceholder: 'Search patient name or doctor...',
    btnExportExcel: 'Export Excel',
    noMatchingRecords: 'No records matching search or active filter criteria.',
    paginationText: (current: number, total: number) => `Page ${current} of ${total}`,

    // Cloudflare Deploy Modal
    cfModalTitle: 'Cloudflare Pages Deployment Guide',
    cfModalSub: 'Fast and free steps to publish your interactive dashboard online with a direct URL',
    cfStep1Title: 'Build Production Bundle:',
    cfStep1Desc: 'Open terminal in project directory and execute:',
    cfStep1Note: 'This creates a production-ready folder named dist.',
    cfStep2Title: 'Instant Deployment via Wrangler (CLI):',
    cfStep3Title: 'Automated Deployment via GitHub:',
    cfStep3Steps: [
      'Push this repository to your GitHub account.',
      'Go to Cloudflare Dashboard > Workers & Pages > Create Application > Pages.',
      'Select GitHub repository, choose Framework preset: Vite, and click Save and Deploy.'
    ],
    btnUnderstand: 'Got It'
  }
};
