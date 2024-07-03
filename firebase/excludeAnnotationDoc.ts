import { doc, addDoc, collection, deleteDoc } from "firebase/firestore"; 
import { db } from "./connection";

export const excludeAnnotationDoc = async (
    annotationId: string
) => {

    if(!annotationId)
        throw new Error("Id da annotation deve ser um ID valido!")

    const docRef = doc(db, "Annotations", annotationId)

    try {
        await deleteDoc(docRef)
    } catch(e) {
        console.log(e)
        throw e;
    }
}