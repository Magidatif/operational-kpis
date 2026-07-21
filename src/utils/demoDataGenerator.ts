import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import type { PatientRecord } from '../types';

const ARABIC_FIRST_NAMES = [
  'محمد', 'أحمد', 'محمود', 'مصطفى', 'علي', 'عمر', 'يوسف', 'خالد', 'عبدالله', 'إبراهيم',
  'فاطمة', 'مريم', 'سارة', 'نور', 'ياسمين', 'آية', 'زينب', 'هدى', 'منى', 'رانيا',
  'طارق', 'حسام', 'كريم', 'شريف', 'زياد', 'سلمى', 'داليا', 'دينا', 'وليد', 'شهد'
];

const ARABIC_LAST_NAMES = [
  'السيد', 'عبدالرحمن', 'إبراهيم', 'حسن', 'حسين', 'الشريف', 'العوضي', 'الشناوي',
  'المصري', 'الفاروق', 'النجار', 'سليمان', 'شاهين', 'بدوي', 'الحداد', 'منصور'
];

const REGIONS = [
  { code: 'REG-01', name: 'منطقة الرياض المركزية' },
  { code: 'REG-02', name: 'منطقة مكة المكرمة' },
  { code: 'REG-03', name: 'المنطقة الشرقية' },
  { code: 'REG-04', name: 'منطقة عسير والجنوب' }
];

const FACILITIES = [
  { id: 'FAC-101', name: 'مستشفى الملك فهد التخصصي', regionIndex: 0 },
  { id: 'FAC-102', name: 'مركز الصحة الأولي بالملز', regionIndex: 0 },
  { id: 'FAC-201', name: 'مستشفى النور العام بمكة', regionIndex: 1 },
  { id: 'FAC-202', name: 'مجمع جدة الطبي العام', regionIndex: 1 },
  { id: 'FAC-301', name: 'مستشفى الدمام المركزي', regionIndex: 2 },
  { id: 'FAC-401', name: 'مستشفى عسير المركزي', regionIndex: 3 }
];

const DOCTORS = [
  'د. محمد عبدالفتاح (استشاري باطنة)',
  'د. أحمد الزهراني (استشاري أطفال)',
  'د. سارة الغامدي (طبيب عام)',
  'د. خالد العتيبي (جراحة عامة)',
  'د. فاطمة الشمري (نساء وولادة)',
  'د. حسام الدين القحطاني (عظام)',
  'د. منى السعيد (جلدية)',
  'د. طارق الشهري (قلب وأوعية)',
  'د. كريم عبدالمجيد (عيون)',
  'د. داليا سالم (أنف وأذن وحنجرة)'
];

const BILLING_GROUPS = [
  'تأمين صحي ممتاز (VIP)',
  'تأمين صحي حكومي شامل',
  'تأمين شركة التعاونية',
  'تأمين بوبا العربية',
  'علاج مباشر (سداد نقدي)',
  'ضمان صحي أولي'
];

const QUEUE_STATUSES = [
  'مكتمل',
  'مكتمل',
  'مكتمل',
  'مكتمل',
  'قيد الانتظار',
  'قيد الكشف',
  'ملغاة'
];

/**
 * Generate 220 realistic demo records
 */
