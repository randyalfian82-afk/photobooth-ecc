/* =====================================================
   EC3C PHOTOBOOTH
===================================================== */


/* =====================================================
   DATA MAHASISWA
===================================================== */

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
        nama: "Fawwaz Faisal Alwan"
    },

    {
        nim: "2503321067",
        nama: "Ghaisan Adiend Fathan Al Adli"
    },

    {
        nim: "2503321005",
        nama: "Hanifa Na'ila Triya Sumantri"
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
        nama: "Maulana Rafiy Abdullah"
    },

    {
        nim: "2503321004",
        nama: "Muhammad Rizhan Faturahman"
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
        nama: "Muhammad Farrell Baddar Pamuji"
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
        nama: "Reyvan Albaqiqi Fasya"
    },

    {
        nim: "2503321025",
        nama: "Shafa Dhia Alya Jundanti"
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



/* =====================================================
   DATA PERTANYAAN
===================================================== */

const questions = [

    /* ==============================
       PERTANYAAN 1
    ============================== */

    {
        question:
            "Apa fungsi utama dari resistor?",

        answers: [
            "hambatan",
            "menghambat arus",
            "menghambat"
        ],

        image: "",

        wrong:
            "TOLOL!!"
    },


    /* ==============================
       PERTANYAAN 2
    ============================== */

    {
        question:
            "Maskot kelas EC 3C ini siapa? Siapa nama orang ini?",

        answers: [
            "cahya",
            "bule"
        ],

        image:
            "cahya.jpg",

        wrong:
            "DONGO!!"
    },


    /* ==============================
       PERTANYAAN 3
    ============================== */

    {
        question:
            "Siapa nama KM kita?",

        answers: [
            "yuan",
            "yuan rizqy pratama",
            "yuan rizky pratama"
        ],

        image:
            "yuan.jpg",

        wrong:
            "YAHH MASA GATAU SIH!!"
    },


    /* ==============================
       PERTANYAAN 4
    ============================== */

    {
        question:
            "Siapa yang disuruh keluar sama Pa Isan?",

        answers: [
            "fawaz",
            "fawwaz"
        ],

        image:
            "",

        wrong:
            "POTONG RAMBUT LU WAZ!!"
    },


    /* ==============================
       PERTANYAAN 5
    ============================== */

    {
        question:
            "Dosen siapa yang jarang masuk di semester 3?",

        answers: [
            "bu sri",
            "sri",
            "endang"
        ],

        image:
            "",

        wrong:
            "MASA DOSEN AJA GAK TAU!!"
    }

];



/* =====================================================
   VARIABLES
===================================================== */

let currentQuestion = 0;

let currentStudent = null;

let photos = [];

let cameraStream = null;

let takingPhotos = false;



/* =====================================================
   ELEMENTS
===================================================== */

const loginPage =
    document.getElementById(
        "loginPage"
    );

const quizPage =
    document.getElementById(
        "quizPage"
    );

const cameraPage =
    document.getElementById(
        "cameraPage"
    );

const resultPage =
    document.getElementById(
        "resultPage"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );

const quizForm =
    document.getElementById(
        "quizForm"
    );


const namaInput =
    document.getElementById(
        "nama"
    );

const nimInput =
    document.getElementById(
        "nim"
    );

const answerInput =
    document.getElementById(
        "answer"
    );


const loginError =
    document.getElementById(
        "loginError"
    );

const quizError =
    document.getElementById(
        "quizError"
    );


const displayNama =
    document.getElementById(
        "displayNama"
    );


const questionNumber =
    document.getElementById(
        "questionNumber"
    );

const questionText =
    document.getElementById(
        "questionText"
    );


const questionImage =
    document.getElementById(
        "questionImage"
    );

const quizImage =
    document.getElementById(
        "quizImage"
    );


const camera =
    document.getElementById(
        "camera"
    );

const canvas =
    document.getElementById(
        "canvas"
    );

const countdown =
    document.getElementById(
        "countdown"
    );

const photoCounter =
    document.getElementById(
        "photoCounter"
    );

const snapButton =
    document.getElementById(
        "snapButton"
    );

const cameraError =
    document.getElementById(
        "cameraError"
    );



/* =====================================================
   SHOW PAGE
===================================================== */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(
            pageElement => {

                pageElement.classList.remove(
                    "active"
                );

            }
        );


    page.classList.add(
        "active"
    );

}



/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalize(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(
            /\s+/g,
            " "
        );

}



/* =====================================================
   VALIDASI NAMA
===================================================== */

function nameMatches(
    inputName,
    realName
) {

    const input =
        normalize(inputName);

    const real =
        normalize(realName);


    /* Nama lengkap */

    if (
        input === real
    ) {

        return true;

    }


    /* Nama salah satu bagian */

    const parts =
        real.split(" ");


    if (
        parts.includes(input)
    ) {

        return true;

    }


    return false;

}



