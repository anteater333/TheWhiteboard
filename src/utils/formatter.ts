import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * Date 객체를 받아 AM/PM hh:mm yyyy-mm-dd 형식의 문자열로 변환합니다.
 * @param sourceDate
 */
export function formatDate(sourceDate: Date | string) {
  if (typeof sourceDate === "string") {
    sourceDate = new Date(sourceDate);
  }
  return format(sourceDate, "aaa hh:mm yyyy-MM-dd", { locale: ko });
}
