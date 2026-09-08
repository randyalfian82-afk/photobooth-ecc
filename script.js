/* =====================================================
   EC3C PHOTOBOOTH
   JAVASCRIPT
===================================================== */


/* =========================
   DATA
========================= */

let currentStep = 0;
let userName = "";
let photos = [];
let stream = null;
let isTakingPhotos = false;


const quizData = [

    {
        pertanyaan:
            "Apa fungsi utama dari Resistor?",

        jawaban: [
            "hambat",
            "menghambat",
            "hambatan",
            "membatasi arus",
            "menahan arus"
        ],

        gambar: ""
    },

    {
        pertanyaan:
            "Sebutkan nama komponen elektronika pada gambar ini!",

        jawaban: [
            "kapasitor",
            "capacitor"
        ],

        gambar: "cahya.jpg"
    },

    {
        pertanyaan:
            "Komponen apa yang berfungsi sebagai saklar elektronik / penguat sinyal?",

        jawaban: [
            "transistor"
        ],

        gambar: "yuan.jpg"
    }

];


/* =========================
   ELEMENT
========================= */

const verifikasiPage =
    document.getElementById("verifikasiPage");

const quizPage =
    document.getElementById("quizPage");

const photoboothPage =
    document.getElementById("photoboothPage");

const hasilPage =
    document.getElementById("hasilPage");


const verifikasiForm =
    document.getElementById("verifikasiForm");

const quizForm =
    document.getElementById("quizForm");


const namaInput =
    document.getElementById("namaUser");

const jawabanInput =
    document.getElementById("jawabanQuiz");


const displayNamaQuiz =
    document.getElementById("displayNamaQuiz");

const displayNamaHasil =
    document.getElementById("displayNamaHasil");


const nomorSoal =
    document.getElementById("nomorSoal");

const judulPertanyaan =
    document.getElementById("judulPertanyaan");


const gambarSoalBox =
    document.getElementById("gambarSoalBox");

const gambarSoal =
    document.getElementById("gambarSoal");


const errorNama =
    document.getElementById("errorNama");

const errorQuiz =
    document.getElementById("errorQuiz");


const video =
    document.getElementById("camera");

const canvas =
    document.getElementById("canvas");

const snapBtn =
    document.getElementById("snapBtn");

const countdownEl =
    document.getElementById("countdown");

const photoCounter =
    document.getElementById("photoCounter");

const cameraError =
    document.getElementById("cameraError");


/* =========================
   PINDAH HALAMAN
========================= */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(p => {

            p.classList.remove("active");

        });

    page.classList.add("active");
}


/* =========================
   VERIFIKASI NAMA
========================= */

verifikasiForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        const input =
            namaInput.value.trim();


        if (input === "") {

            errorNama.textContent =
                "Silakan masukkan nama terlebih dahulu!";

            return;
        }


        userName = input;


        displayNamaQuiz.textContent =
            userName;

        displayNamaHasil.textContent =
            "User: " + userName;


        currentStep = 0;

        showPage(quizPage);

        loadQuiz();

    }
);


/* =========================
   LOAD QUIZ
========================= */

function loadQuiz() {

    errorQuiz.textContent = "";

    jawabanInput.value = "";

    jawabanInput.focus();


    const data =
        quizData[currentStep];


    nomorSoal.textContent =
        `PERTANYAAN ${currentStep + 1} / ${quizData.length}`;


    judulPertanyaan.textContent =
        data.pertanyaan;


    if (data.gambar) {

        gambarSoal.src =
            data.gambar;

        gambarSoalBox.style.display =
            "block";

    } else {

        gambarSoal.src = "";

        gambarSoalBox.style.display =
            "none";

    }

}


/* =========================
   QUIZ
========================= */

quizForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();


        const userAns =
            jawabanInput.value
                .trim()
                .toLowerCase();


        const validAns =
            quizData[currentStep].jawaban;


        const isCorrect =
            validAns.some(
                ans =>
                    userAns.includes(
                        ans.toLowerCase()
                    )
            );


        if (isCorrect) {

            errorQuiz.textContent =
                "✓ Jawaban benar!";


            currentStep++;


            setTimeout(
                function () {

                    if (
                        currentStep <
                        quizData.length
                    ) {

                        loadQuiz();

                    } else {

                        showPage(
                            photoboothPage
                        );

                        startCamera();

                    }

                },
                500
            );


        } else {

            errorQuiz.textContent =
                "Jawaban kurang tepat. Coba lagi!";

        }

    }
);


/* =========================
   CAMERA
========================= */

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

        stream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "user"
                    },

                    audio: false

                });


        video.srcObject =
            stream;


        await video.play();


    } catch (error) {

        console.error(error);


        cameraError.textContent =
            "Kamera tidak dapat diakses. Izinkan kamera atau jalankan melalui localhost/HTTPS.";

    }

}


/* =========================
   STOP CAMERA
========================= */

function stopCamera() {

    if (stream) {

        stream
            .getTracks()
            .forEach(
                track =>
                    track.stop()
            );

        stream = null;

    }

}


/* =========================
   TOMBOL FOTO
========================= */