/* =====================================================
   LOGIN
===================================================== */

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const nim =
            nimInput.value.trim();


        const nama =
            namaInput.value.trim();


        /*
         * Cari mahasiswa berdasarkan:
         * 1. NIM
         * 2. Nama lengkap atau salah satu kata nama
         */

        const student =
            students.find(
                student => {

                    return (
                        student.nim === nim &&
                        nameMatches(
                            nama,
                            student.nama
                        )
                    );

                }
            );


        /* SALAH */

        if (!student) {

            loginError.textContent =
                "LO BUKAN ANAK EC";


            loginForm.classList.add(
                "shake"
            );


            setTimeout(
                () => {

                    loginForm.classList.remove(
                        "shake"
                    );

                },
                500
            );


            return;

        }


        /* BENAR */

        currentStudent =
            student;


        currentQuestion = 0;


        displayNama.textContent =
            student.nama;


        loginError.textContent =
            "";


        showPage(
            quizPage
        );


        loadQuestion();

    }
);



/* =====================================================
   LOAD QUESTION
===================================================== */

function loadQuestion() {

    const question =
        questions[
            currentQuestion
        ];


    questionNumber.textContent =
        `PERTANYAAN ${
            currentQuestion + 1
        } / ${
            questions.length
        }`;


    questionText.textContent =
        question.question;


    answerInput.value = "";

    quizError.textContent = "";


    quizError.style.color =
        "";


    /* Tampilkan gambar jika ada */

    if (
        question.image
    ) {

        quizImage.src =
            question.image;


        questionImage.style.display =
            "block";

    } else {

        quizImage.src =
            "";


        questionImage.style.display =
            "none";

    }


    setTimeout(
        () => {

            answerInput.focus();

        },
        150
    );

}



/* =====================================================
   CHECK QUIZ
===================================================== */

quizForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const userAnswer =
            normalize(
                answerInput.value
            );


        const question =
            questions[
                currentQuestion
            ];


        const correct =
            question.answers.some(
                correctAnswer => {

                    return (
                        userAnswer ===
                        normalize(
                            correctAnswer
                        )
                    );

                }
            );


        /* =========================
           JAWABAN SALAH
        ========================= */

        if (!correct) {

            quizError.textContent =
                question.wrong;


            quizError.style.color =
                "#ff4f73";


            quizForm.classList.add(
                "shake"
            );


            setTimeout(
                () => {

                    quizForm.classList.remove(
                        "shake"
                    );

                },
                500
            );


            return;

        }


        /* =========================
           JAWABAN BENAR
        ========================= */

        quizError.textContent =
            "✓ BENAR!";


        quizError.style.color =
            "#4cffb0";


        currentQuestion++;


        setTimeout(
            () => {

                if (
                    currentQuestion <
                    questions.length
                ) {

                    loadQuestion();

                } else {

                    showPage(
                        cameraPage
                    );


                    startCamera();

                }

            },
            700
        );

    }
);



/* =====================================================
   START CAMERA
===================================================== */

async function startCamera() {

    cameraError.textContent = "";


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        cameraError.textContent =
            "Browser tidak mendukung akses kamera.";

        return;

    }


    try {

        cameraStream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        },

                        facingMode:
                            "user"

                    },

                    audio: false

                });


        camera.srcObject =
            cameraStream;


        await camera.play();


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        cameraError.textContent =
            "KAMERA TIDAK BISA DIAKSES. Izinkan kamera pada browser.";

    }

}



/* =====================================================
   STOP CAMERA
===================================================== */

function stopCamera() {

    if (
        !cameraStream
    ) {

        return;

    }


    cameraStream
        .getTracks()
        .forEach(
            track => {

                track.stop();

            }
        );


    camera.srcObject =
        null;


    cameraStream =
        null;

}



/* =====================================================
   BUTTON AMBIL FOTO
===================================================== */

snapButton.addEventListener(
    "click",
    function() {

        if (
            takingPhotos
        ) {

            return;

        }


        if (
            !cameraStream
        ) {

            cameraError.textContent =
                "Kamera belum aktif.";

            return;

        }


        photos = [];


        photoCounter.textContent =
            "0 / 6 FOTO";


        takingPhotos =
            true;


        snapButton.disabled =
            true;


        takePhoto(0);

    }
);



/* =====================================================
   TAKE PHOTO
===================================================== */

function takePhoto(index) {

    /* Semua foto selesai */

    if (
        index >= 6
    ) {

        stopCamera();


        renderResults();


        showPage(
            resultPage
        );


        takingPhotos =
            false;


        return;

    }


    let count = 3;


    countdown.textContent =
        count;


    const timer =
        setInterval(
            () => {

                count--;


                if (
                    count > 0
                ) {

                    countdown.textContent =
                        count;

                } else {

                    clearInterval(
                        timer
                    );


                    countdown.textContent =
                        "📸";


                    capturePhoto();


                    setTimeout(
                        () => {

                            countdown.textContent =
                                "";


                            takePhoto(
                                index + 1
                            );

                        },
                        1000
                    );

                }

            },
            1000
        );

}



