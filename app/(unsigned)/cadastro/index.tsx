import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ColorStyle } from '../../../constants/ColorStyle'
import Button from '../../../components/Button'
import Entypo from "@expo/vector-icons/Entypo"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../../firebase/connection'
import ErrorMessage from '../../../components/ErrorMessage'

export default function Cadastro() {

    // Email e senha
    const [nome, setNome] = useState<string>()
    const [email, setEmail] = useState<string>()
    const [senha, setSenha] = useState<string>()
    const [error, setError] = useState({
        mensagem: "",
        hasError: false
    })
    const [sucessMessage, setSuccessMessage] = useState<string>()
    const [loader, setLoader] = useState<boolean>(false)
    const [secureEntry, setSecureEntry] = useState<boolean>(true)
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
            setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );      
        
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
          };
    }, []);

    const register = async () => {
        setLoader(true)
        setError({
            mensagem: "",
            hasError: false
        })

        if(!nome?.trim().length) {
            setLoader(false)
            setError({
                mensagem: "Nome invalido!",
                hasError: true
            })
            return;
        }

        if(!email?.trim().length) {
            setLoader(false)
            setError({
                mensagem: "Email invalido!",
                hasError: true
            })
            return;
        }

        if(!senha?.trim().length) {
            setLoader(false)
            setError({
                mensagem: "Senha invalida!",
                hasError: true
            })
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, senha)

            updateProfile(user, {
                displayName: nome
            })

            setLoader(false)
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
            {isKeyboardVisible ? (
                <></>
            ): (
                <View style={styles.remindsContainer}>
                    <Text style={styles.remindsTitle}>
                        Reminds
                    </Text>
                    <Text style={styles.remindsSubtitle}>
                        Cadastro
                    </Text>
                </View>
            )}
            <View style={styles.formContainer}>
                    <ErrorMessage message={error.mensagem} hasError={error.hasError} />
                    <View>
                        <Text style={styles.label}>
                            Nome
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Digite seu nome'
                            placeholderTextColor={ColorStyle.primaryTextColor}
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>
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
                    <Button text='Cadastrar' loader={loader} onPress={register} />
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