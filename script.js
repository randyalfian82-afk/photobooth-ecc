/* ==========================================
   EC3C PHOTOBOOTH
========================================== */


/* ==========================================
   DATA MAHASISWA
========================================== */

const students = [
    {
        nim: "2503321002",
        nama: "Abdul Fattah"
    },
    {
        nim: "2503321073",
        nama: "Abyan Dwi Setiawan"
    },
    {
        nim: "2503321092",
        nama: "Alfian Randy"
    },
    {
        nim: "2503321094",
        nama: "Cahya Heryana"
    },
    {
        nim: "2503321050",
        nama: "Danendra Althaf"
    },
    {
        nim: "2503321058",
        nama: "Evan Okto Fahmi Romadhon"
    },
    {
        nim: "2503321066",
        nama: "Fawwaz Faishal Alwan"
    },
    {
        nim: "2503321067",
        nama: "Ghaisan Adiend Fathan Al Adli"
    },
    {
        nim: "2503321005",
        nama: "Hanifa Naila Triya Sumantri"
    },
    {
        nim: "2503321008",
        nama: "Intan Dhahy Arwa Admia Fernando"
    },
    {
        nim: "2503321064",
        nama: "Jusriadi"
    },
    {
        nim: "2503321013",
        nama: "Maulana Rafly Abdullah"
    },
    {
        nim: "2503321004",
        nama: "Muhamad Rizhan Faturahman"
    },
    {
        nim: "2503321049",
        nama: "Muhammad Addien Fikrul Akbar"
    },
    {
        nim: "2503321027",
        nama: "Muhammad Dzaki Hisyam"
    },
    {
        nim: "2503321071",
        nama: "Muhammad Faiq Satia Prasaja"
    },
    {
        nim: "2503321040",
        nama: "Muhammad Farrel Baddar Pamuji"
    },
    {
        nim: "2503321084",
        nama: "Muhammad Rashya Erlangga"
    },
    {
        nim: "2503321070",
        nama: "Muhammad Rizky Ramadhan"
    },
    {
        nim: "2503321063",
        nama: "Najwa Sharfina Muswar"
    },
    {
        nim: "2503321032",
        nama: "Reyvan Albaihaqi Fasya"
    },
    {
        nim: "2503321025",
        nama: "Shafa Dhia Alya Judanti"
    },
    {
        nim: "2503321034",
        nama: "Teuku Naufal Abyan"
    },
    {
        nim: "2503321077",
        nama: "Yuan Rizqy Pratama"
    }
];


/* ==========================================
   DATA PERTANYAAN
========================================== */

const questions = [
    {
        question: "Apa fungsi utama dari resistor?",
        answers: ["hambatan", "menghambat arus"],
        image: "",
        wrong: "TOLOL!!"
    },
    {
        question: "Maskot kelas EC 3C ini siapa? Coba lihat orangnya!",
        answers: ["cahya", "bule"],
        image: "cahya.jpg",
        wrong: "DONGO!!"
    },
    {
        question: "Siapa nama KM kita?",
        answers: ["yuan rizky pratama", "yuan"],
        image: "",
        wrong: "YAHH MASA GATAU SIH!!"
    },
    {
        question: "Siapa yang disuruh keluar sama Pa Isan?",
        answers: ["fawaz", "fawwaz"],
        image: "",
        wrong: "POTONG RAMBUT LU WAZ!!"
    },
    {
        question: "Dosen siapa yang jarang masuk di semester 3?",
        answers: ["bu sri", "sri", "endang"],
        image: "",
        wrong: "MASA DOSEN AJA GAK TAU!!"
    }
];


/* ==========================================
   VARIABLE
========================================== */

let currentQuestion = 0;
let currentStudent = null;
let photos = [];
let cameraStream = null;
let takingPhotos = false;


/* ==========================================
   ELEMENT HTML
========================================== */

const loginPage = document.getElementById("loginPage");
const quizPage = document.getElementById("quizPage");
const cameraPage = document.getElementById("cameraPage");
const resultPage = document.getElementById("resultPage");

const loginForm = document.getElementById("loginForm");
const quizForm = document.getElementById("quizForm");

const nimInput = document.getElementById("nim");
const namaInput = document.getElementById("nama");
const answerInput = document.getElementById("answer");

const loginError = document.getElementById("loginError");
const quizError = document.getElementById("quizError");

const displayNama = document.getElementById("displayNama");

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");

const questionImage = document.getElementById("questionImage");
const quizImage = document.getElementById("quizImage");

const camera = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const countdown = document.getElementById("countdown");
const photoCounter = document.getElementById("photoCounter");
const snapButton = document.getElementById("snapButton");
const cameraError = document.getElementById("cameraError");


/* ==========================================
   SHOW PAGE
========================================== */

function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    page.classList.add("active");
}


/* ==========================================
   NORMALISASI TEXT
========================================== */

function normalize(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/* ==========================================
   LOGIN
========================================== */

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nim = nimInput.value.trim();
    const nama = normalize(namaInput.value);

    const student = students.find(
        student => student.nim === nim && normalize(student.nama) === nama
    );

    if (!student) {
        loginError.textContent = "LO BUKAN ANAK EC";
        return;
    }

    currentStudent = student;
    displayNama.textContent = student.nama;
    currentQuestion = 0;
    loginError.textContent = "";

    showPage(quizPage);
    loadQuestion();
});


/* ==========================================
   LOAD QUESTION
========================================== */

function loadQuestion() {
    const q = questions[currentQuestion];

    questionNumber.textContent = `PERTANYAAN ${currentQuestion + 1} / ${questions.length}`;
    questionText.textContent = q.question;
    answerInput.value = "";
    quizError.textContent = "";

    if (q.image) {
        quizImage.src = q.image;
        questionImage.style.display = "block";
    } else {
        quizImage.src = "";
        questionImage.style.display = "none";
    }

    setTimeout(() => answerInput.focus(), 100);
}


