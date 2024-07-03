import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'
import AntDesign from "@expo/vector-icons/AntDesign"
import { router } from 'expo-router'
import dayjs from 'dayjs'

export default function EventBox({data, link}: {data: Annotation, link: string}) {
    return (
        <View style={{width: 150}}>
            <Pressable style={styles.eventBox} onPress={() => {router.navigate(link)}}>
                <Text style={styles.eventDate}>
                    {dayjs(data.dateTime).format("DD/MM/YYYY")}
                </Text>
                <Text style={styles.eventTime}>
                    {data.dateTime.split("T")[1].split("-")[0]}
                </Text>
            </Pressable>
            <Text style={styles.title}>{data.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    eventBox: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorStyle.secundaryBackgroundColor,
        width: 150,
        height: 150,
        borderRadius: 10,
        gap: 12,
    },
    eventDate: {
        color: ColorStyle.primaryTextColor,
        fontSize: 24,
        fontWeight: "500"
    },
    eventTime: {
        fontSize: 16,
        color: ColorStyle.primaryTextColor,
        fontWeight: "400"
    },
    title: {
        fontSize: 16,
        color: ColorStyle.primaryTextColor,
        textAlign: "center",
        marginTop: 5
    }
})