import dayjs from 'dayjs';
import type {
  PatientRecord,
  FilterState,
  KpiSummary,
  DoctorPerformance,
  FacilityComparisonItem,
  PeriodComparisonSummary
} from '../types';

/**
 * Filter records based on active FilterState
 */
export function filterRecords(records: PatientRecord[], filters: FilterState): PatientRecord[] {
  return records.filter((r) => {
    // Date Range Filter (based on checkInDate)
    if (filters.dateRange.start) {
      if (dayjs(r.checkInDay).isBefore(dayjs(filters.dateRange.start), 'day')) return false;
    }
    if (filters.dateRange.end) {
      if (dayjs(r.checkInDay).isAfter(dayjs(filters.dateRange.end), 'day')) return false;
    }

    // Facility Filter
    if (filters.facilityNames.length > 0 && !filters.facilityNames.includes(r.facilityName)) {
      return false;
    }

    // Region Filter
    if (filters.regionNames.length > 0 && !filters.regionNames.includes(r.regionName)) {
      return false;
    }

    // Billing Group Filter
    if (filters.billingGroups.length > 0 && !filters.billingGroups.includes(r.billingGroup)) {
      return false;
    }

    // Queue Status Filter
    if (filters.queueStatuses.length > 0 && !filters.queueStatuses.includes(r.queueStatus)) {
      return false;
    }

    // Gender Filter
    if (filters.genders.length > 0 && !filters.genders.includes(r.gender)) {
      return false;
    }

    // Search Query (Patient Name, Doctor, ID, Facility)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        r.patientName.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.consultPerformedBy.toLowerCase().includes(q) ||
        r.facilityName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Calculate KPI summary statistics
 */
export function calculateKpis(records: PatientRecord[]): KpiSummary {
  const totalPatients = records.length;
  if (totalPatients === 0) {
    return {
      totalPatients: 0,
      avgWaitTime: 0,
      avgConsultTime: 0,
      completedConsultations: 0,
      totalCancelled: 0,
      totalWaiting: 0,
      totalInProgress: 0,
      completionRate: 0
    };
  }

  // Completed consultations filter
  const completedRecords = records.filter(
    (r) => r.queueStatus.includes('مكتمل') || r.queueStatus.toLowerCase().includes('completed')
  );
  const completedConsultations = completedRecords.length;

  const cancelledRecords = records.filter(
    (r) => r.queueStatus.includes('ملغاة') || r.queueStatus.toLowerCase().includes('cancel')
  );
  const waitingRecords = records.filter(
    (r) => r.queueStatus.includes('انتظار') || r.queueStatus.toLowerCase().includes('wait')
  );
  const inProgressRecords = records.filter(
    (r) => r.queueStatus.includes('قيد') || r.queueStatus.toLowerCase().includes('progress')
  );

  // Avg Wait Time (Assign Date - Check in Date)
  const validWaitTimes = records
    .map((r) => r.waitTimeMinutes)
    .filter((v): v is number => v !== null && v >= 0 && v <= 720); // filter out abnormal values > 12h
  const avgWaitTime =
    validWaitTimes.length > 0
      ? Math.round(validWaitTimes.reduce((acc, curr) => acc + curr, 0) / validWaitTimes.length)
      : 0;

  // Avg Consult Time (Check Out Date - Consultation Date)
  const validConsultTimes = records
    .map((r) => r.consultationTimeMinutes)
    .filter((v): v is number => v !== null && v >= 0 && v <= 360);
  const avgConsultTime =
    validConsultTimes.length > 0
      ? Math.round(validConsultTimes.reduce((acc, curr) => acc + curr, 0) / validConsultTimes.length)
      : 0;

  const completionRate = Math.round((completedConsultations / totalPatients) * 100);

  return {
    totalPatients,
    avgWaitTime,
    avgConsultTime,
    completedConsultations,
    totalCancelled: cancelledRecords.length,
    totalWaiting: waitingRecords.length,
    totalInProgress: inProgressRecords.length,
    completionRate
  };
}

/**
 * Peak hours distribution throughout the day (00:00 - 23:00)
 */
export function calculatePeakHours(records: PatientRecord[]) {
  const hourCounts: { [hour: number]: number } = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }

  records.forEach((r) => {
    if (r.checkInHour >= 0 && r.checkInHour < 24) {
      hourCounts[r.checkInHour]++;
    }
  });

  return Array.from({ length: 24 }, (_, hour) => {
    const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
    return {
      hour: hourFormatted,
      hourNum: hour,
      count: hourCounts[hour]
    };
  });
}

/**
 * Patient Flow Analysis: Check Ins vs Check Outs by Date
 */
export function calculatePatientFlow(records: PatientRecord[]) {
  const flowData: Record<string, { date: string; checkIns: number; checkOuts: number; totalTurnaround: number; countTurnaround: number }> = {};

  records.forEach((r) => {
    // Check Ins
    if (r.checkInDay) {
      if (!flowData[r.checkInDay]) {
        flowData[r.checkInDay] = { date: r.checkInDay, checkIns: 0, checkOuts: 0, totalTurnaround: 0, countTurnaround: 0 };
      }
      flowData[r.checkInDay].checkIns++;

      if (r.totalTurnaroundMinutes !== null && r.totalTurnaroundMinutes >= 0) {
        flowData[r.checkInDay].totalTurnaround += r.totalTurnaroundMinutes;
        flowData[r.checkInDay].countTurnaround++;
      }
    }

    // Check Outs
    if (r.checkOutDate && typeof r.checkOutDate === 'string') {
      const checkOutDay = r.checkOutDate.split(' ')[0];
      if (checkOutDay && checkOutDay.length === 10) {
        if (!flowData[checkOutDay]) {
          flowData[checkOutDay] = { date: checkOutDay, checkIns: 0, checkOuts: 0, totalTurnaround: 0, countTurnaround: 0 };
        }
        flowData[checkOutDay].checkOuts++;
      }
    }
  });

  return Object.values(flowData)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(item => ({
      date: item.date,
      checkIns: item.checkIns,
      checkOuts: item.checkOuts,
      avgTurnaround: item.countTurnaround > 0 ? Math.round(item.totalTurnaround / item.countTurnaround) : 0
    }));
}

/**
 * Average wait time by Facility or Region
 */
export function calculateWaitTimeByGroup(
  records: PatientRecord[],
  groupBy: 'facilityName' | 'regionName'
) {
  const map = new Map<string, { totalWait: number; count: number; totalPatients: number }>();

  records.forEach((r) => {
    const groupKey = r[groupBy] || 'غير محدد';
    if (!map.has(groupKey)) {
      map.set(groupKey, { totalWait: 0, count: 0, totalPatients: 0 });
    }
    const item = map.get(groupKey)!;
    item.totalPatients++;

    if (r.waitTimeMinutes !== null && r.waitTimeMinutes >= 0 && r.waitTimeMinutes <= 720) {
      item.totalWait += r.waitTimeMinutes;
      item.count++;
    }
  });

  return Array.from(map.entries())
    .map(([name, stat]) => ({
      name,
      avgWaitTime: stat.count > 0 ? Math.round(stat.totalWait / stat.count) : 0,
      totalPatients: stat.totalPatients
    }))
    .sort((a, b) => b.avgWaitTime - a.avgWaitTime);
}

/**
 * Doctor performance ranking - Filters out invalid values like Patient IDs or blank strings
 */
export function calculateDoctorPerformance(records: PatientRecord[]): DoctorPerformance[] {
  const map = new Map<
    string,
    { doctorName: string; facilityName: string; completedCount: number; totalConsultTime: number; validConsults: number; totalWaitTime: number; validWaits: number }
  >();

  records.forEach((r) => {
    let docName = (r.consultPerformedBy || '').trim();

    // Filter out empty, unknown, N/A, or accidental ID codes (e.g. starting with P, NO, FAC, REG, digits)
    if (
      !docName ||
      docName === 'غير معروف' ||
      docName === 'غير محدد' ||
      docName === 'N/A'
    ) {
      return;
    }

    if (!map.has(docName)) {
      map.set(docName, {
        doctorName: docName,
        facilityName: r.facilityName || 'المعيارية',
        completedCount: 0,
        totalConsultTime: 0,
        validConsults: 0,
        totalWaitTime: 0,
        validWaits: 0
      });
    }

    const doc = map.get(docName)!;
    doc.completedCount++;

    if (r.consultationTimeMinutes !== null && r.consultationTimeMinutes >= 0) {
      doc.totalConsultTime += r.consultationTimeMinutes;
      doc.validConsults++;
    }

    if (r.waitTimeMinutes !== null && r.waitTimeMinutes >= 0) {
      doc.totalWaitTime += r.waitTimeMinutes;
      doc.validWaits++;
    }
  });

  return Array.from(map.values())
    .map((doc) => ({
      doctorName: doc.doctorName,
      facilityName: doc.facilityName,
      completedCount: doc.completedCount,
      avgConsultTime: doc.validConsults > 0 ? Math.round(doc.totalConsultTime / doc.validConsults) : 0,
      avgWaitTime: doc.validWaits > 0 ? Math.round(doc.totalWaitTime / doc.validWaits) : 0
    }))
    .sort((a, b) => b.completedCount - a.completedCount);
}

/**
 * Distribution of Queue Statuses
 */
export function calculateQueueStatusDistribution(records: PatientRecord[]) {
  const counts: { [status: string]: number } = {};

  records.forEach((r) => {
    const status = r.queueStatus?.trim() || 'غير محدد';
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    name: status,
    value: count
  }));
}

/**
 * Gender Distribution
 */
export function calculateGenderDistribution(records: PatientRecord[]) {
  const counts: { [gender: string]: number } = { ذكر: 0, أنثى: 0, 'غير محدد': 0 };

  records.forEach((r) => {
    if (counts[r.gender] !== undefined) {
      counts[r.gender]++;
    } else {
      counts['غير محدد']++;
    }
  });

  return [
    { name: 'ذكر', value: counts['ذكر'], fill: '#3b82f6' },
    { name: 'أنثى', value: counts['أنثى'], fill: '#ec4899' },
    { name: 'غير محدد', value: counts['غير محدد'], fill: '#9ca3af' }
  ].filter((item) => item.value > 0);
}

/**
 * Billing Group Distribution
 */
export function calculateBillingDistribution(records: PatientRecord[]) {
  const counts: { [billing: string]: number } = {};

  records.forEach((r) => {
    const b = r.billingGroup?.trim() || 'عام / بدون فئة';
    counts[b] = (counts[b] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Age Group Distribution
 */
export function calculateAgeGroupDistribution(records: PatientRecord[]) {
  const groups: { [group: string]: number } = {
    'أطفال (0-14)': 0,
    'شباب (15-35)': 0,
    'بالغين (36-59)': 0,
    'كبار السن (60+)': 0
  };

  records.forEach((r) => {
    if (groups[r.ageGroup] !== undefined) {
      groups[r.ageGroup]++;
    }
  });

  return Object.entries(groups).map(([group, count]) => ({
    name: group,
    count
  }));
}

/**
 * Facility Side-by-Side Comparison
 */
export function calculateFacilityComparison(records: PatientRecord[]): FacilityComparisonItem[] {
  const map = new Map<string, PatientRecord[]>();

  records.forEach((r) => {
    const facility = r.facilityName || 'غير محدد';
    if (!map.has(facility)) map.set(facility, []);
    map.get(facility)!.push(r);
  });

  return Array.from(map.entries()).map(([facilityName, facRecords]) => {
    const kpis = calculateKpis(facRecords);
    const doctorsCount = new Set(
      facRecords
        .map((r) => r.consultPerformedBy?.trim())
        .filter((d) => d && d !== 'غير معروف' && d !== 'غير محدد' && d !== 'N/A')
    ).size;

    return {
      facilityName,
      totalPatients: kpis.totalPatients,
      avgWaitTime: kpis.avgWaitTime,
      avgConsultTime: kpis.avgConsultTime,
      completedConsultations: kpis.completedConsultations,
      doctorsCount
    };
  }).sort((a, b) => b.totalPatients - a.totalPatients);
}

/**
 * Period Comparison
 */
export function calculatePeriodComparison(
  records: PatientRecord[],
  period1Start: string,
  period1End: string,
  period2Start: string,
  period2End: string
): PeriodComparisonSummary {
  const period1Records = records.filter((r) => {
    return (
      (!period1Start || !dayjs(r.checkInDay).isBefore(dayjs(period1Start), 'day')) &&
      (!period1End || !dayjs(r.checkInDay).isAfter(dayjs(period1End), 'day'))
    );
  });

  const period2Records = records.filter((r) => {
    return (
      (!period2Start || !dayjs(r.checkInDay).isBefore(dayjs(period2Start), 'day')) &&
      (!period2End || !dayjs(r.checkInDay).isAfter(dayjs(period2End), 'day'))
    );
  });

  const p1Kpis = calculateKpis(period1Records);
  const p2Kpis = calculateKpis(period2Records);

  const calcVariance = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  return {
    period1Label: `الفترة الأولى (${period1Start || 'البداية'} - ${period1End || 'النهاية'})`,
    period2Label: `الفترة الثانية (${period2Start || 'البداية'} - ${period2End || 'النهاية'})`,
    period1Kpis: p1Kpis,
    period2Kpis: p2Kpis,
    kpiVariances: {
      totalPatients: calcVariance(p2Kpis.totalPatients, p1Kpis.totalPatients),
      avgWaitTime: calcVariance(p2Kpis.avgWaitTime, p1Kpis.avgWaitTime),
      avgConsultTime: calcVariance(p2Kpis.avgConsultTime, p1Kpis.avgConsultTime),
      completedConsultations: calcVariance(p2Kpis.completedConsultations, p1Kpis.completedConsultations)
    }
  };
}
