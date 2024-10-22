import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import ja from 'dayjs/locale/ja';

class DateUtil {
  constructor() {
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.tz.setDefault('Asia/Tokyo');
    dayjs.locale(ja);
  }

  public utc(date?: dayjs.ConfigType) {
    return dayjs(date).utc().toISOString();
  }

  public unix(date?: dayjs.ConfigType) {
    return dayjs(date).unix();
  }

  public format(date?: dayjs.ConfigType) {
    return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
  }
}

export const dateUtil = new DateUtil();
