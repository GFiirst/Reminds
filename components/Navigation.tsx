import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import Feather from "@expo/vector-icons/Feather"
import { ColorStyle } from '../constants/ColorStyle'
import { Link } from 'expo-router'
import Navlink from './Navlink'
import LogoutButton from './LogoutButton'
import { useAuth } from '../hooks/useAuth'

export default function Navigation() {

    const [active, setActive] = useState<boolean>(false)

    const { user } = useAuth()

    return (
        <>
            {active ? (
                <Pressable style={styles.menuContainer}>
                    <View style={styles.menuWrapper}>
                        <Image 
                            style={styles.profilePhoto}
                            source={{
                                uri: user!.photoURL!
                            }}
                        />
                        <View style={styles.navlinkContainer}>
                            <Navlink path='/profile' text='Perfil' setActive={setActive} />
                            <Navlink path='/agenda' text='Agenda' setActive={setActive} />
                            <Navlink path='/calendario' text='Calendario' setActive={setActive} />
                        </View>
                        <View style={styles.logoutContainer}>
                            <View style={styles.logoutContainerWrapper}>
                                <LogoutButton />
                            </View>
                        </View>
                    </View>
                    <Pressable style={styles.menuHiddenClose} onPress={() => {setActive(false)}}></Pressable>
                </Pressable>
            ): (
                <Pressable style={styles.iconMenuContainer} onPress={() => setActive(true)}>
                    <View style={styles.iconMenuWrapper}>
                        <Feather size={30} name='menu' color={"white"} />
                    </View>
                </Pressable>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    hidden: {
        display: "none"
    },
    iconMenuContainer: {
        position: "absolute",
        top: 45,
        left: 5,
        height: 50,
        width: 50,
        zIndex: 10
    },
    iconMenuWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    menuContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:'rgba(0, 0, 0, 0.6)',
        zIndex: 10,
        flexDirection: "row"
    },
    menuWrapper: {
        width: "70%",
        height: "100%",
        backgroundColor: ColorStyle.backgroundColor,
        opacity: 1,
        zIndex: 20,
        alignItems: "center"
    },
    menuHiddenClose: {
        width: "30%",
        height: "100%",
        backgroundColor: "transparent",
        zIndex: 20
    },
    profilePhoto: {
        borderRadius: 999,
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: ColorStyle.primaryButtonColor,
        marginTop: 50
    },
    navlinkContainer: {
        gap: 10,
        marginTop: 35,
        width: "100%"
    },
    logoutContainer : {
        position: "absolute",
        bottom: 20,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    logoutContainerWrapper: {
        width: "70%"
    }
})