interface Annotation {
    title: string,
    body: string,
    dateTime: string,
    id: string,
    userId: string,
    notification: {
        color: string,
        notificationMobileId: string
    }
}

interface MarkedDates {
    [key: string]: {
        selected: boolean;
        disableTouchEvent: boolean;
        selectedTextColor: string;
        selectedColor: string;
    };
}