const rolls = [107, 127, 137, 152];
const canvasPricePerMeter = 250;
const framePricePerMeter = 45;
const deliveryPrice = 29;

function calculatePrice() {
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);
    const hasFrame = document.getElementById("frame").checked;

    if (isNaN(width) || isNaN(height)) {
        alert("يرجى إدخال المقاسات");
        return;
    }

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

            if (
                bestOption === null ||
                option.waste < bestOption.waste
            ) {
                bestOption = option;
            }
        }

        if (heightPlus <= roll) {
            const option = {
                roll: roll,
                waste: roll - heightPlus,
                lengthForPrice: widthPlus
            };

            if (
                bestOption === null ||
                option.waste < bestOption.waste
            ) {
                bestOption = option;
            }
        }
    }

    if (bestOption === null) {
        alert("لا يوجد رول مناسب لهذا المقاس");
        return;
    }

    const selectedRoll = bestOption.roll;
    const lengthForPrice = bestOption.lengthForPrice;

    const canvasPrice =
        (selectedRoll / 100) *
        (lengthForPrice / 100) *
        canvasPricePerMeter;

    let framePrice = 0;

    if (hasFrame) {
        const frameWidth = (width + 5) / 100;
        const frameHeight = (height + 5) / 100;

        framePrice =
            ((frameWidth * 2) + (frameHeight * 2)) *
            framePricePerMeter;
    }

    const total = canvasPrice + framePrice;
    const roundedPrice = Math.ceil(total);
    const firstTotal = roundedPrice + deliveryPrice;

    document.getElementById("roll").innerText =
        `الرول المختار : ${selectedRoll} سم`;

    document.getElementById("canvasPrice").innerText =
        `سعر اللوحة : ${canvasPrice.toFixed(2)} ريال`;

    document.getElementById("framePrice").innerText =
        `سعر الإطار : ${framePrice.toFixed(2)} ريال`;

    document.getElementById("totalPrice").innerText =
        `الإجمالي : ${total.toFixed(2)} ريال`;

    const frameText = hasFrame ? "مع إطار" : "بدون إطار";

    const whatsappMessage =
        `لوحة مقاس ${formatNumber(width)} سم × ${formatNumber(height)} سم ${frameText} : ${roundedPrice} ريال\n\n` +
        `التوصيل : ${deliveryPrice} ريال\n\n` +
        `الإجمالي : ${firstTotal} ريال\n\n\n` +
        `بعد الخصم :\n\n` +
        `التوصيل : مجاني\n\n` +
        `الإجمالي : `;

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
