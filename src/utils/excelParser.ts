import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import type { RawPatientRecord, PatientRecord } from '../types';

/**
 * Flexible column key matching
 */
function findColumnValue(row: RawPatientRecord, possibleKeys: string[]): any {
  const rowKeys = Object.keys(row);
  for (const pKey of possibleKeys) {
    const normalizedTarget = pKey.toLowerCase().replace(/[\s_-]/g, '');
    const foundKey = rowKeys.find(
      (rk) => rk.toLowerCase().replace(/[\s_-]/g, '') === normalizedTarget
    );
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
      return row[foundKey];
    }
  }
  return null;
}

/**
 * Parse raw date values from Excel serial numbers, strings, or JS Date objects
 */
function parseExcelDate(val: any): { formatted: string; day: string; hour: number } | null {
  if (val === null || val === undefined || val === '') return null;

  let d: dayjs.Dayjs | null = null;

  if (val instanceof Date) {
    d = dayjs(val);
  } else if (typeof val === 'number') {
    // Excel serial date number offset calculation
    const parsedDate = XLSX.SSF.parse_date_code(val);
    if (parsedDate) {
      d = dayjs(new Date(parsedDate.y, parsedDate.m - 1, parsedDate.d, parsedDate.H, parsedDate.M, parsedDate.S));
    }
  } else if (typeof val === 'string') {
    const str = val.trim();
    // Try standard formats
    const attempt = dayjs(str);
    if (attempt.isValid()) {
      d = attempt;
    }
  }

  if (d && d.isValid() && d.year() > 1900) {
    return {
      formatted: d.format('YYYY-MM-DD HH:mm'),
      day: d.format('YYYY-MM-DD'),
      hour: d.hour()
    };
  }

  return null;
}

/**
 * Calculate age and age group from birth date
 */
function calculateAgeAndGroup(birthDateVal: any): { age: number; ageGroup: PatientRecord['ageGroup'] } {
  let age = 30; // default average if missing
  const parsed = parseExcelDate(birthDateVal);
  if (parsed) {
    const yearsDiff = dayjs().diff(dayjs(parsed.day), 'year');
    if (yearsDiff >= 0 && yearsDiff <= 120) {
      age = yearsDiff;
    }
  }

  let ageGroup: PatientRecord['ageGroup'] = 'شباب (15-35)';
  if (age <= 14) ageGroup = 'أطفال (0-14)';
  else if (age <= 35) ageGroup = 'شباب (15-35)';
  else if (age <= 59) ageGroup = 'بالغين (36-59)';
  else ageGroup = 'كبار السن (60+)';

  return { age, ageGroup };
}

/**
 * Normalize Gender string to Arabic 'ذكر' / 'أنثى' / 'غير محدد'
 */
function normalizeGender(val: any): 'ذكر' | 'أنثى' | 'غير محدد' {
  if (!val) return 'غير محدد';
  const str = String(val).trim().toLowerCase();
  if (str.startsWith('m') || str === 'ذكر' || str.startsWith('male')) return 'ذكر';
  if (str.startsWith('f') || str === 'أنثى' || str.startsWith('female')) return 'أنثى';
  return 'غير محدد';
}

/**
 * Transform raw row object into normalized PatientRecord
 */
