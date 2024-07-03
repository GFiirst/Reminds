import React from 'react'
import { Redirect, router, Slot } from 'expo-router'
import { useAuth } from '../hooks/useAuth'

export default function HomeLayout() {

    // Adicionar junto um SplashScreen
    const { user } = useAuth()

    if(user) {
        setImmediate(() => {
            router.replace("/profile")
        })
    }

    return (
        <Slot />
    )
}