import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'

export default function Button({text, onPress, loader, color}: {text: string, onPress?: () => void, loader?: boolean, color?: string}) {
    return (

        <Pressable style={[styles.buttonContainer, color ? {backgroundColor: color} : null]} onPress={onPress}>
            {loader ? (
                <ActivityIndicator size={22} color={"white"} />
            ): (
                <Text style={styles.buttonText}>
                    {text}
                </Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: "100%",
        padding: 10,
        borderRadius: 4,
        backgroundColor: ColorStyle.primaryButtonColor,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontSize: 20,
        color: ColorStyle.primaryTextColor
    }
})