export function normalizeRawRecord(row: RawPatientRecord, index: number, sourceFile: string): PatientRecord {
  const regionCode = String(findColumnValue(row, ['Region Code', 'RegionCode', 'كود المنطقة']) || '');
  const regionName = String(findColumnValue(row, ['Region_Name', 'Region Name', 'المنطقة']) || '');
  const facilityId = String(findColumnValue(row, ['Facility Id', 'FacilityId', 'كود المنشأة']) || '');
  const facilityName = String(findColumnValue(row, ['Facility Name', 'FacilityName', 'اسم المنشأة', 'المستشفى']) || '');
  const patientId = String(findColumnValue(row, ['Patient ID', 'PatientId', 'رقم المريض']) || '');
  const patientName = String(findColumnValue(row, ['Patient Name', 'PatientName', 'اسم المريض']) || '');

  const birthDateVal = findColumnValue(row, ['Birth Date', 'BirthDate', 'تاريخ الميلاد']);
  const { age, ageGroup } = calculateAgeAndGroup(birthDateVal);
  const birthDateStr = parseExcelDate(birthDateVal)?.day || '';

  const gender = normalizeGender(findColumnValue(row, ['patient gender', 'gender', 'الجنس']));
  const billingGroup = String(findColumnValue(row, ['Billing Group Desc', 'BillingGroup', 'فئة الفاتورة', 'التأمين']) || '');

  // Dates
  const checkInObj = parseExcelDate(findColumnValue(row, ['Check in Date', 'CheckInDate', 'تاريخ التسجيل']));
  const assignObj = parseExcelDate(findColumnValue(row, ['Assign Date', 'AssignDate', 'تاريخ التحويل']));
  const consultObj = parseExcelDate(findColumnValue(row, ['Consultation Date', 'ConsultationDate', 'تاريخ الكشف']));
  const checkOutObj = parseExcelDate(findColumnValue(row, ['Check Out Date', 'CheckOutDate', 'تاريخ الخروج']));

  const checkInDate = checkInObj?.formatted || '';
  const assignDate = assignObj?.formatted || '';
  const consultationDate = consultObj?.formatted || '';
  const checkOutDate = checkOutObj?.formatted || '';

  // Compute minute differences
  let waitTimeMinutes: number | null = null;
  if (checkInObj && assignObj) {
    const diff = dayjs(assignObj.formatted).diff(dayjs(checkInObj.formatted), 'minute');
    waitTimeMinutes = diff >= 0 ? diff : 0;
  }

  let consultationTimeMinutes: number | null = null;
  if (consultObj && checkOutObj) {
    const diff = dayjs(checkOutObj.formatted).diff(dayjs(consultObj.formatted), 'minute');
    consultationTimeMinutes = diff >= 0 ? diff : 0;
  }

  let totalTurnaroundMinutes: number | null = null;
  if (checkInObj && checkOutObj) {
    const diff = dayjs(checkOutObj.formatted).diff(dayjs(checkInObj.formatted), 'minute');
    totalTurnaroundMinutes = diff >= 0 ? diff : 0;
  }

  const rawStatus = String(findColumnValue(row, ['Queue Status Desc', 'QueueStatus', 'حالة الطابور', 'حالة الاستشارة']) || '');
  let queueStatus = '';
  if (rawStatus) {
    if (rawStatus.toLowerCase().includes('cancel') || rawStatus.includes('ملغاة')) queueStatus = 'ملغاة';
    else if (rawStatus.toLowerCase().includes('wait') || rawStatus.includes('انتظار')) queueStatus = 'قيد الانتظار';
    else if (rawStatus.toLowerCase().includes('progress') || rawStatus.includes('قيد')) queueStatus = 'قيد الكشف';
    else queueStatus = 'مكتمل';
  }

  const consultPerformedBy = String(findColumnValue(row, ['Consult Performed By', 'Consultant', 'اسم الطبيب', 'الطبيب المعالج']) || '');
  const consultPerformedDate = parseExcelDate(findColumnValue(row, ['Consult Performed Date', 'ConsultDate']))?.formatted || '';

  return {
    id: `${sourceFile}-${index}-${patientId}`,
    regionCode,
    regionName,
    facilityId,
    facilityName,
    patientId,
    patientName,
    birthDate: birthDateStr,
    age,
    ageGroup,
    gender,
    billingGroup,
    checkInDate,
    assignDate,
    consultationDate,
    checkOutDate,
    queueStatus,
    consultPerformedBy,
    consultPerformedDate,
    waitTimeMinutes,
    consultationTimeMinutes,
    totalTurnaroundMinutes,
    checkInHour: checkInObj?.hour ?? 0,
    checkInDay: checkInObj?.day || '',
    sourceFile
  };
}

/**
 * Parse an Excel File (.xlsx, .xls)
 */
export async function parseExcelFile(file: File): Promise<PatientRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: RawPatientRecord[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

        const records = jsonRows.map((row, idx) => normalizeRawRecord(row, idx, file.name));
        resolve(records);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse a CSV File
 */
export async function parseCSVFile(file: File): Promise<PatientRecord[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawPatientRecord>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const records = results.data.map((row, idx) => normalizeRawRecord(row, idx, file.name));
          resolve(records);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err)
    });
  });
}
