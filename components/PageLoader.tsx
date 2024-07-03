import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'
import { ColorStyle } from '../constants/ColorStyle'

export default function PageLoader() {
  return (
    <View style={styles.container}>
        <ActivityIndicator size={60} color={ColorStyle.primaryTextColor} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: ColorStyle.backgroundColor, justifyContent: "center", alignItems: "center"},
})