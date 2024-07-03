import dayjs, { Dayjs } from 'dayjs'

export const formatTime = (d : dayjs.Dayjs | string) => {

    let dayjsTime = dayjs(d)
    let date = ""

    date += dayjsTime.hour() >= 10 ? dayjsTime.hour() + ":" : "0" + dayjsTime.hour() + ":"
    date += dayjsTime.minute() >= 10 ? dayjsTime.minute() + ":" : "0" + dayjsTime.minute() + ":"
    date += dayjsTime.second() >= 10 ? dayjsTime.second() + "" : "0" + dayjsTime.second()

    return date
}