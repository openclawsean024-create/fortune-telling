// 農曆到國曆轉換工具
// 基於天文算法實現

const LUNAR_INFO: Record<number, number> = {
  1900: 0x04bd8, 1901: 0x04ae0, 1902: 0x0a570, 1903: 0x054d5, 1904: 0x0d260, 1905: 0x0d950, 1906: 0x16554, 1907: 0x056a0, 1908: 0x09ad0, 1909: 0x055d2,
  1910: 0x04ae0, 1911: 0x0a5b6, 1912: 0x0a4d0, 1913: 0x0d250, 1914: 0x1d255, 1915: 0x0b540, 1916: 0x0d6a0, 1917: 0x0ada2, 1918: 0x095b0, 1919: 0x14977,
  1920: 0x04970, 1921: 0x0a4b0, 1922: 0x0b4b0, 1923: 0x06a50, 1924: 0x06d40, 1925: 0x1ab54, 1926: 0x02b60, 1927: 0x09570, 1928: 0x052f2, 1929: 0x0a970,
  1930: 0x04495, 1931: 0x0d7a0, 1932: 0x0d550, 1933: 0x15a55, 1934: 0x056a0, 1935: 0x1ad5a, 1936: 0x02b60, 1937: 0x09370, 1938: 0x049f8, 1939: 0x04970,
  1940: 0x04ae0, 1941: 0x0a4d0, 1942: 0x0d250, 1943: 0x0d558, 1944: 0x0b540, 1945: 0x0b6a0, 1946: 0x195a6, 1947: 0x056d0, 1948: 0x04ae0, 1949: 0x0a4d0,
  1950: 0x0d260, 1951: 0x0ea50, 1952: 0x06a95, 1953: 0x05ad0, 1954: 0x0b4b0, 1955: 0x06a50, 1956: 0x06d40, 1957: 0x0d560, 1958: 0x0d5a0, 1959: 0x16a55,
  1960: 0x056a0, 1961: 0x1ada5, 1962: 0x02b60, 1963: 0x09270, 1964: 0x04978, 1965: 0x04970, 1966: 0x04ae0, 1967: 0x0a4b0, 1968: 0x0b4b0, 1969: 0x0b550,
  1970: 0x056a0, 1971: 0x15550, 1972: 0x06d60, 1973: 0x0ada0, 1974: 0x05b52, 1975: 0x04b60, 1976: 0x0a570, 1977: 0x054e4, 1978: 0x0d260, 1979: 0x0e950,
  1980: 0x05b57, 1981: 0x056a0, 1982: 0x0d6a0, 1983: 0x16d54, 1984: 0x04ada, 1985: 0x04b60, 1986: 0x0a4b0, 1987: 0x0a570, 1988: 0x054e4, 1989: 0x0d160,
  1990: 0x0e968, 1991: 0x0d560, 1992: 0x16a55, 1993: 0x056a0, 1994: 0x16d4a, 1995: 0x02b60, 1996: 0x09270, 1997: 0x04998, 1998: 0x04990, 1999: 0x04ae0,
  2000: 0x0a4d0, 2001: 0x0d250, 2002: 0x0d558, 2003: 0x0b540, 2004: 0x0b6a0, 2005: 0x195a6, 2006: 0x056d0, 2007: 0x04ae0, 2008: 0x0a4d0, 2009: 0x0d260,
  2010: 0x0ea50, 2011: 0x06a95, 2012: 0x05ad0, 2013: 0x0b4b0, 2014: 0x06a50, 2015: 0x06d40, 2016: 0x0d560, 2017: 0x0d5a0, 2018: 0x16a55, 2019: 0x056a0,
  2020: 0x1ada5, 2021: 0x02b60, 2022: 0x09270, 2023: 0x04978, 2024: 0x04970, 2025: 0x04ae0, 2026: 0x0a4b0, 2027: 0x0b4b0, 2028: 0x0b550, 2029: 0x056a0,
  2030: 0x15550, 2031: 0x06d60, 2032: 0x0ada0, 2033: 0x05b52, 2034: 0x04b60, 2035: 0x0a570, 2036: 0x054e4, 2037: 0x0d260, 2038: 0x0e950, 2039: 0x05b57,
  2040: 0x056a0, 2041: 0x0d6a0, 2042: 0x16d54, 2043: 0x04ada, 2044: 0x04b60, 2045: 0x0a4b0, 2046: 0x0a570, 2047: 0x054e4, 2048: 0x0d160, 2049: 0x0e968,
  2050: 0x0d560, 2051: 0x16a55, 2052: 0x056a0, 2053: 0x16d4a, 2054: 0x02b60, 2055: 0x09270, 2056: 0x04998, 2057: 0x04990, 2058: 0x04ae0, 2059: 0x0a4d0,
};

function getLunarYearDays(year: number): number {
  const info = LUNAR_INFO[year];
  return info ? (info & 0xf) === 0 ? 30 : 29 : 0;
}

function getLunarLeapMonth(year: number): number {
  const info = LUNAR_INFO[year];
  return info ? (info >> 12) & 0xf : 0;
}

function getLunarLeapDays(year: number): number {
  const info = LUNAR_INFO[year];
  return info && (info >> 16) & 0xf ? 30 : 0;
}

function lunarToGregorian(year: number, month: number, day: number, isLeap: boolean): Date | null {
  const baseYear = 1900;
  let days = 0;

  for (let y = baseYear; y < year; y++) {
    days += 365 + (y % 4 === 0 && y % 100 !== 0 ? 1 : 0);
    days += getLunarYearDays(y);
    days += getLunarLeapDays(y);
  }

  const leapMonth = getLunarLeapMonth(year);
  for (let m = 1; m < month; m++) {
    days += getLunarYearDays(year);
    if (m === leapMonth) days += getLunarLeapDays(year);
  }

  if (isLeap) days += getLunarYearDays(year);
  days += day - 1;

  const baseDate = new Date(1900, 0, 31);
  return new Date(baseDate.getTime() + days * 86400000);
}

export function lunarToSolar(year: number, month: number, day: number, isLeap: boolean = false): Date {
  const result = lunarToGregorian(year, month, day, isLeap);
  return result || new Date();
}

export function solarToLunar(date: Date): { year: number; month: number; day: number; isLeap: boolean } {
  const start = new Date(1900, 0, 31);
  let offset = Math.floor((date.getTime() - start.getTime()) / 86400000);

  let year = 1900;
  while (year < 2100) {
    const yearDays = 365 + (year % 4 === 0 && year % 100 !== 0 ? 1 : 0);
    const lunarDays = getLunarYearDays(year);
    const leapDays = getLunarLeapDays(year);
    const total = yearDays + lunarDays + leapDays;
    if (offset < total) break;
    offset -= total;
    year++;
  }

  const leapMonth = getLunarLeapMonth(year);
  let month = 1;
  let isLeap = false;

  while (month < 13 && offset > 0) {
    const monthDays = getLunarYearDays(year);
    if (month === leapMonth && !isLeap) {
      const ld = getLunarLeapDays(year);
      if (offset < ld) { isLeap = true; break; }
      offset -= ld;
    }
    if (offset < monthDays) break;
    offset -= monthDays;
    month++;
    if (month === leapMonth + 1) isLeap = false;
  }

  return { year, month, day: offset + 1, isLeap };
}

export function isValidLunarDate(year: number, month: number, day: number, isLeap: boolean): boolean {
  if (month < 1 || month > 12) return false;
  const maxDay = getLunarYearDays(year);
  if (day < 1 || day > maxDay) return false;
  return true;
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}