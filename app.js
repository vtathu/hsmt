// --- QUẢN LÝ TRẠNG THÁI & THỜI GIAN GAME ---
const Game = {
  secs: 48 * 3600,
  paused: false,
  timerInterval: null,

  start() {
    document.getElementById('screen-title').classList.remove('active');
    document.getElementById('screen-game').classList.add('active');
    this.startTimer();
    Cutscene.startIntro();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (!this.paused && this.secs > 0) {
        this.secs--;
        this.updateClockUI();
        if (this.secs <= 0) {
          alert("Hết 48 giờ! Cửa hầm đóng vĩnh viễn...");
          location.reload();
        }
      }
    }, 1000);
  },

  updateClockUI() {
    let h = Math.floor(this.secs / 3600);
    let m = Math.floor((this.secs % 3600) / 60);
    let s = this.secs % 60;
    document.getElementById('timer-display').textContent = 
      `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  },

  togglePause() {
    this.paused = !this.paused;
    document.getElementById('paused-screen').hidden = !this.paused;
    document.getElementById('btn-pause').textContent = this.paused ? "▶ Tiếp tục" : "⏸ Pause";
  }
};

// --- QUẢN LÝ MODAL & TÍNH NĂNG QUÉT/TÔ VĂN BẢN (HIGHLIGHT) ---
const Modal = {
  open(title, htmlContent) {
    document.getElementById('viewer-title').textContent = title;
    document.getElementById('viewer-body').innerHTML = htmlContent;
    document.getElementById('modal-viewer').hidden = false;
  },
  close() {
    document.getElementById('modal-viewer').hidden = true;
  }
};

// Lắng nghe sự kiện bôi đen văn bản để lưu vào sổ tay
document.addEventListener('mouseup', () => {
  let selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 3 && document.getElementById('modal-viewer').hidden === false) {
    if (confirm(`Bạn muốn đưa đoạn text này vào Sổ tay viết tay?\n\n"${selectedText}"`)) {
      Notebook.addEntry(selectedText);
      window.getSelection().removeAllRanges();
      alert("Đã lưu vào Sổ tay thành công!");
    }
  }
});

// --- SỔ TAY (VIẾT TAY & GHI CHÚ TỰ DO) ---
const Notebook = {
  entries: JSON.parse(localStorage.getItem('hsmt_notes')) || [
    "Khởi đầu: Bị nhốt dưới hầm kho lúc 00:00.",
    "Gợi ý từ Nam: Cần tìm ra tần số Hz tương ứng của 4 vụ."
  ],

  open() {
    this.render();
    document.getElementById('modal-notebook').hidden = false;
  },
  close() {
    document.getElementById('modal-notebook').hidden = true;
  },

  addEntry(text) {
    this.entries.push(text);
    localStorage.setItem('hsmt_notes', JSON.stringify(this.entries));
  },

  addUserNote() {
    let input = document.getElementById('notebook-user-input');
    let val = input.value.trim();
    if (val) {
      this.addEntry(val);
      input.value = '';
      this.render();
    }
  },

  render() {
    let box = document.getElementById('notebook-entries');
    box.innerHTML = this.entries.map(e => `<div class="notebook-entry-item">• ${e}</div>`).join('');
  }
};

// --- HỆ THỐNG GỢI Ý (HINTS) ĐỘC LẬP THEO VỤ ---
const HintSys = {
  currentTab: 1,
  hintsData: {
    1: "<b>Vụ 1: Vách Mây</b><br>• Gợi ý: Xem lại thông số độ cao 32m và khoảng cách ngang 14.4m.<br>• Hướng suy luận: Đây là bài toán ném ngang. Thời gian rơi phụ thuộc hoàn toàn vào gia tốc trọng trường và độ cao (\(t = \sqrt{2h/g}\)).",
    2: "<b>Vụ 2: Kho Xưởng Cũ</b><br>• Gợi ý: Kiểm tra lực ma sát nghỉ cực đại tại mặt phẳng nghiêng.<br>• Hướng suy luận: Hệ số ma sát \(\mu\) tính từ góc trượt của vật thể.",
    3: "<b>Vụ 3: Trạm Bơm Số 3</b><br>• Gợi ý: Lọ mẫu nước H3 có liên quan trực tiếp đến số liệu xả thải định kỳ.<br>• Hướng suy luận: Tính lưu lượng dòng chảy qua ống dẫn.",
    4: "<b>Vụ 4: Phòng Thí Nghiệm Trung Tâm</b><br>• Gợi ý: Nốt nhạc cuối cùng được suy ra từ tần số cộng hưởng của con lắc lò xo.<br>• Hướng suy luận: Đọc kỹ biên bản kiểm định thiết bị phát xạ."
  },

  open() {
    this.switchTab(1);
    document.getElementById('modal-hints').hidden = false;
  },
  close() {
    document.getElementById('modal-hints').hidden = true;
  },
  switchTab(tabNum) {
    this.currentTab = tabNum;
    document.querySelectorAll('.tab-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx + 1 === tabNum);
    });
    document.getElementById('hint-content-box').innerHTML = this.hintsData[tabNum];
  }
};

// --- NỘI DUNG TÀI LIỆU & VẬT CHỨNG ---
const Documents = {
  open() {
    Modal.open("📁 Laptop của Nam - Tập hồ sơ vụ án", `
      <h4>Biên bản hiện trường Vụ 1: Vách Mây</h4>
      <p>Nạn nhân: Lê Quang Vinh. Rơi từ vách cao 32m, khoảng cách ngang đo được là 14,4m.</p>
      <p>Đồng hồ hiện trường dừng lúc 16:12.</p>
      <hr style="margin:10px 0; border-color:var(--line);">
      <p style="color:var(--lamp);"><b>Yêu cầu:</b> Hãy bôi đen các thông số vận tốc hoặc công thức mấu chốt ở đây để tự động đưa vào Sổ tay.</p>
    `);
  }
};

const Evidence = {
  open() {
    Modal.open("🔍 Vật chứng thu từ kho", `
      <div style="margin-bottom:12px;">
        <h4 style="color:var(--lamp);">1. Lọ mẫu nước H3</h4>
        <p>Lấy tại cống xả số 3 của nhà máy. Niêm phong nguyên vẹn.</p>
      </div>
      <div>
        <h4 style="color:var(--lamp);">2. Sổ tay ông Vinh</h4>
        <p>Trang cuối có dòng chữ viết tay mờ: <i>"Mẫu H3, R = 4,7. Kiểm tra lại ống xả."</i></p>
      </div>
    `);
  }
};

const Radio = {
  open() {
    alert("Bạn bấm bộ đàm gọi Nam. Tiếng rè phát lên...\nNam: 'Thầy hãy kiểm tra kỹ tài liệu và sổ tay, đừng gọi cho em lúc này!'\n(-3 phút thời gian)");
    Game.secs = Math.max(0, Game.secs - 180);
    Game.updateClockUI();
  }
};

const Machine = {
  open() {
    Modal.open("⚡ Máy Đối Chiếu Tần Số Hz", `
      <p>Nhập giá trị Hz thu được từ các chốt để giải mã nốt nhạc:</p>
      <input type="text" placeholder="Nhập tần số (Ví dụ: 440 Hz)..." style="width:100%; padding:10px; margin-top:10px; background:var(--bg); border:1px solid var(--line); color:var(--tx); border-radius:6px;">
      <button class="btn pri" style="margin-top:12px;" onclick="alert('Đã ghi nhận mã tần số!')">Kiểm tra kết quả</button>
    `);
  }
};

// --- CẢNH HỘI THOẠI (CUTSCENE - SÁNG/MỜ 2 NHÂN VẬT) ---
const Cutscene = {
  lines: [
    { speaker: "Hệ thống", char: null, text: "(Màn hình chớp đen một cái... Thấy Minh bừng tỉnh trong một căn hầm tối ẩm thấp, ánh sáng duy nhất phát ra từ màn hình camera gắn trên tường)." },
    { speaker: "Thầy Minh", char: "minh", text: "Nam? Em đang làm trò gì thế này? Mau thả thầy ra!" },
    { speaker: "Nam", char: "nam", text: "(Giọng phát ra từ loa camera) Thầy đừng tìm công sức vô ích. Em cần thầy minh oan cho 4 vụ án của bố em." },
    { speaker: "Thầy Minh", char: "minh", text: "Tại sao em lại chọn cách cực đoan này để đối xử với thầy?" },
    { speaker: "Nam", char: "nam", text: "Thầy có 48 giờ và 4 tập hồ sơ trên hệ thống. Hãy dùng tư duy khoa học giải mã các nốt nhạc. Đủ 4 nốt, cửa hầm tự khắc mở." }
  ],
  currentIndex: 0,

  startIntro() {
    this.currentIndex = 0;
    document.getElementById('cutscene-box').hidden = false;
    this.showCurrentLine();
  },

  showCurrentLine() {
    if (this.currentIndex >= this.lines.length) {
      document.getElementById('cutscene-box').hidden = true;
      document.getElementById('quick-dialog-preview').innerHTML = "<b>Nam:</b> 'Thầy hãy tập trung giải mã 4 vụ án đi...!' (Chạm để xem lại hội thoại)";
      return;
    }
    let l = this.lines[this.currentIndex];
    document.getElementById('cutscene-speaker').textContent = l.speaker;
    document.getElementById('cutscene-text').textContent = l.text;

    // Hiệu ứng sáng/mờ nhân vật
    let mAvatar = document.getElementById('char-minh');
    let nAvatar = document.getElementById('char-nam');
    mAvatar.classList.remove('active');
    nAvatar.classList.remove('active');

    if (l.char === 'minh') mAvatar.classList.add('active');
    if (l.char === 'nam') nAvatar.classList.add('active');

    this.currentIndex++;
  },

  next() {
    this.showCurrentLine();
  },

  resume() {
    this.currentIndex = 0;
    document.getElementById('cutscene-box').hidden = false;
    this.showCurrentLine();
  }
};

// --- ĐĂNG NHẬP FIREBASE (TÙY CHỌN LƯU MÂY) ---
const Auth = {
  loginGoogle() {
    alert("Tính năng Đăng nhập Firebase Cloud đã sẵn sàng trong cấu hình. Hãy cấu hình thông số Firebase của bạn trong mã nguồn để kích hoạt lưu tiến độ qua các thiết bị!");
  }
};