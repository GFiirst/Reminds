import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'
import AntDesign from "@expo/vector-icons/AntDesign"
import { router } from 'expo-router'

export default function AddEventBox() {
    return (
        <Pressable style={styles.addEventBox} onPress={() => {router.navigate("/criar-evento")}}>
            <AntDesign name="plus" size={30} color={ColorStyle.primaryTextColor} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    addEventBox: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorStyle.secundaryBackgroundColor,
        width: 150,
        height: 150,
        borderRadius: 10
    }
})