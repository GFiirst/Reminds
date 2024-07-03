import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ColorStyle } from '../../../constants/ColorStyle'
import AntDesign from "@expo/vector-icons/AntDesign"
import AddEventBox from '../../../components/AddEventBox'
import { useAuth } from '../../../hooks/useAuth'
import { getAllAnnotationDocsByUserId } from '../../../firebase/getAllAnnotationDocsByUserId'
import EventBox from '../../../components/EventBox'

export default function index() {

    const [data, setData] = useState<Annotation[] | null>()
    const [search, setSearch] = useState<string>("")
    const [pageLoader, setPageLoader] = useState<boolean>(true)

    const { user } = useAuth()

    useEffect(() => {
        getAllAnnotationDocsByUserId(user ? user.uid : "")
            .then(data => {
                if(data) {
                    setPageLoader(false)
                }
                setData(data)
            })
    }, [user])

    return (
        <View style={styles.container}>
            <View style={styles.agendaContainer}>
                <View style={styles.agendaWrapper}>
                    <Text style={styles.agendaTitle}>
                        Agenda
                    </Text>
                    <View style={styles.searchInputContainer}>
                        <TextInput
                            placeholder='Pesquise suas tarefas'
                            placeholderTextColor={ColorStyle.primaryTextColor}
                            value={search}
                            onChangeText={setSearch}
                            style={styles.searchInput}
                        />
                        <AntDesign name="search1" size={24} color={ColorStyle.primaryTextColor} />
                    </View>
                </View>
            </View>
            <ScrollView>
                <View style={styles.eventsContainer}>
                    {pageLoader ? (
                        <>
                            <ActivityIndicator size={60} color={ColorStyle.primaryTextColor} />
                        </>
                    ) : search ? (
                        <>
                            <AddEventBox />
                            {data?.map((data) => {
                                if(data.title.toLowerCase().includes(search.toLowerCase())) {
                                    return (
                                        <EventBox data={data} key={data.id} link={`/evento/${data.id}`}/>
                                    )
                                } else {
                                    return null
                                }
                            })}
                        </>
                    ) : (
                        (
                            <>
                                <AddEventBox />
                                {data?.map((data) => (
                                    <EventBox data={data} key={data.id} link={`/evento/${data.id}`}/>
                                ))}
                            </>
                        )
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorStyle.backgroundColor,
        flex: 1,
        padding: 20
    },
    agendaContainer: {
        marginTop: 40,
        width: "100%"
    },
    agendaWrapper: {
        justifyContent: "center",
        alignItems: "center"
    },
    agendaTitle: {
        fontSize: 40,
        fontWeight: "bold",
        textAlign: "center",
        color: ColorStyle.primaryTextColor
    },
    searchInputContainer: {
        width: 250,
        marginTop: 20,
        borderBottomWidth: 2,
        borderBottomColor: "rgba(255, 255, 255, 0.7)",
        flexDirection: "row",
        alignItems: "center"
    },
    searchInput: {
        width: "90%",
        color: ColorStyle.primaryTextColor,
        padding: 4,
        fontSize: 18
    },
    eventsContainer: {
        flexDirection: "row",
        marginTop: 20,
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 22
    }
})