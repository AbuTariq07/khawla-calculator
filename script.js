const rolls = [107, 127, 137, 152];

const framePricePerMeter = 45;

const deliveryPrice = 29;


const fixedPrices = {

    "40x60": {
        withoutFrame: 130,
        withFrame: 229
    },

    "60x90": {
        withoutFrame: 180,
        withFrame: 324
    },

    "80x120": {
        withoutFrame: 280,
        withFrame: 470
    },

    "90x140": {
        withoutFrame: 350,
        withFrame: 566
    },

    "60x60": {
        withoutFrame: 150,
        withFrame: 267
    },

    "90x90": {
        withoutFrame: 250,
        withFrame: 421
    },

    "110x110": {
        withoutFrame: 350,
        withFrame: 557
    },

    "140x140": {
        withoutFrame: 550,
        withFrame: 751
    },

    "45x90": {
        withoutFrame: 180,
        withFrame: 311
    },

    "60x120": {
        withoutFrame: 250,
        withFrame: 421
    },

    "70x140": {
        withoutFrame: 330,
        withFrame: 528
    },

    "90x180": {
        withoutFrame: 479,
        withFrame: 731
    }

};


// ========================================
// الحصول على مفتاح المقاس
// مثال:
// 100 × 200
// يصبح:
// 100x200
// ========================================

function getSizeKey(width, height) {

    const a = Math.min(width, height);

    const b = Math.max(width, height);

    return `${a}x${b}`;
}


// ========================================
// حساب السعر
// ========================================

