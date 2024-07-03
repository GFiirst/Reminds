import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'

export default function ErrorMessage({message, hasError}: {message: string, hasError: boolean}) {

    if(!hasError)
        return null

    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        width: "100%",
        backgroundColor: ColorStyle.primaryErrorColor,
        padding: 12,
        borderRadius: 10
    },
    errorText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }
})