/* ==========================================
   QUIZ CHECK
========================================== */

quizForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const userAnswer = normalize(answerInput.value);
    const q = questions[currentQuestion];

    const correct = q.answers.some(answer =>
        userAnswer.includes(normalize(answer))
    );

    if (!correct) {
        quizError.textContent = q.wrong;

        /* efek getar */
        quizForm.classList.add("shake");
        setTimeout(() => {
            quizForm.classList.remove("shake");
        }, 500);

        return;
    }

    /* Jawaban benar */
    quizError.style.color = "#4cffb0";
    quizError.textContent = "✓ BENAR!";

    currentQuestion++;

    setTimeout(() => {
        quizError.style.color = "";

        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showPage(cameraPage);
            startCamera();
        }
    }, 600);
});


/* ==========================================
   START CAMERA
========================================== */

async function startCamera() {
    cameraError.textContent = "";

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        cameraError.textContent = "Browser tidak mendukung kamera.";
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            },
            audio: false
        });

        camera.srcObject = cameraStream;
        await camera.play();
    } catch (error) {
        console.error(error);
        cameraError.textContent = "KAMERA GAGAL DIAKSES. Izinkan kamera pada browser.";
    }
}


/* ==========================================
   STOP CAMERA
========================================== */

function stopCamera() {
    if (!cameraStream) return;

    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
}


/* ==========================================
   TOMBOL FOTO
========================================== */

snapButton.addEventListener("click", function() {
    if (takingPhotos) return;

    if (!cameraStream) {
        cameraError.textContent = "Kamera belum aktif.";
        return;
    }

    photos = [];
    photoCounter.textContent = "0 / 6 FOTO";
    takingPhotos = true;
    snapButton.disabled = true;

    takePhoto(0);
});


/* ==========================================
   FOTO 1 - 6
========================================== */

function takePhoto(index) {
    if (index >= 6) {
        stopCamera();
        renderResults();
        showPage(resultPage);
        takingPhotos = false;
        return;
    }

    let count = 3;
    countdown.textContent = count;

    const timer = setInterval(() => {
        count--;

        if (count > 0) {
            countdown.textContent = count;
        } else {
            clearInterval(timer);
            countdown.textContent = "📸";

            capturePhoto();

            setTimeout(() => {
                countdown.textContent = "";
                takePhoto(index + 1);
            }, 1000);
        }
    }, 1000);
}


/* ==========================================
   CAPTURE PHOTO
========================================== */

function capturePhoto() {
    const width = camera.videoWidth || 1280;
    const height = camera.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    /* Mirror foto */
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(camera, 0, 0, width, height);
    ctx.restore();

    const image = canvas.toDataURL("image/jpeg", 0.92);
    photos.push(image);

    photoCounter.textContent = `${photos.length} / 6 FOTO`;
}


/* ==========================================
   RENDER RESULTS
========================================== */

function renderResults() {
    const date = new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    document.getElementById("resultName").textContent = "User: " + currentStudent.nama;
    document.getElementById("date1").textContent = date;
    document.getElementById("date2").textContent = date;

    for (let i = 0; i < 6; i++) {
        const img = document.getElementById(`result${i}`);
        img.src = photos[i];
    }
}


/* ==========================================
   DOWNLOAD STRIP
========================================== */

document.getElementById("downloadButton").addEventListener("click", downloadResult);

async function downloadResult() {
    if (photos.length !== 6) {
        alert("Foto belum lengkap.");
        return;
    }

    const stripWidth = 460;
    const stripHeight = 1180;
    const finalWidth = stripWidth * 2 + 60;

    const output = document.createElement("canvas");
    output.width = finalWidth;
    output.height = stripHeight + 40;

    const ctx = output.getContext("2d");

    /* Background */
    ctx.fillStyle = "#dcdcdc";
    ctx.fillRect(0, 0, output.width, output.height);

    drawStrip(ctx, 20, 20, 0);
    drawStrip(ctx, stripWidth + 40, 20, 3);

    const link = document.createElement("a");
    link.download = `EC3C-${currentStudent.nama}.jpg`;
    link.href = output.toDataURL("image/jpeg", 0.95);
    link.click();

    function drawStrip(ctx, x, y, start) {
        /* Kertas */
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x, y, stripWidth, stripHeight);

        /* Header */
        ctx.fillStyle = "#07151f";
        ctx.fillRect(x + 20, y + 20, stripWidth - 40, 55);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 22px Arial";
        ctx.fillText("⚡ EC3C ⚡", x + stripWidth / 2, y + 55);

        /* Title */
        ctx.fillStyle = "#111111";
        ctx.font = "bold 17px monospace";
        ctx.fillText("EC3C PHOTOBOOTH", x + stripWidth / 2, y + 105);

        /* FOTO */
        let imageY = y + 125;

        for (let i = 0; i < 3; i++) {
            const img = new Image();
            img.src = photos[start + i];

            const photoWidth = stripWidth - 40;
            const photoHeight = 320;

            ctx.drawImage(img, x + 20, imageY, photoWidth, photoHeight);
            imageY += photoHeight + 10;
        }

        /* Footer */
        ctx.fillStyle = "#111111";
        ctx.font = "bold 15px monospace";
        ctx.fillText("CLASS OF EC3C", x + stripWidth / 2, y + stripHeight - 35);
    }
}


/* ==========================================
   RESTART
========================================== */

document.getElementById("restartButton").addEventListener("click", function() {
    stopCamera();
    location.reload();
});


/* ==========================================
   PAGE DITUTUP
========================================== */

window.addEventListener("beforeunload", function() {
    stopCamera();
});
