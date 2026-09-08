let currentStep = 0;
let userName = "";
let photos = [];
let stream = null;

const quizData = [
    {
        pertanyaan: "Apa fungsi utama dari Resistor?",
        jawaban: ["hambat", "menghambat", "hambatan", "membatasi arus", "menahan arus"],
        gambar: ""
    },
    {
        pertanyaan: "Sebutkan nama komponen elektronika pada gambar ini!",
        jawaban: ["kapasitor", "capacitor"],
        gambar: "cahya.jpg"
    },
    {
        pertanyaan: "Komponen apa yang berfungsi sebagai saklar elektronik / penguat sinyal?",
        jawaban: ["transistor"],
        gambar: "yuan.jpg"
    }
];

// Inisialisasi Elemen
const verifikasiPage = document.getElementById("verifikasiPage");
const quizPage = document.getElementById("quizPage");
const photoboothPage = document.getElementById("photoboothPage");
const hasilPage = document.getElementById("hasilPage");

const verifikasiForm = document.getElementById("verifikasiForm");
const quizForm = document.getElementById("quizForm");
const namaInput = document.getElementById("namaUser");
const jawabanInput = document.getElementById("jawabanQuiz");

const displayNamaQuiz = document.getElementById("displayNamaQuiz");
const displayNamaHasil = document.getElementById("displayNamaHasil");

const nomorSoal = document.getElementById("nomorSoal");
const judulPertanyaan = document.getElementById("judulPertanyaan");
const gambarSoalBox = document.getElementById("gambarSoalBox");
const gambarSoal = document.getElementById("gambarSoal");

const errorNama = document.getElementById("errorNama");
const errorQuiz = document.getElementById("errorQuiz");

const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const snapBtn = document.getElementById("snapBtn");
const countdownEl = document.getElementById("countdown");
const photoCounter = document.getElementById("photoCounter");

// Step 1: Form Nama
verifikasiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = namaInput.value.trim();
    if (input === "") {
        errorNama.textContent = "Silakan masukkan nama terlebih dahulu!";
        return;
    }
    userName = input;
    displayNamaQuiz.textContent = userName;
    displayNamaHasil.textContent = "User: " + userName;
    
    verifikasiPage.classList.remove("active");
    quizPage.classList.add("active");
    loadQuiz();
});

// Step 2: Quiz
function loadQuiz() {
    errorQuiz.textContent = "";
    jawabanInput.value = "";
    
    const data = quizData[currentStep];
    nomorSoal.textContent = `PERTANYAAN ${currentStep + 1} / ${quizData.length}`;
    judulPertanyaan.textContent = data.pertanyaan;

    if (data.gambar) {
        gambarSoal.src = data.gambar;
        gambarSoalBox.style.display = "block";
    } else {
        gambarSoalBox.style.display = "none";
    }
}

quizForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userAns = jawabanInput.value.trim().toLowerCase();
    const validAns = quizData[currentStep].jawaban;

    const isCorrect = validAns.some(ans => userAns.includes(ans));

    if (isCorrect) {
        currentStep++;
        if (currentStep < quizData.length) {
            loadQuiz();
        } else {
            quizPage.classList.remove("active");
            photoboothPage.classList.add("active");
            startCamera();
        }
    } else {
        errorQuiz.textContent = "Jawaban kurang tepat. Coba lagi!";
    }
});

// Step 3: Camera
async function startCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;
    } catch (err) {
        alert("Kamera tidak dapat diakses! Pastikan izin kamera diberikan.");
    }
}

snapBtn.addEventListener("click", () => {
    snapBtn.disabled = true;
    photos = [];
    takePhotoSeries(0);
});

function takePhotoSeries(index) {
    if (index >= 6) {
        stopCamera();
        renderResults();
        photoboothPage.classList.remove("active");
        hasilPage.classList.add("active");
        return;
    }

    let count = 3;
    countdownEl.textContent = count;

    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownEl.textContent = count;
        } else {
            clearInterval(timer);
            countdownEl.textContent = "";
            
            // Ambil gambar
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext("2d");
            
            // Mirror efek agar sama seperti tampilan video
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const dataUrl = canvas.toDataURL("image/jpeg");
            photos.push(dataUrl);

            photoCounter.textContent = `${photos.length} / 6 Foto`;

            setTimeout(() => {
                takePhotoSeries(index + 1);
            }, 1000);
        }
    }, 1000);
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// Step 4: Display Results
function renderResults() {
    const today = new Date().toLocaleDateString('id-ID');
    document.getElementById("date1").textContent = today;
    document.getElementById("date2").textContent = today;

    for (let i = 0; i < 6; i++) {
        const img = document.getElementById(`res${i}`);
        if (img && photos[i]) {
            img.src = photos[i];
        }
    }
}

document.getElementById("restartBtn").addEventListener("click", () => {
    location.reload();
});

document.getElementById("downloadBtn").addEventListener("click", () => {
    alert("Tekan kombinasi tombol 'Win + Shift + S' atau Screenshot layar untuk menyimpan strip foto kamu!");
});
