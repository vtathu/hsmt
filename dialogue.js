// --- HỆ THỐNG QUẢN LÝ HỘI THOẠI (DIALOGUE) ---
const dialogueData = {
    intro: [
        { speaker: "Thầy Minh", text: "Nam? Em làm gì vậy? Thả thầy ra!" },
        { speaker: "Nam", text: "Thầy nhớ em là ai, thế là tốt rồi. Em không muốn làm hại thầy. Em chỉ cần thầy chứng minh bố em vô tội..." },
        { speaker: "Nam", text: "Thầy có 48 giờ. Hết giờ, cái bình kia sẽ xả khí vào đây. Hãy tìm ra sự thật bằng khoa học!" }
    ],
    case1_solved: [
        { speaker: "Thầy Minh", text: "329,6 Hz... Mi. Nam, em đúng rồi. Còi của chiếc xe đó phát ra đúng nốt trên mảnh giấy số 1." },
        { speaker: "Nam", text: "(Giọng vỡ òa) Thầy... nhập lại đi. Thầy nhập lại cho em!" }
    ]
};

function showDialogue(sceneKey) {
    const dialogueBox = document.getElementById('dialogue-box');
    if (!dialogueBox) return;
    
    let script = dialogueData[sceneKey];
    if (!script || script.length === 0) return;

    let currentIndex = 0;
    
    // Hàm hiển thị từng câu thoại khi người chơi click/chạm
    window.nextDialogueLine = function() {
        if (currentIndex < script.length) {
            let line = script[currentIndex];
            dialogueBox.innerHTML = `<strong>${line.speaker}:</strong> ${line.text}`;
            currentIndex++;
        } else {
            dialogueBox.style.display = 'none'; // Ẩn khung thoại khi hết
        }
    };
    
    dialogueBox.style.display = 'block';
    nextDialogueLine(); // Hiển thị câu đầu tiên
}