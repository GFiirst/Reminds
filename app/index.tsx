import { Link, router, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { ColorStyle } from '../constants/ColorStyle';
import Button from '../components/Button';

export default function App() {

    return (
        <View style={styles.container}>
            <View style={styles.remindsContainer}>
                <Text style={styles.remindsTitle}>Reminds</Text>
                <Text style={styles.remindsSubtitle}>Bem-vindo</Text>
            </View>
            <View style={styles.signUpContainer}>
                <Text style={styles.subtitles}>
                    Ja tem conta? Faça login
                </Text>
                <Link href={"/login"} style={styles.buttonLink}>
                    Entrar
                </Link>
            </View>
            <View style={styles.signUpContainer}>
                <Text style={styles.subtitles}>
                    Novo por aqui? entre pro time!
                </Text>
                <Link href={"/cadastro"} style={styles.buttonLink}>
                    Cadastrar
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorStyle.backgroundColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    remindsContainer: {
        gap: 5,
        alignItems: "center",
        marginBottom: 30
    },
    signUpContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 35
    },
    remindsTitle: {
        fontSize: 40,
        fontWeight: "500",
        color: ColorStyle.primaryTextColor
    },
    remindsSubtitle: {
        fontSize: 22,
        fontWeight: "300",
        color: ColorStyle.primaryTextColor
    },
    subtitles: {
        color: ColorStyle.primaryTextColor,
        marginBottom: 12,
        fontSize: 16,
        textAlign: "center"
    },
    buttonLink: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: ColorStyle.primaryButtonColor,
        borderRadius: 6,
        borderWidth: 2,
        color: ColorStyle.primaryTextColor,
        fontSize: 18,
        textAlign: "center",
        width: 180
    }
});