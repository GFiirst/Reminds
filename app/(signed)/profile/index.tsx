import { View, Text, StyleSheet, TextInput, Pressable, Image, Modal, ActivityIndicator, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { ColorStyle } from '../../../constants/ColorStyle'
import { useAuth } from '../../../hooks/useAuth'
import AntDesign from "@expo/vector-icons/AntDesign"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import Button from '../../../components/Button'
import ErrorMessage from '../../../components/ErrorMessage'
import { updatePassword, updateProfile } from 'firebase/auth'
import SuccessMessage from '../../../components/SuccessMessage'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from '../../../firebase/connection'
import * as ImagePicker from 'expo-image-picker';

export default function index() {

    const [modal, setModal] = useState<boolean>(false)
    const [senha, setSenha] = useState<string>()
    const [confirmaSenha, setConfirmaSenha] = useState<string>()
    const [error, setError] = useState({
        mensagem: "",
        hasError: false
    })
    const [loader, setLoader] = useState<boolean>()
    const [imageLoader, setImageLoader] = useState<boolean>(false)
    const [sucessMessage, setSucessMessage] = useState<string>("")
    const [newProfilePic, setNewProfilePic] = useState<string>("")

    const { user } = useAuth()

    if(!user) return null

    const changePassword = async () => {

        setLoader(true)

        if(!senha?.trim().length) {
            setError({
                mensagem: "Senha invalida!",
                hasError: true
            })
            setLoader(false)
            return
        }

        if(!confirmaSenha?.trim().length) {
            setError({
                mensagem: "Senha invalida!",
                hasError: true
            })
            setLoader(false)
            return
        }

        if(senha !== confirmaSenha) {
            setError({
                mensagem: "As senhas nao coincidem!",
                hasError: true
            })
            setLoader(false)
            return
        }

        if(senha.length < 6) {
            setError({
                mensagem: "A senha deve conter no minimo 6 caracteres!",
                hasError: true
            })
            setLoader(false)
            return
        }

        try {
            await updatePassword(user, senha)

            setSucessMessage("Senha alterada com sucesso")
        } catch(e) {
            setError({
                mensagem: "Falha ao alterar a senha, por favor tente novamente!",
                hasError: true
            })
        }

        setLoader(false)
    }

    const changeProfilePic = async () => {

        setImageLoader(true)

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true
        });

        if(!result.assets) {
            setImageLoader(false)
            return
        }

        const fileRef = ref(storage, user.uid + "-" + result.assets[0].uri)

        try {
            const blob = await dataURItoBlob(result.assets[0].uri)

            await uploadBytes(fileRef, blob as Blob)

            const url = await getDownloadURL(fileRef)
            
            await updateProfile(user, {
                photoURL: url
            })

            setNewProfilePic(url)

        } catch(e) {
            console.log(e)
        }

        setImageLoader(false)
    }

    const dataURItoBlob = async (dataURI: string) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function (e) {
              console.log(e);
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", dataURI, true);
            xhr.send(null);
        });

        return blob;
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Pressable 
                    style={styles.profilePhotoIconContainer}
                    onPress={changeProfilePic}
                >
                    {imageLoader ? (
                        <ActivityIndicator size={40} color={ColorStyle.primaryTextColor} />
                    ): (
                        <MaterialCommunityIcons size={40} name="image-edit" color={ColorStyle.primaryTextColor} />
                    )}
                </Pressable>
                <Image 
                    style={styles.profilePhoto}
                    source={{
                        uri: newProfilePic ? newProfilePic : user.photoURL!,
                      }}
                />
                <Text style={styles.profileName}>
                    {user.displayName}
                </Text>
            </View>
            <View>
                <View style={{marginBottom: 20}}>
                    <Text style={styles.label}>
                        E-mail
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor={ColorStyle.primaryTextColor}
                        editable={false} selectTextOnFocus={false}
                        value={user.email!}
                    />
                </View>
                {/* Modal para alterar a senha */}
                <Button 
                    text='Alterar senha' 
                    onPress={() => setModal(true)}
                />
                <Modal
                    visible={modal}
                    transparent={true}
                >
                    <View
                        style={styles.modaContainer}
                    >
                        <View style={styles.modalWrapper}>
                            <View style={styles.closeButtonContainer}>
                                <AntDesign
                                    size={35}
                                    color={ColorStyle.primaryTextColor}
                                    onPress={() => {
                                        setModal(false)
                                    }}
                                    name='close'
                                />
                            </View>
                            <View style={styles.formContainer}>
                                <ErrorMessage message={error.mensagem} hasError={error.hasError} />
                                <SuccessMessage message={sucessMessage} />
                                <View>
                                    <Text style={styles.label}>
                                        Nova senha
                                    </Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder='Digite sua nova senha' 
                                        placeholderTextColor={ColorStyle.primaryTextColor}
                                        value={senha}
                                        onChangeText={setSenha}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <View>
                                    <Text style={styles.label}>
                                        Confirmar senha
                                    </Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder='Confirme sua senha' 
                                        placeholderTextColor={ColorStyle.primaryTextColor}
                                        value={confirmaSenha}
                                        onChangeText={setConfirmaSenha}
                                        secureTextEntry={true}
                                    />
                                </View>
                                <Button 
                                    text='Alterar'
                                    onPress={changePassword}
                                    loader={loader}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorStyle.backgroundColor,
        padding: 20
    },
    profileContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
        position: "relative"
    },
    profilePhoto: {
        borderRadius: 999,
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: ColorStyle.primaryButtonColor
    },
    profilePhotoIconContainer: {
        position: "absolute",
        top: 150,
        right: 0,
        zIndex: 20,
        width: 80
    },
    profileName: {
        fontSize: 32,
        fontWeight: "bold",
        padding: 5,
        color: ColorStyle.primaryTextColor
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
    },
    modaContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: ColorStyle.backgroundColor
    },
    modalWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        width: "100%",
        height: "100%"
    },
    closeButtonContainer: {
        width: "100%",
        position: "absolute",
        top: 0,
        left: "85%",
        height: 40,
        marginTop: 20,
    },
    formContainer: {
        width: "100%",
        padding: 15,
        gap: 35
    }
})