export function generateDemoData(): PatientRecord[] {
  const records: PatientRecord[] = [];
  const baseDate = dayjs();

  for (let i = 0; i < 220; i++) {
    const fn = ARABIC_FIRST_NAMES[Math.floor(Math.random() * ARABIC_FIRST_NAMES.length)];
    const ln = ARABIC_LAST_NAMES[Math.floor(Math.random() * ARABIC_LAST_NAMES.length)];
    const patientName = `${fn} ${ln}`;
    const isFemale = ['فاطمة', 'مريم', 'سارة', 'نور', 'ياسمين', 'آية', 'زينب', 'هدى', 'منى', 'رانيا', 'سلمى', 'داليا', 'دينا', 'شهد'].includes(fn);
    const gender: PatientRecord['gender'] = isFemale ? 'أنثى' : 'ذكر';

    const facObj = FACILITIES[Math.floor(Math.random() * FACILITIES.length)];
    const regObj = REGIONS[facObj.regionIndex];
    const doctor = DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
    const billing = BILLING_GROUPS[Math.floor(Math.random() * BILLING_GROUPS.length)];
    const queueStatus = QUEUE_STATUSES[Math.floor(Math.random() * QUEUE_STATUSES.length)];

    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    // Peak hours weighted towards 09:00 - 13:00 and 17:00 - 21:00
    let checkInHour = Math.floor(Math.random() * 24);
    if (Math.random() > 0.3) {
      checkInHour = Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 9 : Math.floor(Math.random() * 4) + 17;
    }
    const checkInMinute = Math.floor(Math.random() * 60);

    const checkIn = baseDate.subtract(daysAgo, 'day').hour(checkInHour).minute(checkInMinute);

    // Wait time between 8 and 65 mins
    const waitTimeMins = Math.floor(Math.random() * 55) + 8;
    const assign = checkIn.add(waitTimeMins, 'minute');

    // Consult time between 5 and 30 mins
    const consultTimeMins = Math.floor(Math.random() * 25) + 5;
    const checkOut = assign.add(consultTimeMins, 'minute');

    // Random age between 2 and 82
    const age = Math.floor(Math.random() * 80) + 2;
    let ageGroup: PatientRecord['ageGroup'] = 'شباب (15-35)';
    if (age <= 14) ageGroup = 'أطفال (0-14)';
    else if (age <= 35) ageGroup = 'شباب (15-35)';
    else if (age <= 59) ageGroup = 'بالغين (36-59)';
    else ageGroup = 'كبار السن (60+)';

    const birthDateStr = baseDate.subtract(age, 'year').subtract(Math.floor(Math.random() * 300), 'day').format('YYYY-MM-DD');

    records.push({
      id: `demo-${i + 1}`,
      regionCode: regObj.code,
      regionName: regObj.name,
      facilityId: facObj.id,
      facilityName: facObj.name,
      patientId: `P-${20000 + i}`,
      patientName,
      birthDate: birthDateStr,
      age,
      ageGroup,
      gender,
      billingGroup: billing,
      checkInDate: checkIn.format('YYYY-MM-DD HH:mm'),
      assignDate: assign.format('YYYY-MM-DD HH:mm'),
      consultationDate: assign.format('YYYY-MM-DD HH:mm'),
      checkOutDate: checkOut.format('YYYY-MM-DD HH:mm'),
      queueStatus,
      consultPerformedBy: doctor,
      consultPerformedDate: assign.format('YYYY-MM-DD HH:mm'),
      waitTimeMinutes: waitTimeMins,
      consultationTimeMinutes: consultTimeMins,
      totalTurnaroundMinutes: waitTimeMins + consultTimeMins,
      checkInHour,
      checkInDay: checkIn.format('YYYY-MM-DD'),
      sourceFile: 'بيانات تجريبية (Demo)'
    });
  }

  return records;
}

/**
 * Export sample Excel file formatted with standard column headers
 */
export function downloadSampleExcel() {
  const sampleRows = [
    {
      'Region Code': 'REG-01',
      'Region_Name': 'منطقة الرياض المركزية',
      'Facility Id': 'FAC-101',
      'Facility Name': 'مستشفى الملك فهد التخصصي',
      'Patient ID': 'PT-1001',
      'Patient Name': 'أحمد عبدالله علي',
      'Birth Date': '1992-05-14',
      'patient gender': 'ذكر',
      'Billing Group Desc': 'تأمين صحي حكومي شامل',
      'Check in Date': '2026-07-20 09:15',
      'Assign Date': '2026-07-20 09:35',
      'Consultation Date': '2026-07-20 09:37',
      'Check Out Date': '2026-07-20 09:55',
      'Queue Status Desc': 'مكتمل (Completed)',
      'Consult Performed By': 'د. محمد عبدالفتاح',
      'Consult Performed Date': '2026-07-20 09:37'
    },
    {
      'Region Code': 'REG-02',
      'Region_Name': 'منطقة مكة المكرمة',
      'Facility Id': 'FAC-201',
      'Facility Name': 'مستشفى النور العام بمكة',
      'Patient ID': 'PT-1002',
      'Patient Name': 'فاطمة إبراهيم الشريف',
      'Birth Date': '1985-11-20',
      'patient gender': 'أنثى',
      'Billing Group Desc': 'تأمين شركة التعاونية',
      'Check in Date': '2026-07-20 10:05',
      'Assign Date': '2026-07-20 10:45',
      'Consultation Date': '2026-07-20 10:48',
      'Check Out Date': '2026-07-20 11:10',
      'Queue Status Desc': 'مكتمل (Completed)',
      'Consult Performed By': 'د. خلود الزهراني',
      'Consult Performed Date': '2026-07-20 10:48'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'بيانات المرضى');
  XLSX.writeFile(workbook, 'Healthcare_Patients_Sample_Template.xlsx');
}
