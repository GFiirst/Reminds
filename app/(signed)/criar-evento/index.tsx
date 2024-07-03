import { View, Text, StyleSheet, TextInput, Pressable, Modal } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { ColorStyle } from '../../../constants/ColorStyle'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import Fontisto from "@expo/vector-icons/Fontisto"
import { DATE_CONFIG } from '../../../constants/DateConfig';
import ColorBookMark from '../../../components/ColorBookMark';
import { BOOKMARK_COLORS } from '../../../constants/BookMarkColors';
import dayjs from 'dayjs'
import utc from "dayjs/plugin/utc"
import { formatTime } from '../../../helper/FormatTime';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PROJECT_ID } from '../../../constants/Env';
import * as Notifications from 'expo-notifications';
import { useAuth } from '../../../hooks/useAuth';
import { addNewAnnotationDoc } from '../../../firebase/addNewAnnotationDoc';
import Button from '../../../components/Button';
import { router } from 'expo-router';
import ErrorMessage from '../../../components/ErrorMessage';
import { updateDoc } from 'firebase/firestore';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
    })
})

dayjs.extend(utc)

LocaleConfig.locales.fr = DATE_CONFIG
LocaleConfig.defaultLocale = "fr";

export default function index() {

    const [modal, setModal] = useState<boolean>(false)
    const [selectedDate, setSelectedDate] = useState<any>(dayjs().format("YYYY-MM-DD")) // "DD-MM-YYYY"
    const [selectedColor, setSelectedColor] = useState(BOOKMARK_COLORS[0])
    const [time, setTime] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [annotation, setAnnotation] = useState<string>("")
    const [loader, setLoader] = useState<boolean>()
    const [error, setError] = useState({
        message: "",
        hasError: false
    })

    // Modal
    const [bookMark, setBookMark] = useState<boolean>(false)
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false)

    const registerForPushNotificationsAsync = async () => {

        let token;

        await Notifications.setNotificationChannelAsync("agenda", {
            name: "agenda",
            importance: Notifications.AndroidImportance.MAX,
            lightColor: ColorStyle.backgroundColor,
        })

        const { status: existingStatus } = await Notifications.getPermissionsAsync()

        let finalStatus = existingStatus;

        if(existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status;
        }

        if(finalStatus !== 'granted') {
            return
        }

        const projectId = PROJECT_ID

        token = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
        ).data;

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => console.log(token))
    }, [])

    const { user } = useAuth()

    if(!user) return null

    const defineSelectedColor = (color: string, bookmark: boolean) => {
        setSelectedColor(color)
        setBookMark(bookmark)
    }

    const createAnnotation = async () => {
        setError({
            message: "",
            hasError: false
        })

        setLoader(true)

        let formattedTime;

        if(!time) {
            formattedTime = dayjs().local().format()
        } else {
            formattedTime = time
        }

        formattedTime = formattedTime.split("T")[1]

        const trigger = new Date(selectedDate)
        const localTime = dayjs(selectedDate + "T" + formattedTime).local()

        trigger.setHours(localTime.hour() + 24)
        trigger.setMinutes(localTime.minute())

        const dateInMilliseconds = trigger.getTime()

        // Validações
        if(!title) {
            setError({
                message: "Titulo obrigatorio",
                hasError: true
            })
            setLoader(false)
            return;
        }

        try {

            const d = await addNewAnnotationDoc(
                title,
                annotation,
                localTime.format(),
                selectedColor,
                user.uid
            )

            const identifier = await pushNotification(title, annotation, dateInMilliseconds, d.id)

            await updateDoc(d,             {
                notification: {
                    color: selectedColor,
                    notificationMobileId: identifier
                }
            })

            router.push("/agenda")
        } catch(e) {
            setLoader(false)
        }

        setLoader(false)
    }

    const pushNotification = async (
        title: string,
        body: string,
        date: number,
        eventId: string
    ) => {

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: {
                    url: `/evento/${eventId}`
                }
            },
            trigger: {
                date: date
            },
        })
        
        return identifier
    }

    return (
        <View style={styles.container}>
            <View style={[styles.eventColorContainer]}>
                <View style={bookMark ? {display: 'none'} : null}>
                    <ColorBookMark color={selectedColor} onPress={() =>{setBookMark(true)}} />
                </View>
                <View style={bookMark ? styles.colorPickerContainer : {display: 'none'}}>
                    {BOOKMARK_COLORS.map((c) => (
                        <Fragment key={c}>
                            <ColorBookMark 
                                color={c}
                                onPress={() => {
                                    defineSelectedColor(c, false)
                                }}
                            />
                        </Fragment>
                    ))}
                </View>
            </View>
            <View style={styles.creationHeaderContainer}>
                <View style={{width: "80%"}}>
                    <ErrorMessage message={error.message} hasError={error.hasError} />
                </View>
                <View style={styles.creationHeaderWrapper}>
                    <TextInput
                        placeholder='Titulo do evento'
                        style={styles.titleInput}
                        placeholderTextColor={ColorStyle.secondaryTextColor}
                        multiline
                        numberOfLines={4}
                        onChangeText={setTitle}
                        value={title}
                    />
                    <View style={styles.datetimeContainer}>
                        <Pressable style={styles.dateContainer} onPress={() => {setModal(true)}}>
                            <Fontisto name='date' size={20} color={ColorStyle.primaryTextColor} />
                            <Text style={styles.dateTitle}>
                                {dayjs(selectedDate).format("DD/MM/YYYY")}
                            </Text>
                        </Pressable>
                        <Pressable 
                            style={styles.dateContainer} 
                            // onPress={() => {setModal(true)}}
                        >
                            <Fontisto name='clock' size={20} color={ColorStyle.primaryTextColor} />
                            <Pressable onPress={() => {setShowTimePicker(true)}}>
                                <Text style={styles.dateTitle}>
                                    {
                                        time.length > 0 ? formatTime(time) : formatTime(dayjs())
                                    }
                                </Text>
                            </Pressable>
                        </Pressable>
                    </View>
                </View>
            </View>
            {/* Adicionar anotações */}
            <View style={styles.annotationContainer}>
                <TextInput
                    placeholder='Adicione uma anotação ao evento'
                    style={styles.annotationInput}
                    placeholderTextColor={ColorStyle.secondaryTextColor}
                    onChangeText={setAnnotation}
                    value={annotation}
                />
            </View>

            {/* Modal */}
            <Modal visible={modal} animationType="fade">
                <Calendar 
                    style={{elevation: 4, width: "100%", height: "100%"}}
                    onDayPress={(date: any) => {
                        setSelectedDate(date.dateString)
                        setModal(false)
                    }}
                    markedDates={{
                        [selectedDate]: {selected: true, disableTouchEvent: false, selectedTextColor: "black"}
                    }}
                    theme={{
                        backgroundColor: ColorStyle.backgroundColor,
                        calendarBackground: ColorStyle.backgroundColor,
                        textSectionTitleColor: ColorStyle.primaryTextColor,
                        textSectionTitleDisabledColor: ColorStyle.primaryTextColor,
                        selectedDayBackgroundColor: ColorStyle.primaryTextColor,
                        selectedDayTextColor: ColorStyle.primaryTextColor,
                        todayTextColor: ColorStyle.primaryTextColor,
                        dayTextColor: ColorStyle.primaryTextColor,
                        dotColor: "orange",
                        selectedDotColor: ColorStyle.primaryTextColor,
                        arrowColor: ColorStyle.primaryTextColor,
                        monthTextColor: ColorStyle.primaryTextColor,
                        indicatorColor: ColorStyle.primaryTextColor
                    }}
                />
            </Modal>
            {showTimePicker && (
                <DateTimePicker 
                    textColor={ColorStyle.primaryTextColor}
                    positiveButton={{textColor: ColorStyle.primaryTextColor}}
                    negativeButton={{textColor: ColorStyle.primaryTextColor}}
                    value={new Date()} 
                    mode="time" 
                    display="spinner"
                    onChange={(text) => {
                        setShowTimePicker(false)
                        setTime(dayjs(text.nativeEvent.timestamp).local().format())
                    }}
                    themeVariant="dark"
                />
            )}
            <View style={styles.buttonContainer}>
                <Button
                    text='Criar'
                    loader={loader}
                    onPress={createAnnotation}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorStyle.backgroundColor,
        position: "relative"
    },
    eventColorContainer: {
        position: "absolute",
        top: 45,
        right: 20,
        gap: 8,
        zIndex: 10,
        elevation: 4
    },
    colorPickerContainer: {
        padding: 8,
        backgroundColor: "rgba(100, 100, 100, 0.4)",
        borderRadius: 10,
        gap: 6
    },
    calendar: {
        backgroundColor: ColorStyle.backgroundColor,
        color: ColorStyle.primaryTextColor
    },
    creationHeaderContainer: {
        marginTop: 100,
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    creationHeaderWrapper: {
        width: "65%",
        justifyContent: "center",
        alignItems: "center",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: "rgba(125, 125, 125, 0.3)",
        padding: 10,
        borderRadius: 10
    },
    dateTitle: {
        fontSize: 14,
        color: ColorStyle.primaryTextColor
    },
    titleInput: {
        fontSize: 28, 
        color: ColorStyle.secondaryTextColor, 
        textAlign: "center"
    },
    annotationContainer: {
        width: "80%", 
        marginLeft: "auto", 
        marginRight: "auto"
    },
    annotationInput: {
        fontSize: 18, 
        color: ColorStyle.secondaryTextColor,
        marginTop: 35,
        borderBottomWidth: 1,
        borderBottomColor: ColorStyle.secondaryTextColor,
        width: "100%",
        padding: 4,
        textAlign: "center"
    },
    datetimeContainer: {
        flexDirection: "row",
        gap: 8
    },
    buttonContainer: {
        width: "70%",
        marginTop: 40,
        marginLeft: "auto",
        marginRight: "auto"
    }
})