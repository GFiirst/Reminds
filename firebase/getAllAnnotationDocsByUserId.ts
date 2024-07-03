import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "./connection";

export const getAllAnnotationDocsByUserId = async (userId: string) => {

    if(!userId)
        return null

    const annotationCol = collection(db, "Annotations")
    const q = query(annotationCol, where("userId", "==", userId), orderBy("dateTime", "desc"), orderBy("userId", "asc"))

    const data: any[] = []

    try {
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(doc => {
            const d = doc.data()
            data.push({
                id: doc.id,
                ...d
            })
        })
    
        return data
    } catch(e) {
        console.log(e)
    }
}