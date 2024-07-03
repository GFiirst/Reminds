import { doc, addDoc, collection } from "firebase/firestore"; 
import { db } from "./connection";

export const addNewAnnotationDoc = async (
    title: string,
    body: string,
    dateTime: string,
    color: string,
    userId: string
) => {

    const annotationsCol = collection(db, "Annotations")

    try {
        return await addDoc(annotationsCol, 
            {
                title: title,
                body: body,
                dateTime: dateTime,
                notification: {
                    color: color,
                },
                userId: userId
            }
        )
    } catch(e) {
        console.log(e)
        throw e;
    }

}