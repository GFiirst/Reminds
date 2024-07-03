import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { ColorStyle } from '../../../constants/ColorStyle'
import { useAuth } from '../../../hooks/useAuth'
import { getAllAnnotationsByDate } from '../../../firebase/getAllAnnotationsByDate'
import PageLoader from '../../../components/PageLoader'
import dayjs from 'dayjs'
import FontAwesome from "@expo/vector-icons/FontAwesome"

export default function CalendarioEvento() {

    const { date: d } = useLocalSearchParams()
    const [data, setData] = useState<Annotation[] | null>()
    const [pageLoader, setPageLoader] = useState<boolean>(true)

    const { user } = useAuth()

    useEffect(() => {
        getAllAnnotationsByDate(user ? user.uid : "", d as string)
            .then((data) => {
                if(data) {
                    setData(data)
                    setPageLoader(false)
                }
            })
    }, [user])

    if(!user) return null

    if(pageLoader){
        return (
            <PageLoader />
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerWrapper}>
                <Text style={styles.dateTitle}>{dayjs(d as string).format("DD/MM/YYYY")}</Text>
                {data && (
                    <>
                        {data.map((d) => (
                            <Pressable key={d.id} style={styles.itemContainer} onPress={() => router.push(`/evento/${d.id}`)}>
                                <Text style={styles.itemDateTimeText}>{d.dateTime.split("T")[1].split("-")[0]}</Text>
                                <Text style={styles.itemTitleText}>{d.title}</Text>
                                <View style={styles.bookMarkContainer}>
                                    <FontAwesome name='bookmark' size={22} color={d.notification.color} />
                                </View>
                            </Pressable>
                        ))}
                    </>
                )}
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
    containerWrapper: {
        width: "85%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 90,
        gap: 20
    },
    dateTitle: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 10,
        color: ColorStyle.primaryTextColor
    },
    itemContainer: {
        backgroundColor: ColorStyle.secundaryBackgroundColor,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderRadius: 10,
        position: "relative"
    },
    itemDateTimeText: {
        fontSize: 22,
        fontWeight: "bold",
        color: ColorStyle.primaryTextColor
    },
    itemTitleText: {
        fontSize: 22,
        fontWeight: "400",
        color: ColorStyle.primaryTextColor
    },
    bookMarkContainer: {
        position: "absolute",
        top: "20%",
        right: 20
    }
})