// https://docs.expo.dev/router/advanced/drawer/
import { View, Text } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import Navigation from '../../components/Navigation'

export default function _layout() {

    return (
        <>
            <Navigation />
            <Slot />
        </>
    )
}