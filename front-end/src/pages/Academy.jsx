import React from "react"
import { useLocation } from "react-router-dom";

function Academy(props) {
    let requested_academy = useLocation();
    let academy_data = requested_academy.state;
    
    if (academy_data) {
        return (
            <>
            <h1>معلومات أكادمية {academy_data.name} موجودة</h1>
            <h3>عليك إرسال id الأكادمية</h3>
            </>
        )
    }
    else {
        return (
            <>
            <h1>معلومات الأكادمية غير موجودة</h1>
            <h3>عليك البحث عن الأكادمية حسب ال slug</h3>
            </>
        )
    }

}

export default Academy