snapBtn.addEventListener(
    "click",
    function () {

        if (isTakingPhotos) {
            return;
        }


        if (!stream) {

            cameraError.textContent =
                "Kamera belum aktif.";

            return;
        }


        photos = [];

        photoCounter.textContent =
            "0 / 6 Foto";


        isTakingPhotos = true;

        snapBtn.disabled = true;

        takePhotoSeries(0);

    }
);


/* =========================
   AMBIL 6 FOTO
========================= */

function takePhotoSeries(index) {


    if (index >= 6) {

        stopCamera();

        renderResults();

        showPage(hasilPage);

        isTakingPhotos = false;

        return;

    }


    let count = 3;


    countdownEl.textContent =
        count;


    const timer =
        setInterval(
            function () {

                count--;


                if (count > 0) {

                    countdownEl.textContent =
                        count;

                } else {

                    clearInterval(timer);

                    countdownEl.textContent =
                        "";


                    capturePhoto();


                    setTimeout(
                        function () {

                            takePhotoSeries(
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


/* =========================
   CAPTURE FOTO
========================= */

function capturePhoto() {

    const width =
        video.videoWidth || 640;

    const height =
        video.videoHeight || 480;


    canvas.width =
        width;

    canvas.height =
        height;


    const ctx =
        canvas.getContext("2d");


    /* Mirror gambar */

    ctx.save();

    ctx.translate(
        width,
        0
    );

    ctx.scale(
        -1,
        1
    );


    ctx.drawImage(
        video,
        0,
        0,
        width,
        height
    );


    ctx.restore();


    const dataUrl =
        canvas.toDataURL(
            "image/jpeg",
            0.90
        );


    photos.push(
        dataUrl
    );


    photoCounter.textContent =
        `${photos.length} / 6 Foto`;

}


/* =========================
   RENDER HASIL
========================= */

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
        "date1"
    ).textContent = today;


    document.getElementById(
        "date2"
    ).textContent = today;


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const img =
            document.getElementById(
                `res${i}`
            );


        if (
            img &&
            photos[i]
        ) {

            img.src =
                photos[i];

        }

    }

}


/* =========================
   DOWNLOAD HASIL
========================= */

document
    .getElementById("downloadBtn")
    .addEventListener(
        "click",
        downloadPhotoStrips
    );


async function downloadPhotoStrips() {

    if (photos.length !== 6) {

        alert(
            "Foto belum lengkap."
        );

        return;
    }


    const stripWidth = 440;

    const photoWidth = 400;

    const photoHeight = 300;

    const padding = 20;

    const headerHeight = 55;

    const titleHeight = 45;

    const footerHeight = 55;

    const gap = 10;


    const stripHeight =
        padding * 2 +
        headerHeight +
        titleHeight +
        photoHeight * 3 +
        gap * 2 +
        footerHeight;


    const canvasDownload =
        document.createElement(
            "canvas"
        );


    canvasDownload.width =
        stripWidth * 2 + 40;

    canvasDownload.height =
        stripHeight;


    const ctx =
        canvasDownload.getContext(
            "2d"
        );


    /* Background */

    ctx.fillStyle =
        "#eeeeee";

    ctx.fillRect(
        0,
        0,
        canvasDownload.width,
        canvasDownload.height
    );


    drawStrip(
        ctx,
        10,
        0,
        0
    );


    drawStrip(
        ctx,
        stripWidth + 20,
        0,
        3
    );


    const link =
        document.createElement(
            "a"
        );


    link.download =
        `EC3C-Photobooth-${userName}.jpg`;


    link.href =
        canvasDownload.toDataURL(
            "image/jpeg",
            0.95
        );


    link.click();


    function drawStrip(
        ctx,
        x,
        y,
        startIndex
    ) {

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
            x + padding,
            y + padding,
            stripWidth - padding * 2,
            headerHeight
        );


        ctx.fillStyle =
            "#ffffff";

        ctx.font =
            "bold 20px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "⚡ EC3C ⚡",
            x + stripWidth / 2,
            y + padding + 35
        );


        /* Title */

        ctx.fillStyle =
            "#111111";

        ctx.font =
            "bold 16px monospace";

        ctx.fillText(
            "EC3C PHOTOBOOTH",
            x + stripWidth / 2,
            y + padding + headerHeight + 30
        );


        /* Photos */

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const img =
                new Image();

            img.src =
                photos[startIndex + i];


            const photoY =
                y +
                padding +
                headerHeight +
                titleHeight +
                i *
                (photoHeight + gap);


            ctx.drawImage(
                img,
                x + padding,
                photoY,
                photoWidth,
                photoHeight
            );

        }


        /* Footer */

        ctx.fillStyle =
            "#111111";

        ctx.font =
            "bold 14px monospace";

        ctx.fillText(
            "CLASS OF EC3C",
            x + stripWidth / 2,
            y +
            stripHeight -
            25
        );

    }

}


/* =========================
   RESTART
========================= */

document
    .getElementById("restartBtn")
    .addEventListener(
        "click",
        function () {

            stopCamera();

            location.reload();

        }
    );


/* =========================
   SAAT TAB DITUTUP
========================= */

window.addEventListener(
    "beforeunload",
    function () {

        stopCamera();

    }
);
