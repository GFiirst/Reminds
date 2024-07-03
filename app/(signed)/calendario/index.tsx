import { View, Text, ActivityIndicator } from 'react-native'
import { ColorStyle } from '../../../constants/ColorStyle'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { DATE_CONFIG } from '../../../constants/DateConfig';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth';
import { getAllAnnotationDocsByUserId } from '../../../firebase/getAllAnnotationDocsByUserId';
import dayjs from 'dayjs'
import { router } from 'expo-router';
import PageLoader from '../../../components/PageLoader';

LocaleConfig.locales.fr = DATE_CONFIG
LocaleConfig.defaultLocale = "fr";

// https://github.com/wix/react-native-calendars/issues/197
export default function index() {

    const { user } = useAuth()

    const [data, setData] = useState<Annotation[] | null>()
    const [selectedDays, setSelectedDays] = useState<any>()
    const [pageLoader, setPageLoader] = useState<boolean>(true)

    useEffect(() => {
        getAllAnnotationDocsByUserId(user ? user.uid : "")
            .then((data) => {
                if(data) {
                    const markedDates: MarkedDates = {}
                    
                    data.forEach(d => {
                        markedDates[dayjs(d.dateTime).format("YYYY-MM-DD") as string] = {
                            selected: true,
                            disableTouchEvent: false,
                            selectedTextColor: "black",
                            selectedColor: d.notification.color
                        }
                    })
    
                    setSelectedDays(markedDates)
                    setData(data)
                    setPageLoader(false)
                }
            })
    }, [user])

    if(pageLoader) {
        return (
            <PageLoader />
        )
    }

    return (
        <View>
            <Calendar 
                style={{elevation: 4, width: "100%", height: "100%", justifyContent: "center"}}
                onDayPress={date => {
                    router.replace(`/calendario-evento/${date.dateString}`)
                }}
                markedDates={data ? selectedDays : {}}
                theme={{
                    backgroundColor: ColorStyle.backgroundColor,
                    calendarBackground: ColorStyle.backgroundColor,
                    textSectionTitleColor: ColorStyle.primaryTextColor,
                    textSectionTitleDisabledColor: ColorStyle.primaryTextColor,
                    selectedDayTextColor: ColorStyle.primaryTextColor,
                    todayTextColor: ColorStyle.primaryTextColor,
                    dayTextColor: ColorStyle.primaryTextColor,
                    selectedDotColor: ColorStyle.primaryTextColor,
                    arrowColor: ColorStyle.primaryTextColor,
                    monthTextColor: ColorStyle.primaryTextColor,
                    indicatorColor: ColorStyle.primaryTextColor,
                    textMonthFontSize: 30,
                    textDayFontSize: 20,
                    textDayStyle: {
                        marginTop: 0,
                        marginBottom: 0,
                        paddingTop: 2
                    }
                }}
            />
        </View>
    )
}