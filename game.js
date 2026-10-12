// --- QUẢN LÝ MÀN HÌNH VÀ POPUP TRONG GAME ---

// Hàm chuyển đổi giữa các màn hình chính (Ví dụ: từ màn hình bắt đầu sang màn hình game board)
function switchScreen(screenId) {
    // Ẩn tất cả các màn hình có class 'game-screen'
    const screens = document.querySelectorAll('.game-screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Hiện màn hình được chỉ định
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Hàm bật/tắt các Popup tương tác (Laptop, Vật chứng, Cài đặt...)
function togglePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.toggle('active');
    }
}

// --- QUẢN LÝ ĐỒNG HỒ ĐẾM NGƯỢC 48 GIỜ ---
let totalSeconds = 48 * 3600; // 48 giờ tính bằng giây
let gameTimer = null;

function startTimer() {
    const timerDisplay = document.querySelector('.timer');
    if (!timerDisplay) return;

    gameTimer = setInterval(() => {
        if (totalSeconds > 0) {
            totalSeconds--;
            
            let hours = Math.floor(totalSeconds / 3600);
            let minutes = Math.floor((totalSeconds % 3600) / 60);
            let seconds = totalSeconds % 60;

            // Định dạng hiển thị dạng HH:MM:SS
            timerDisplay.textContent = `⏳ ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            clearInterval(gameTimer);
            alert("Đã hết 48 giờ! Trò chơi kết thúc (Kết D).");
            // Gọi hàm xử lý khi hết giờ ở đây nếu cần
        }
    }, 1000);
}

// Bạn có thể kích hoạt đồng hồ khi người chơi bấm nút Bắt đầu
// (Thêm lệnh startTimer() vào sự kiện chuyển màn hình nếu muốn)