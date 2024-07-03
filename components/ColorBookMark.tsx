import { View, Text, Pressable } from 'react-native'
import React from 'react'
import FontAwesome from "@expo/vector-icons/FontAwesome"

export default function ColorBookMark(
    {color, onPress}:
    {color: string, onPress: () => void})
{

    return (
        <Pressable onPress={onPress}>
            <FontAwesome name='bookmark' size={36} color={color} />
        </Pressable>
    )
}