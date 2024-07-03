import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { ColorStyle } from '../../../constants/ColorStyle'
import Button from '../../../components/Button'
import Entypo from "@expo/vector-icons/Entypo"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase/connection'
import ErrorMessage from '../../../components/ErrorMessage'
import { router } from 'expo-router'

export default function Login() {

    // Email e senha
    const [email, setEmail] = useState<string>()
    const [senha, setSenha] = useState<string>()
    const [error, setError] = useState({
        mensagem: "",
        hasError: false
    })
    const [loader, setLoader] = useState<boolean>()
    const [secureEntry, setSecureEntry] = useState<boolean>(true)

    const login = async () => {

        setLoader(true)
        
        setError({
            mensagem: "",
            hasError: false
        })

        if(!email?.trim().length) {
            setError({
                mensagem: "Email invalido!",
                hasError: true
            })
            setLoader(false)
            return;
        }

        if(!senha?.trim().length) {
            setError({
                mensagem: "Senha invalida!",
                hasError: true
            })
            setLoader(false)
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, senha)

            setLoader(false)
            router.replace("/profile")
        } catch(e) {
            setError({
                mensagem: "Email ou senha invalidos, por favor tente novamente!",
                hasError: true
            })
            setLoader(false)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.remindsContainer}>
                <Text style={styles.remindsTitle}>
                    Reminds
                </Text>
                <Text style={styles.remindsSubtitle}>
                    Login
                </Text>
            </View>
            <View style={styles.formContainer}>
                <ErrorMessage message={error.mensagem} hasError={error.hasError} />
                <View>
                    <Text style={styles.label}>
                        E-mail
                    </Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder='Digite seu email' 
                        placeholderTextColor={ColorStyle.primaryTextColor}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View>
                    <Text style={styles.label}>
                        Senha
                    </Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder='Digite sua senha' 
                            placeholderTextColor={ColorStyle.primaryTextColor}
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={secureEntry}
                        />
                        <Pressable 
                            style={styles.passwordIconContainer} 
                            onPress={() => {
                                setSecureEntry((prev) => !prev)
                            }}
                        >
                            <Entypo name={secureEntry ? "eye-with-line" : "eye"} size={22} color={"white"} />
                        </Pressable>
                    </View>
                </View>
                <Button text='Entrar' onPress={login} loader={loader} />
            </View>
        </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorStyle.backgroundColor,
        alignItems: 'center'
    },
    remindsContainer: {
        marginTop: "20%",
        alignItems: "center",
        gap: 3
    },
    remindsTitle: {
        fontSize: 40,
        fontWeight: "500",
        color: ColorStyle.primaryTextColor
    },
    remindsSubtitle: {
        fontSize: 20,
        fontWeight: "300",
        color: ColorStyle.primaryTextColor
    },
    formContainer: {
        width: "70%",
        marginTop: 50,
        gap: 30
    },
    label: {
        fontSize: 20,
        color: ColorStyle.primaryTextColor,
        marginBottom: 5,
        fontWeight: "300"
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: ColorStyle.primaryTextColor,
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: ColorStyle.primaryTextColor,
        fontWeight: "300"
    },
    passwordContainer: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: ColorStyle.primaryTextColor,
        width: "100%",
        paddingLeft: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    passwordInput: {
        width: "88%",
        color: ColorStyle.primaryTextColor,
        fontWeight: "300",
        fontSize: 16
    },
    passwordIconContainer: {
        width: "10%",
        maxHeight: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 4
    }
})