import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Link, usePathname, useRouter } from 'expo-router'
import { ColorStyle } from '../constants/ColorStyle'

export default function Navlink({text, path, setActive} : {text: string, path: string, setActive: (val: boolean) => void}) {

    const name = usePathname()

    return (
        <Link 
            style={[styles.navLink, name === path ? {backgroundColor: "rgba(0, 0, 0, 0.3)"} : null]}
            onPress={() => setActive(false)}
            href={path}
        >
            <Text>{text}</Text>
        </Link>
    )
}

const styles = StyleSheet.create({
    navLink: {
        backgroundColor: "rgba(128, 128, 128, 0.3)",
        width: "100%",
        padding: 12,
        paddingLeft: 20,
        fontSize: 20,
        color: ColorStyle.primaryTextColor,
        marginBottom: 5
    }
})