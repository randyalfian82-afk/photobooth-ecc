"use strict";

/* =====================================================
   DATA MAHASISWA
===================================================== */

const students = [
    { nim: "2503321002", nama: "Abdul Fattah" },
    { nim: "2503321073", nama: "Abyan Dwi Setiawan" },
    { nim: "2503321092", nama: "Alfian Randy" },
    { nim: "2503321094", nama: "Cahya Heryana" },
    { nim: "2503321050", nama: "Danendra Althaf" },
    { nim: "2503321058", nama: "Evan Okto Fahmi Romadhon" },
    { nim: "2503321066", nama: "Fawwaz Faisal Alwan" },
    { nim: "2503321067", nama: "Ghaisan Adiend Fathan Al Adli" },
    { nim: "2503321005", nama: "Hanifa Na'ila Triya Sumantri" },
    { nim: "2503321008", nama: "Intan Dhahy Arwa Admia Fernando" },
    { nim: "2503321064", nama: "Jusriadi" },
    { nim: "2503321013", nama: "Maulana Rafiy Abdullah" },
    { nim: "2503321004", nama: "Muhammad Rizhan Faturahman" },
    { nim: "2503321049", nama: "Muhammad Addien Fikrul Akbar" },
    { nim: "2503321027", nama: "Muhammad Dzaki Hisyam" },
    { nim: "2503321071", nama: "Muhammad Faiq Satia Prasaja" },
    { nim: "2503321040", nama: "Muhammad Farrell Baddar Pamuji" },
    { nim: "2503321084", nama: "Muhammad Rashya Erlangga" },
    { nim: "2503321070", nama: "Muhammad Rizky Ramadhan" },
    { nim: "2503321063", nama: "Najwa Sharfina Muswar" },
    { nim: "2503321032", nama: "Reyvan Albaqiqi Fasya" },
    { nim: "2503321025", nama: "Shafa Dhia Alya Jundanti" },
    { nim: "2503321034", nama: "Teuku Naufal Abyan" },
    { nim: "2503321077", nama: "Yuan Rizqy Pratama" }
];


/* =====================================================
   DATA PERTANYAAN
===================================================== */

const questions = [
    {
        question: "Apa fungsi utama dari resistor?",
        answers: [
            "hambatan",
            "menghambat",
            "menghambat arus",
            "membatasi arus",
            "penghambat arus"
        ],
        image: "",
        wrong: "Jawaban belum benar."
    },
    {
        question: "Maskot kelas EC 3C ini siapa? Siapa nama orang ini?",
        answers: [
            "cahya",
            "cahya heryana",
            "bule"
        ],
        image: "cahya.jpg",
        wrong: "Jawaban belum benar."
    },
    {
        question: "Siapa nama KM kita?",
        answers: [
            "yuan",
            "yuan rizqy pratama",
            "yuan rizky pratama"
        ],
        image: "yuan.jpg",
        wrong: "Yah, masa tidak tahu?"
    },
    {
        question: "Siapa yang disuruh keluar sama Pa Isan?",
        answers: [
            "fawaz",
            "fawwaz",
            "fawwaz faisal alwan"
        ],
        image: "",
        wrong: "Jawaban belum benar."
    },
    {
        question: "Dosen siapa yang jarang masuk di semester 3?",
        answers: [
            "bu sri",
            "ibu sri",
            "sri",
            "endang",
            "bu endang",
            "ibu endang"
        ],
        image: "",
        wrong: "Jawaban belum benar."
    }
];


/* =====================================================
   KONSTANTA DAN STATE
===================================================== */

const TOTAL_PHOTOS = 6;
const COUNTDOWN_SECONDS = 3;
const DELAY_AFTER_PHOTO = 900;

let currentQuestion = 0;
let currentStudent = null;
let photos = [];
let cameraStream = null;
let takingPhotos = false;
let activeTimer = null;


/* =====================================================
   ELEMEN DOM
===================================================== */

const loginPage = document.getElementById("loginPage");
const quizPage = document.getElementById("quizPage");
const cameraPage = document.getElementById("cameraPage");
const resultPage = document.getElementById("resultPage");

const loginForm = document.getElementById("loginForm");
const quizForm = document.getElementById("quizForm");

const namaInput = document.getElementById("nama");
const nimInput = document.getElementById("nim");
const answerInput = document.getElementById("answer");

const loginError = document.getElementById("loginError");
const quizError = document.getElementById("quizError");
const cameraError = document.getElementById("cameraError");

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
const backToQuizButton = document.getElementById("backToQuizButton");
const downloadButton = document.getElementById("downloadButton");
const restartButton = document.getElementById("restartButton");


/* =====================================================
   UTILITAS
===================================================== */

function showPage(targetPage) {
    document.querySelectorAll(".page").forEach((page) => {
        page.classList.remove("active");
    });

    targetPage.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeNim(value) {
    return String(value ?? "").replace(/\D/g, "");
}

function setMessage(element, message, success = false) {
    element.textContent = message;
    element.classList.toggle("success", success);
}

function shakeElement(element) {
    element.classList.remove("shake");

    void element.offsetWidth;

    element.classList.add("shake");

    window.setTimeout(() => {
        element.classList.remove("shake");
    }, 500);
}

function wait(milliseconds) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}