/* =====================================================
   CAPTURE PHOTO
===================================================== */

function capturePhoto() {

    const width =
        camera.videoWidth ||
        1280;


    const height =
        camera.videoHeight ||
        720;


    canvas.width =
        width;


    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d"
        );


    /*
     * Mirror foto agar sama
     * dengan tampilan kamera
     */

    context.save();


    context.translate(
        width,
        0
    );


    context.scale(
        -1,
        1
    );


    context.drawImage(
        camera,
        0,
        0,
        width,
        height
    );


    context.restore();


    const photo =
        canvas.toDataURL(
            "image/jpeg",
            0.92
        );


    photos.push(
        photo
    );


    photoCounter.textContent =
        `${photos.length} / 6 FOTO`;

}



/* =====================================================
   RENDER RESULT
===================================================== */

function renderResults() {

    const today =
        new Date()
            .toLocaleDateString(
                "id-ID",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );


    document.getElementById(
        "resultName"
    ).textContent =
        "User: " +
        currentStudent.nama;


    document.getElementById(
        "date1"
    ).textContent =
        today;


    document.getElementById(
        "date2"
    ).textContent =
        today;


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const image =
            document.getElementById(
                `result${i}`
            );


        image.src =
            photos[i];

    }

}



/* =====================================================
   DOWNLOAD
===================================================== */

document
    .getElementById(
        "downloadButton"
    )
    .addEventListener(
        "click",
        downloadResult
    );



async function downloadResult() {

    if (
        photos.length !== 6
    ) {

        alert(
            "Foto belum lengkap."
        );

        return;

    }


    const stripWidth =
        460;


    const stripHeight =
        1380;


    const output =
        document.createElement(
            "canvas"
        );


    output.width =
        stripWidth * 2 + 60;


    output.height =
        stripHeight + 40;


    const ctx =
        output.getContext(
            "2d"
        );


    /* Background */

    ctx.fillStyle =
        "#d9d9d9";


    ctx.fillRect(
        0,
        0,
        output.width,
        output.height
    );


    /*
     * Tunggu semua foto selesai
     * dimuat sebelum menggambar.
     */

    const images =
        await Promise.all(
            photos.map(
                src =>
                    loadImage(src)
            )
        );


    drawStrip(
        ctx,
        20,
        20,
        images.slice(0, 3)
    );


    drawStrip(
        ctx,
        stripWidth + 40,
        20,
        images.slice(3, 6)
    );


    const link =
        document.createElement(
            "a"
        );


    link.download =
        `EC3C-${currentStudent.nama}.jpg`;


    link.href =
        output.toDataURL(
            "image/jpeg",
            0.95
        );


    link.click();

}



/* =====================================================
   LOAD IMAGE
===================================================== */

function loadImage(src) {

    return new Promise(
        (resolve, reject) => {

            const image =
                new Image();


            image.onload =
                () => resolve(image);


            image.onerror =
                reject;


            image.src =
                src;

        }
    );

}



/* =====================================================
   DRAW PHOTO STRIP
===================================================== */

function drawStrip(
    ctx,
    x,
    y,
    images
) {

    const stripWidth =
        460;


    const stripHeight =
        1380;


    /* Kertas */

    ctx.fillStyle =
        "#ffffff";


    ctx.fillRect(
        x,
        y,
        stripWidth,
        stripHeight
    );


    /* Header */

    ctx.fillStyle =
        "#07151f";


    ctx.fillRect(
        x + 20,
        y + 20,
        stripWidth - 40,
        60
    );


    ctx.fillStyle =
        "#ffffff";


    ctx.textAlign =
        "center";


    ctx.font =
        "bold 24px Arial";


    ctx.fillText(
        "⚡ EC3C ⚡",
        x + stripWidth / 2,
        y + 58
    );


    /* Judul */

    ctx.fillStyle =
        "#111111";


    ctx.font =
        "bold 18px monospace";


    ctx.fillText(
        "EC3C PHOTOBOOTH",
        x + stripWidth / 2,
        y + 115
    );


    /* Foto */

    let photoY =
        y + 135;


    const photoWidth =
        stripWidth - 40;


    const photoHeight =
        365;


    images.forEach(
        image => {

            ctx.drawImage(
                image,
                x + 20,
                photoY,
                photoWidth,
                photoHeight
            );


            photoY +=
                photoHeight + 10;

        }
    );


    /* Footer */

    ctx.fillStyle =
        "#111111";


    ctx.font =
        "bold 17px monospace";


    ctx.fillText(
        "CLASS OF EC3C",
        x + stripWidth / 2,
        y + stripHeight - 35
    );

}



/* =====================================================
   RESTART
===================================================== */

document
    .getElementById(
        "restartButton"
    )
    .addEventListener(
        "click",
        function() {

            stopCamera();

            location.reload();

        }
    );



/* =====================================================
   CLOSE CAMERA SAAT MENINGGALKAN WEBSITE
===================================================== */

window.addEventListener(
    "beforeunload",
    function() {

        stopCamera();

    }
);
