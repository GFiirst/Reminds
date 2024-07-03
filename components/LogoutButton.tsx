import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import {  } from "firebase/auth"
import { auth } from '../firebase/connection'
import { router } from 'expo-router'

export default function LogoutButton() {

    return (
        <Pressable style={styles.buttonContainer} onPress={() => {
            auth.signOut()
            router.replace("/")
        }}>
            <MaterialIcons size={26} name='logout' color={ColorStyle.logoutButtonColor} />
            <Text style={styles.buttonText}>
                Sair
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        borderColor: ColorStyle.logoutButtonColor,
        flexDirection: "row"
    },
    buttonText: {
        fontSize: 20,
        color: ColorStyle.logoutButtonColor,
        marginLeft: 15
    }
})