function safeFileName(value) {
    return normalizeText(value)
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

function nameMatches(inputName, realName) {
    const input = normalizeText(inputName);
    const real = normalizeText(realName);

    if (!input || !real) {
        return false;
    }

    if (input === real) {
        return true;
    }

    const inputParts = input.split(" ");
    const realParts = real.split(" ");

    /*
     * Memperbolehkan:
     * - nama lengkap
     * - satu bagian nama, misalnya "Yuan"
     * - beberapa bagian nama, misalnya "Rizqy Pratama"
     *
     * NIM tetap wajib cocok agar nama singkat tidak masuk
     * ke mahasiswa yang salah.
     */
    return inputParts.every((part) => realParts.includes(part));
}

function answerMatches(inputAnswer, acceptedAnswers) {
    const answer = normalizeText(inputAnswer);

    return acceptedAnswers.some((acceptedAnswer) => {
        return answer === normalizeText(acceptedAnswer);
    });
}


/* =====================================================
   INPUT NIM
===================================================== */

nimInput.addEventListener("input", () => {
    nimInput.value = normalizeNim(nimInput.value);
});


/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nim = normalizeNim(nimInput.value);
    const nama = namaInput.value.trim();

    setMessage(loginError, "");

    if (!nama || !nim) {
        setMessage(loginError, "Nama dan NIM wajib diisi.");
        shakeElement(loginForm);
        return;
    }

    const studentByNim = students.find((student) => {
        return student.nim === nim;
    });

    if (!studentByNim) {
        setMessage(loginError, "NIM tidak ditemukan dalam data EC3C.");
        shakeElement(loginForm);
        nimInput.focus();
        return;
    }

    if (!nameMatches(nama, studentByNim.nama)) {
        setMessage(
            loginError,
            "NIM ditemukan, tetapi nama tidak cocok. Coba nama lengkap atau salah satu bagian nama."
        );

        shakeElement(loginForm);
        namaInput.focus();
        return;
    }

    currentStudent = studentByNim;
    currentQuestion = 0;

    displayNama.textContent = currentStudent.nama;
    setMessage(loginError, "");

    showPage(quizPage);
    loadQuestion();
});


/* =====================================================
   PERTANYAAN
===================================================== */

function loadQuestion() {
    const question = questions[currentQuestion];

    questionNumber.textContent =
        `PERTANYAAN ${currentQuestion + 1} / ${questions.length}`;

    questionText.textContent = question.question;

    answerInput.value = "";
    setMessage(quizError, "");

    if (question.image) {
        quizImage.src = question.image;
        quizImage.alt = `Gambar untuk pertanyaan ${currentQuestion + 1}`;
        questionImage.hidden = false;
    } else {
        quizImage.removeAttribute("src");
        questionImage.hidden = true;
    }

    window.setTimeout(() => {
        answerInput.focus();
    }, 150);
}

quizImage.addEventListener("error", () => {
    questionImage.hidden = true;

    setMessage(
        quizError,
        "Gambar soal tidak ditemukan. Pastikan file gambarnya berada di folder yang sama."
    );
});


/* =====================================================
   VALIDASI KUIS
===================================================== */

quizForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = questions[currentQuestion];
    const answer = answerInput.value.trim();

    if (!answer) {
        setMessage(quizError, "Jawaban wajib diisi.");
        shakeElement(quizForm);
        return;
    }

    if (!answerMatches(answer, question.answers)) {
        setMessage(quizError, question.wrong);
        shakeElement(quizForm);
        answerInput.select();
        return;
    }

    setMessage(quizError, "✓ BENAR!", true);

    const submitButton = quizForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;

    await wait(650);

    currentQuestion += 1;
    submitButton.disabled = false;

    if (currentQuestion < questions.length) {
        loadQuestion();
        return;
    }

    showPage(cameraPage);
    await startCamera();
});


/* =====================================================
   KAMERA
===================================================== */

async function startCamera() {
    stopCamera();

    setMessage(cameraError, "");
    snapButton.disabled = true;
    snapButton.textContent = "MEMUAT KAMERA...";

    if (
        !navigator.mediaDevices ||
        typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
        setMessage(
            cameraError,
            "Browser ini tidak mendukung kamera. Gunakan Chrome atau Edge terbaru."
        );

        snapButton.textContent = "KAMERA TIDAK TERSEDIA";
        return;
    }

    if (!window.isSecureContext) {
        setMessage(
            cameraError,
            "Kamera hanya dapat diakses melalui HTTPS atau localhost. Jangan membuka HTML langsung dengan alamat file://."
        );

        snapButton.textContent = "KAMERA MEMERLUKAN HTTPS";
        return;
    }

    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        camera.srcObject = cameraStream;

        await new Promise((resolve) => {
            if (camera.ready
