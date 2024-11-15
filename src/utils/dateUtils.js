export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

export const formatYearMonth = (date) => {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
};

export const createDateKey = (date, time) => {
  const dateStr = date.toISOString().split('T')[0];
  return `${dateStr}-${time}`;
};

export const parseDateKey = (dateKey) => {
  const [dateStr, timeStr] = dateKey.split('-');
  const [hours, minutes] = timeStr.split(':');
  const date = new Date(dateStr);
  date.setHours(parseInt(hours), parseInt(minutes));
  return date;
};

export const isPastTime = (date, time) => {
  const now = new Date();
  const [hours, minutes] = time.split(':');
  const targetDate = new Date(date);
  targetDate.setHours(parseInt(hours), parseInt(minutes));
  return targetDate < now;
};
