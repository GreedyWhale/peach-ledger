export const enWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getOneMonthDays = (year: number, month: number) => new Date(year, month, 0).getDate();

const getDayOfWeek = (year: number, month: number, date: number) => new Date(year, month - 1, date).getDay();

export const getDateList = (year: number, month: number) => {
  const days = getOneMonthDays(year, month);
  const firstDayOfWeek = getDayOfWeek(year, month, 1);

  const result: {
    visible: boolean;
    week: string;
    value: string;
  }[] = [];
  // 不是从周日开始
  if (firstDayOfWeek !== 0) {
    for (let i = firstDayOfWeek - 1; i >= 0; i -= 1) {
      result.push({
        visible: false,
        week: '',
        value: `h${i}`,
      });
    }
  }

  for (let i = 0; i < days; i += 1) {
    const date = i + 1;
    result.push({
      visible: true,
      week: enWeeks[getDayOfWeek(year, month, date)],
      value: `${date}`,
    });
  }

  return result;
};

export const formatDate = (date = new Date()) => 'YYYY/MM/DD'
  .replace(/YYYY/g, `${date.getFullYear()}`)
  .replace(/MM/g, `${date.getMonth() + 1}`)
  .replace(/DD/g, `${date.getDate()}`);

export const toSeconds = (date: string) => Math.floor(new Date(date).getTime() / 1000);