function calculatePrice() {

    // =========================
    // قراءة المدخلات
    // =========================

    const width =
        parseFloat(
            document.getElementById("width").value
        );


    const height =
        parseFloat(
            document.getElementById("height").value
        );


    const hasFrame =
        document.getElementById("frame").checked;


    const canvasPricePerMeter =
        parseFloat(
            document.getElementById("meterPrice").value
        ) || 250;


    const discount1 =
        parseFloat(
            document.getElementById("discount1").value
        ) || 0;


    const discount2 =
        parseFloat(
            document.getElementById("discount2").value
        ) || 0;


    // =========================
    // التأكد من إدخال المقاسات
    // =========================

    if (
        isNaN(width) ||
        isNaN(height) ||
        width <= 0 ||
        height <= 0
    ) {

        alert("يرجى إدخال المقاسات بشكل صحيح");

        return;
    }


    // =========================
    // المتغيرات الأساسية
    // =========================

    const sizeKey =
        getSizeKey(width, height);


    let canvasPrice = 0;

    let framePrice = 0;

    let selectedRoll = "-";

    let isFixedPrice = false;


    // ========================================
    // أولاً:
    // التحقق من الأسعار الثابتة
    // ========================================

    if (fixedPrices[sizeKey]) {

        isFixedPrice = true;


        const fixed =
            fixedPrices[sizeKey];


        canvasPrice =
            hasFrame
                ? fixed.withFrame
                : fixed.withoutFrame;


        // السعر الثابت شامل اختيار الإطار
        framePrice = 0;


        selectedRoll =
            "سعر ثابت";

    }


    // ========================================
    // ثانياً:
    // المقاسات غير الموجودة في الأسعار الثابتة
    // ========================================

    else {

        // إذا كان البعدين أكبر من 140
        // يتم رفض المقاس

        if (
            width > 140 &&
            height > 140
        ) {

            alert(
                "المقاس غير مقبول - يجب أن يكون أحد البعدين أقل من أو يساوي 140 سم"
            );

            return;
        }


        // إضافة مساحة الطباعة

        const widthPlus =
            width + 10;


        const heightPlus =
            height + 10;


        let bestOption =
            null;


        // ========================================
        // البحث عن أفضل رول
        // ========================================

        for (const roll of rolls) {


            // وضع العرض على عرض الرول

            if (widthPlus <= roll) {

                const option = {

                    roll: roll,

                    waste:
                        roll - widthPlus,

                    lengthForPrice:
                        heightPlus
                };


                if (
                    bestOption === null ||
                    option.waste < bestOption.waste
                ) {

                    bestOption =
                        option;
                }
            }


            // تدوير اللوحة
            // ووضع الارتفاع على عرض الرول

            if (heightPlus <= roll) {

                const option = {

                    roll: roll,

                    waste:
                        roll - heightPlus,

                    lengthForPrice:
                        widthPlus
                };


                if (
                    bestOption === null ||
                    option.waste < bestOption.waste
                ) {

                    bestOption =
                        option;
                }
            }
        }


        // =========================
        // لا يوجد رول مناسب
        // =========================

        if (bestOption === null) {

            alert(
                "لا يوجد رول مناسب لهذا المقاس"
            );

            return;
        }


        selectedRoll =
            bestOption.roll;


        // ========================================
        // حساب سعر اللوحة
        // ========================================

        canvasPrice =

            (selectedRoll / 100) *

            (bestOption.lengthForPrice / 100) *

            canvasPricePerMeter;


        // ========================================
        // حساب سعر الإطار
        // ========================================

        if (hasFrame) {

            const frameWidth =
                (width + 5) / 100;


            const frameHeight =
                (height + 5) / 100;


            framePrice =

                (
                    (frameWidth * 2) +
                    (frameHeight * 2)
                )

                *

                framePricePerMeter;
        }
    }


    // ========================================
    // إجمالي اللوحة + الإطار
    // ========================================

    const total =
        canvasPrice + framePrice;


    // تقريب السعر لأعلى

    const roundedPrice =
        Math.ceil(total);


    // ========================================
    // السعر قبل الخصم
    // يشمل التوصيل
    // ========================================

    const firstTotal =
        roundedPrice + deliveryPrice;


    // ========================================
    // تطبيق الخصمين
    // ========================================

    const afterDiscount =

        roundedPrice *

        (1 - discount1 / 100) *

        (1 - discount2 / 100);


    const roundedAfterDiscount =
        Math.ceil(afterDiscount);


    // ========================================
    // عرض النتائج
    // ========================================


    // الرول

    if (isFixedPrice) {

        document.getElementById("roll").innerText =
            `الرول المختار : سعر ثابت`;

    }

    else {

        document.getElementById("roll").innerText =
            `الرول المختار : ${selectedRoll} سم`;
    }


    // سعر اللوحة

    document.getElementById("canvasPrice").innerText =

        `سعر اللوحة : ${canvasPrice.toFixed(2)} ريال`;


    // سعر الإطار

    document.getElementById("framePrice").innerText =

        `سعر الإطار : ${framePrice.toFixed(2)} ريال`;


    // ========================================
    // الإجمالي قبل الخصم
    // ========================================

    const firstTotalElement =
        document.getElementById("firstTotal");


    if (firstTotalElement) {

        firstTotalElement.innerText =

            `الإجمالي قبل الخصم : ${firstTotal} ريال`;
    }


    // ========================================
    // الإجمالي بعد الخصم
    // ========================================

    document.getElementById("totalPrice").innerText =

        `الإجمالي بعد الخصم : ${roundedAfterDiscount} ريال`;


    // ========================================
    // رسالة الواتساب
    // نفس منطق رسالتك الأصلي
    // ========================================

    const frameText =
        hasFrame
            ? "مع إطار"
            : "بدون إطار";


    const whatsappMessage =

        `لوحة مقاس ${formatNumber(width)} سم × ${formatNumber(height)} سم ${frameText} : ${roundedPrice} ريال\n` +

        `التوصيل : ${deliveryPrice} ريال\n` +

        `الإجمالي : ${firstTotal} ريال\n\n` +

        `بعد الخصم : ${roundedAfterDiscount} ريال\n` +

        `التوصيل : مجاني\n` +

        `الإجمالي : ${roundedAfterDiscount} ريال`;


    // ========================================
    // عرض رسالة الواتساب
    // ========================================

    const messagePreview =
        document.getElementById("messagePreview");


    if (messagePreview) {

        messagePreview.value =
            whatsappMessage;
    }

}


// ========================================
// تنسيق الرقم
// ========================================

function formatNumber(number) {

    return Number.isInteger(number)

        ? String(number)

        : String(number);
}


// ========================================
// نسخ رسالة الواتساب
// ========================================

function copyMessage() {

    const messagePreview =
        document.getElementById("messagePreview");


    if (!messagePreview) {

        alert(
            "حدث خطأ في مربع رسالة الواتساب"
        );

        return;
    }


    const text =
        messagePreview.value;


    if (!text.trim()) {

        alert(
            "احسب السعر أولاً"
        );

        return;
    }


    navigator.clipboard
        .writeText(text)

        .then(function () {

            alert(
                "تم نسخ رسالة الواتساب"
            );

        })

        .catch(function () {

           

            messagePreview.select();

            document.execCommand("copy");

            alert(
                "تم نسخ رسالة الواتساب"
            );
        });
}
