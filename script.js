const rolls = [107, 127, 137, 152];
const canvasPricePerMeter = 250;
const framePricePerMeter = 45;
const deliveryPrice = 29;

function calculatePrice() {

    let width = parseFloat(document.getElementById("width").value);
    let height = parseFloat(document.getElementById("height").value);
    let hasFrame = document.getElementById("frame").checked;

    if (isNaN(width) || isNaN(height)) {
        alert("يرجى إدخال المقاسات");
        return;
    }

    if (width > 140 && height > 140) {
        alert("المقاس غير مقبول - يجب أن يكون أحد البعدين أقل من أو يساوي 140 سم");
        return;
    }

    let widthPlus = width + 10;
    let heightPlus = height + 10;

   let selectedRoll = null;
let lengthForPrice = null;

for (let roll of rolls) {
    let validOptions = [];

    if (widthPlus <= roll) {
        validOptions.push({
            waste: roll - widthPlus,
            length: heightPlus
        });
    }

    if (heightPlus <= roll) {
        validOptions.push({
            waste: roll - heightPlus,
            length: widthPlus
        });
    }

    if (validOptions.length > 0) {
        selectedRoll = roll;

        validOptions.sort((a, b) => a.waste - b.waste);

        lengthForPrice = validOptions[0].length;
        break;
    }
}
    if (!selectedRoll) {
        alert("لا يوجد رول مناسب لهذا المقاس");
        return;
    }

    let canvasPrice =
        (selectedRoll / 100) *
        (lengthForPrice / 100) *
        canvasPricePerMeter;

    let framePrice = 0;

    if (hasFrame) {

        let frameWidth = (width + 5) / 100;
        let frameHeight = (height + 5) / 100;

        framePrice =
            ((frameWidth * 2) + (frameHeight * 2))
            * framePricePerMeter;
    }

    let total = canvasPrice + framePrice;

    let roundedPrice = Math.ceil(total);

    let firstTotal = roundedPrice + deliveryPrice;

    document.getElementById("roll").innerText =
        `الرول المختار : ${selectedRoll} سم`;

    document.getElementById("canvasPrice").innerText =
        `سعر اللوحة : ${canvasPrice.toFixed(2)} ريال`;

    document.getElementById("framePrice").innerText =
        `سعر الإطار : ${framePrice.toFixed(2)} ريال`;

    document.getElementById("totalPrice").innerText =
        `الإجمالي : ${total.toFixed(2)} ريال`;

    let frameText =
        hasFrame ? "مع إطار" : "بدون إطار";

    let whatsappMessage =
        `لوحة مقاس ${width} سم × ${height} سم ${frameText} : ${roundedPrice} ريال\n\n` +
        `التوصيل : ${deliveryPrice} ريال\n\n` +
        `الإجمالي : ${firstTotal} ريال\n\n\n` +
        `بعد الخصم :\n\n` +
        `التوصيل : مجاني\n\n` +
        `الإجمالي : `;

    document.getElementById("messagePreview").value =
        whatsappMessage;
}

function copyMessage() {

    const text =
        document.getElementById("messagePreview").value;

    if (!text.trim()) {
        alert("احسب السعر أولاً");
        return;
    }

    navigator.clipboard.writeText(text);

    alert("تم نسخ رسالة الواتساب");
}
