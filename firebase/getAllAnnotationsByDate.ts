import { collection, query, where, getDocs, orderBy, getDoc } from "firebase/firestore";
import { db } from "./connection";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

export const getAllAnnotationsByDate = async (userId: string, date: string) => {

    if(!date || !userId)
        return null

    const annotationCol = collection(db, "Annotations")

    const starterDate = dayjs(date).hour(0).minute(0).second(0).local().format()
    const finalDate = dayjs(date).hour(24).minute(0).second(0).local().format()

    const q = query(annotationCol, where("userId", "==", userId), where("dateTime", ">=", starterDate), where("dateTime", "<=", finalDate))
    const data: any[] = []

    try {
        const querySnapshot = await getDocs(q)

        querySnapshot.forEach(doc => {
            // console.log(doc.data())
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