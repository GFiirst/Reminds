import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../firebase/connection";

export function useAuth() {

    const [user, setUser] = useState<User>()

    useEffect(() => {

        const unsubscribedFromAuthStateChanged = onAuthStateChanged(auth, (u) => {
            if(u) {
                setUser(u)
            } else {
                setUser(undefined)
            }
        })

        return unsubscribedFromAuthStateChanged;
    }, [])

    return {
        user,
    }
}