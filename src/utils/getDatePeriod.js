import { FrequencyType } from '../contexts/AppContext';

export const getDatePeriod = (frequency) => {
    const now = new Date();
    let startDate, endDate;
  
    switch (frequency) {
      case FrequencyType.DAILY:
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.WEEKLY:
        const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.BI_WEEKLY:
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
          const weekNumber = Math.ceil(days / 7);
          const biWeeklyCycle = Math.ceil(weekNumber / 2);
  
          const year = now.getFullYear();
          const firstDayOfYear = new Date(year, 0, 1);
          const firstDayOfYearDay = firstDayOfYear.getDay();
          const daysToFirstSunday = (7 - firstDayOfYearDay) % 7;
          const firstSunday = new Date(firstDayOfYear);
          firstSunday.setDate(firstDayOfYear.getDate() + daysToFirstSunday);
        
          const biWeeklyOffset = (biWeeklyCycle - 1) * 14;
          startDate = new Date(firstSunday);
          startDate.setDate(firstSunday.getDate() + biWeeklyOffset);
          startDate.setHours(0, 0, 0, 0);
  
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 13);
          endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.MONTHLY:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.QUARTERLY:
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.HALF_YEARLY:
        const half = now.getMonth() < 6 ? 0 : 1;
        startDate = new Date(now.getFullYear(), half * 6, 1);
        endDate = new Date(now.getFullYear(), half * 6 + 6, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.YEARLY:
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      case FrequencyType.ONE_TIME:
      default:
        startDate = null;
        endDate = null;
        break;
    }
  
    return { 
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null
    };
  };