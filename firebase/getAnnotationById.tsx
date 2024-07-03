import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "./connection";

export const getAnnotationById = async (id: unknown) => {

    if(!id)
        return null

    const annotationDocRef = doc(db, "Annotations", id as string)
    const annotationSnapshot = await getDoc(annotationDocRef)

    const data = annotationSnapshot.data()

    if(!data) return null

    return {
        id: annotationSnapshot.id,
        title: data.title,
        body: data.body,
        dateTime: data.dateTime,
        userId: data.userId,
        notification: {
            color: data.notification.color,
            notificationMobileId: data.notification.notificationMobileId
        }
    }
}