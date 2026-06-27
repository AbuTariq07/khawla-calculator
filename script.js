const rolls = [107, 127, 137, 152];
const framePricePerMeter = 45;
const deliveryPrice = 29;

const fixedPrices = {
    "40x60": { withoutFrame: 130, withFrame: 229 },
    "60x90": { withoutFrame: 180, withFrame: 324 },
    "80x120": { withoutFrame: 280, withFrame: 470 },
    "90x140": { withoutFrame: 350, withFrame: 566 },
    "60x60": { withoutFrame: 150, withFrame: 267 },
    "90x90": { withoutFrame: 250, withFrame: 421 },
    "110x110": { withoutFrame: 350, withFrame: 557 },
    "140x140": { withoutFrame: 550, withFrame: 751 },
    "45x90": { withoutFrame: 180, withFrame: 311 },
    "60x120": { withoutFrame: 250, withFrame: 421 },
    "70x140": { withoutFrame: 330, withFrame: 528 },
    "90x180": { withoutFrame: 479, withFrame: 731 }
};

function getSizeKey(width, height) {
    const a = Math.min(width, height);
    const b = Math.max(width, height);
    return `${a}x${b}`;
}

function calculatePrice() {
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const hasFrame = document.getElementById("frame").checked;

    const canvasPricePerMeter = parseFloat(document.getElementById("meterPrice").value) || 250;
    const discount1 = parseFloat(document.getElementById("discount1").value) || 0;
    const discount2 = parseFloat(document.getElementById("discount2").value) || 0;

    if (isNaN(width) || isNaN(height)) {
        alert("يرجى إدخال المقاسات");
        return;
    }

    const sizeKey = getSizeKey(width, height);
    let canvasPrice = 0;
    let framePrice = 0;
    let selectedRoll = "-";

    if (fixedPrices[sizeKey]) {
        const fixed = fixedPrices[sizeKey];
        const fixedTotal = hasFrame ? fixed.withFrame : fixed.withoutFrame;

        canvasPrice = hasFrame ? fixed.withFrame : fixed.withoutFrame;
        framePrice = 0;
        selectedRoll = "سعر ثابت";
    } else {
        if (width > 140 && height > 140) {
            alert("المقاس غير مقبول - يجب أن يكون أحد البعدين أقل من أو يساوي 140 سم");
            return;
        }

        const widthPlus = width + 10;
        const heightPlus = height + 10;

        let bestOption = null;

        for (const roll of rolls) {
            if (widthPlus <= roll) {
                const option = {
                    roll: roll,
                    waste: roll - widthPlus,
                    lengthForPrice: heightPlus
                };

                if (bestOption === null || option.waste < bestOption.waste) {
                    bestOption = option;
                }
            }

            if (heightPlus <= roll) {
                const option = {
                    roll: roll,
                    waste: roll - heightPlus,
                    lengthForPrice: widthPlus
                };

                if (bestOption === null || option.waste < bestOption.waste) {
                    bestOption = option;
                }
            }
        }

        if (bestOption === null) {
            alert("لا يوجد رول مناسب لهذا المقاس");
            return;
        }

        selectedRoll = bestOption.roll;

        canvasPrice =
            (selectedRoll / 100) *
            (bestOption.lengthForPrice / 100) *
            canvasPricePerMeter;

        if (hasFrame) {
            const frameWidth = (width + 5) / 100;
            const frameHeight = (height + 5) / 100;

            framePrice =
                ((frameWidth * 2) + (frameHeight * 2)) *
                framePricePerMeter;
        }
    }

    const total = canvasPrice + framePrice;
    const roundedPrice = Math.ceil(total);
    const firstTotal = roundedPrice + deliveryPrice;

    const afterDiscount =
        roundedPrice *
        (1 - discount1 / 100) *
        (1 - discount2 / 100);

    const roundedAfterDiscount = Math.ceil(afterDiscount);

    document.getElementById("roll").innerText =
        `الرول المختار : ${selectedRoll} سم`;

    document.getElementById("canvasPrice").innerText =
        `سعر اللوحة : ${canvasPrice.toFixed(2)} ريال`;

    document.getElementById("framePrice").innerText =
        `سعر الإطار : ${framePrice.toFixed(2)} ريال`;

    document.getElementById("totalPrice").innerText =
        `الإجمالي بعد الخصم : ${roundedAfterDiscount} ريال`;

    const frameText = hasFrame ? "مع إطار" : "بدون إطار";

    const whatsappMessage =
        `لوحة مقاس ${formatNumber(width)} سم × ${formatNumber(height)} سم ${frameText} : ${roundedPrice} ريال\n` +
        `التوصيل : ${deliveryPrice} ريال\n` +
        `الإجمالي : ${firstTotal} ريال\n\n` +
        `بعد الخصم : ${roundedAfterDiscount} ريال\n` +
        `التوصيل : مجاني\n` +
        `الإجمالي : ${roundedAfterDiscount} ريال`;

    document.getElementById("messagePreview").value = whatsappMessage;
}

function formatNumber(number) {
    return Number.isInteger(number) ? String(number) : String(number);
}

function copyMessage() {
    const text = document.getElementById("messagePreview").value;

    if (!text.trim()) {
        alert("احسب السعر أولاً");
        return;
    }

    navigator.clipboard.writeText(text);
    alert("تم نسخ رسالة الواتساب");
}
