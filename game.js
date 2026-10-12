// ==========================================
// HỒ SƠ MẤT TÍCH: 4 NỐT NHẠC TỬ THẦN - GAME LOGIC
// ==========================================

// --- 1. CẤU HÌNH DỮ LIỆU & TRẠNG THÁI GAME ---
const GAME_CONFIG = {
    // Tần số chuẩn (Hz) của 4 nốt mã cho 4 vụ án
    correctFrequencies: {
        vui1: 329.6, // Mi (Vách Mây)
        vui2: 392.0, // Sol (Cánh rừng)
        vui3: 523.3, // Đô (Bến Đá)
        vui4: 587.3  // Rê (Bác sĩ Đoàn)
    },
    // Trạng thái mở khóa các vụ
    unlockedCases: {
        vui1: true,
        vui2: false,
        vui3: false,
        vui4: false
    },
    // Giới hạn lượt sai mỗi vụ (Tối đa 5 lượt, lượt thứ 6 khóa máy / Kết D)
    mistakes: {
        vui1: 0,
        vui2: 0,
        vui3: 0,
        vui4: 0,
        maxMistakes: 5
    }
};

// --- 2. QUẢN LÝ MÀN HÌNH & POPUP ---
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Nếu chuyển sang màn hình chính, tự động khởi động đồng hồ nếu chưa chạy
    if (screenId === 'screen-main' && !gameTimer) {
        startTimer();
    }
}

function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.toggle('active');
    }
}

// --- 3. ĐỒNG HỒ ĐẾM NGƯỢC 48 GIỜ (CÓ HỖ TRỢ TẠM DỪNG) ---
let totalSeconds = 48 * 3600; // 48 giờ = 172800 giây
let gameTimer = null;
let isPaused = false;

function startTimer() {
    if (gameTimer) return;
    
    const timerDisplay = document.querySelector('.timer');
    if (!timerDisplay) return;

    gameTimer = setInterval(() => {
        if (!isPaused && totalSeconds > 0) {
            totalSeconds--;
            
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;

            timerDisplay.textContent = `⏳ ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else if (totalSeconds <= 0) {
            clearInterval(gameTimer);
            triggerEndingD("Hết 48 giờ! Trò chơi kết thúc (Kết D).");
        }
    }, 1000);
}

function togglePauseGame() {
    isPaused = !isPaused;
    alert(isPaused ? "Game đã tạm dừng. Thời gian suy ngẫm được bảo toàn." : "Đã tiếp tục trò chơi!");
}

// Trừ thời gian khi dùng gợi ý bậc 3 hoặc thao tác phạt (tính bằng giây)
function penalizeTime(seconds) {
    totalSeconds = Math.max(0, totalSeconds - seconds);
}

// --- 4. HỆ THỐNG MÁY ĐỐI CHIẾU & KIỂM TRA NỐT NHẠC ---
function checkFrequency(caseId, inputId) {
    // Kiểm tra xem vụ án đã được mở khóa chưa
    if (!GAME_CONFIG.unlockedCases[caseId]) {
        alert("Thư mục vụ án này chưa được mở khóa!");
        return;
    }

    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    let userValue = parseFloat(inputElement.value);
    let targetValue = GAME_CONFIG.correctFrequencies[caseId];

    // Cho phép sai số ±1.5%
    let tolerance = targetValue * 0.015;

    if (Math.abs(userValue - targetValue) <= tolerance) {
        alert(`CHÍNH XÁC! Tần số khớp hoàn hảo với nốt của hồ sơ.`);
        markCasePassed(caseId);
    } else {
        GAME_CONFIG.mistakes[caseId]++;
        let remainingMistakes = GAME_CONFIG.mistakes.maxMistakes - GAME_CONFIG.mistakes[caseId];

        if (remainingMistakes <= 0) {
            triggerEndingD(`Bạn đã nhập sai quá ${GAME_CONFIG.mistakes.maxMistakes} lần ở vụ này. Máy Đối Chiếu đã bị khóa! (Kết D)`);
        } else {
            alert(`SAI TẦN SỐ! Bạn còn lại ${remainingMistakes} lượt sai trước khi hệ thống khóa.`);
        }
    }
}

// Xử lý khi vượt qua một vụ án thành công
function markCasePassed(caseId) {
    if (caseId === 'vui1') {
        GAME_CONFIG.unlockedCases.vui2 = true;
        document.getElementById('folder-v2')?.classList.remove('locked');
        alert("Ô tần số Vụ 1 sáng xanh! Thư mục Vụ 2 trên Laptop đã mở.");
    } else if (caseId === 'vui2') {
        GAME_CONFIG.unlockedCases.vui3 = true;
        document.getElementById('folder-v3')?.classList.remove('locked');
        alert("Ô tần số Vụ 2 sáng xanh! Thư mục Vụ 3 trên Laptop đã mở.");
    } else if (caseId === 'vui3') {
        GAME_CONFIG.unlockedCases.vui4 = true;
        document.getElementById('folder-v4')?.classList.remove('locked');
        alert("Ô tần số Vụ 3 sáng xanh! Thư mục Vụ 4 trên Laptop đã mở.");
    } else if (caseId === 'vui4') {
        alert("4/4 KHỚP! Lồng lưới chứa dụng cụ đào tẩu đã mở khóa. Đồng hồ nhảy sang giai đoạn Màn 6.");
    }
}

// --- 5. HỆ THỐNG KẾT THÚC THẤT BẠI (KẾT D) ---
function triggerEndingD(message) {
    alert(message);
    // Về màn hình bắt đầu hoặc reset trạng thái
    switchScreen('screen-start');
}

// --- 6. HỆ THỐNG GỢI Ý (3 BẬC) ---
function getHint(level, caseName) {
    if (level === 1) {
        alert(`[Gợi ý Bậc 1 - Hướng đi (${caseName})]: Hãy tách chuyển động/dữ liệu và phân tích kỹ các mốc thời gian độc lập.`);
    } else if (level === 2) {
        alert(`[Gợi ý Bậc 2 - Tên phương pháp (${caseName})]: Tra cứu các công thức chuẩn trong tài liệu vật lý/pháp y tương ứng.`);
    } else if (level === 3) {
        penalizeTime(15 * 60); // Phạt trừ 15 phút thời gian chung
        alert(`[Gợi ý Bậc 3 - Công thức đầy đủ (${caseName})]: Đã trừ 15 phút thời gian do dùng gợi ý tối đa.`);
    }
}
