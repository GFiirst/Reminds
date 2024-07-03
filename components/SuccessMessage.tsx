import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'

export default function SuccessMessage({message}: {message: string}) {

    if(!message)
        return null

    return (
        <View style={styles.successContainer}>
            <Text style={styles.successText}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    successContainer: {
        width: "100%",
        backgroundColor: ColorStyle.primarySuccessColor,
        padding: 12,
        borderRadius: 10
    },
    successText: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }
})