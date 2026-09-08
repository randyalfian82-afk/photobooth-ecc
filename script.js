/* ==================================================
   ELEMENT
================================================== */

let video = document.getElementById("camera");

let canvas = document.getElementById("canvas");

let fotoArray = [];

let namaUser = "";

let nimUser = "";

let pertanyaanSekarang = 0;


/* ==================================================
   DATA PERTANYAAN
================================================== */

const pertanyaan = [

    {
        soal: "Apa warna favorit saya?",
        tipe: "input",
        jawaban: "hitam"
    },

    {
        soal: "Berapa ukuran baju saya?",
        tipe: "input",
        jawaban: "l"
    },

    {
        soal: "Berapa ukuran sepatu saya?",
        tipe: "input",
        jawaban: "42"
    },

    {
        soal: "Kapan tanggal lahir saya?",
        tipe: "input",
        jawaban: "23 november 2006"
    },

    {
        soal: "Apa genre musik favorit saya?",
        tipe: "input",
        jawaban: "rock"
    },

    {
        soal: "Sebutkan 3 band yang sudah kita tonton!",
        tipe: "bands"
    },

    {
        soal: "Ceritakan moment paling bahagia kamu sama saya ❤️",
        tipe: "textarea"
    }

];


/* ==================================================
   NORMALISASI TEKS
================================================== */

function normalisasi(text) {

    return text
        .toLowerCase()
        .trim()
        .replaceAll(",", " ")
        .replaceAll("+", " ")
        .replace(/\s+/g, " ");

}


/* ==================================================
   HALAMAN NAMA
================================================== */

function lanjutNama() {

    namaUser = document
        .getElementById("nama")
        .value
        .trim();

    let pesan =
        document.getElementById("pesanNama");


    if (namaUser === "") {

        pesan.innerText =
            "Masukkan nama kamu dulu ya ⚡";

        return;
    }


    pesan.innerText = "";


    document
        .getElementById("opening")
        .classList
        .remove("active");


    document
        .getElementById("nimPage")
        .classList
        .add("active");


    document
        .getElementById("namaTampil")
        .innerText =
        namaUser;

}


/* ==================================================
   HALAMAN NIM
================================================== */

function lanjutNIM() {

    nimUser = document
        .getElementById("nim")
        .value
        .trim();


    /*
       NIM TIDAK DI CEK.

       Jadi walaupun salah,
       tetap bisa masuk ke halaman pertanyaan.
    */

    if (nimUser === "") {

        /*
           Kalau ingin NIM juga boleh kosong,
           bagian ini bisa dihapus.
        */

        nimUser = "NIM tidak diisi";

    }


    document
        .getElementById("nimPage")
        .classList
        .remove("active");


    document
        .getElementById("questions")
        .classList
        .add("active");


    document
        .getElementById("userNama")
        .innerText =
        namaUser;


    document
        .getElementById("userNIM")
        .innerText =
        nimUser;


    tampilkanPertanyaan();

}


/* ==================================================
   TAMPILKAN PERTANYAAN
================================================== */

function tampilkanPertanyaan() {

    let data =
        pertanyaan[
            pertanyaanSekarang
        ];


    document
        .getElementById("nomorPertanyaan")
        .innerText =
        "Pertanyaan " +
        (pertanyaanSekarang + 1) +
        " dari " +
        pertanyaan.length;


    document
        .getElementById("judulPertanyaan")
        .innerText =
        data.soal;


    let area =
        document.getElementById("areaJawaban");


    if (data.tipe === "textarea") {

        area.innerHTML = `

            <textarea
                id="jawaban"
                placeholder="Ceritakan momentnya..."
            ></textarea>

        `;

    } else {

        area.innerHTML = `

            <input
                type="text"
                id="jawaban"
                placeholder="Tulis jawaban kamu..."
            >

        `;

    }


    document
        .getElementById("pesanJawaban")
        .innerText = "";

}


/* ==================================================
   CEK 3 BAND
================================================== */

function cekBand(input) {

    let teks =
        normalisasi(input);


    let band1 =
        teks.includes("lomba sihir");


    let band2 =
        teks.includes("reality club");


    let band3 =
        teks.includes("black horses");


    return (
        band1 &&
        band2 &&
        band3
    );

}


/* ==================================================
   CEK JAWABAN
================================================== */

function cekJawaban() {

    let input =
        document
            .getElementById("jawaban")
            .value
            .trim();


    let data =
        pertanyaan[
            pertanyaanSekarang
        ];


    /* ==================================================
       MOMENT BAHAGIA
    ================================================== */

    if (data.tipe === "textarea") {

        if (input === "") {

            document
                .getElementById("pesanJawaban")
                .innerText =
                "Ceritain dulu momentnya dong 🥺";

            return;
        }


        localStorage.setItem(
            "momentBahagia",
            input
        );


        masukPhotobooth();

        return;

    }


    /* ==================================================
       3 BAND
    ================================================== */

    if (data.tipe === "bands") {

        if (cekBand(input)) {

            pertanyaanSekarang++;


            if (
                pertanyaanSekarang <
                pertanyaan.length
            ) {

                tampilkanPertanyaan();

            }

        } else {

            document
                .getElementById("pesanJawaban")
                .innerText =
                "Hmm masih kurang tepat 😭 Coba ingat lagi 3 band yang pernah kita tonton.";

        }

        return;

    }


    /* ==================================================
       JAWABAN NORMAL
    ================================================== */

    let jawabanUser =
        normalisasi(input);


    let jawabanBenar =
        normalisasi(
            data.jawaban
        );


    if (
        jawabanUser ===
        jawabanBenar
    ) {

        pertanyaanSekarang++;


        if (
            pertanyaanSekarang <
            pertanyaan.length
        ) {

            tampilkanPertanyaan();

        }

    } else {

        document
            .getElementById("pesanJawaban")
            .innerText =
            "Salah 😭 Coba ingat-ingat lagi...";

    }

}


/* ==================================================
   MASUK PHOTOBOOTH
================================================== */

function masukPhotobooth() {

    document
        .getElementById("questions")
        .classList
        .remove("active");


    document
        .getElementById("photobooth")
        .classList
        .add("active");


    document
        .getElementById("info")
        .innerText =
        "3 foto untuk satu kenangan ♡";


    bukaKamera();

}


/* ==================================================
   BUKA KAMERA
================================================== */

async function bukaKamera() {

    try {

        const stream =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "user"
                    },

                    audio: false

                });


        video.srcObject =
            stream;


    } catch (error) {

        alert(
            "Kamera tidak bisa dibuka. Izinkan akses kamera terlebih dahulu."
        );

        console.error(error);

    }

}


/* ==================================================
   AMBIL FOTO
================================================== */

function ambilFoto() {

    let tombol =
        document
            .getElementById("fotoBtn");


    tombol.disabled =
        true;


    let angka = 3;


    let countdown =
        document
            .getElementById("countdown");


    countdown.innerText =
        angka;


    let timer =
        setInterval(function () {

            angka--;


            if (angka > 0) {

                countdown.innerText =
                    angka;

            } else {

                clearInterval(timer);

                countdown.innerText =
                    "";

                foto();

            }

        }, 1000);

}


/* ==================================================
   AMBIL GAMBAR DARI VIDEO
================================================== */

function foto() {

    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    let context =
        canvas.getContext("2d");


    /*
       Mirror agar hasil foto
       seperti kamera depan.
    */

    context.translate(
        canvas.width,
        0
    );


    context.scale(
        -1,
        1
    );


    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );


    let fotoData =
        canvas.toDataURL(
            "image/jpeg",
            0.95
        );


    fotoArray.push(
        fotoData
    );


    if (
        fotoArray.length < 3
    ) {

        document
            .getElementById("fotoKe")
            .innerText =
            "Foto " +
            (fotoArray.length + 1) +
            " dari 3";


        document
            .getElementById("fotoBtn")
            .disabled =
            false;

    } else {

        document
            .getElementById("fotoBtn")
            .style
            .display =
            "none";


        document
            .getElementById("fotoKe")
            .innerText =
            "Selesai ♡";


        setTimeout(
            tampilkanHasil,
            500
        );

    }

}


/* ==================================================
   HASIL
================================================== */

function tampilkanHasil() {

    /* MATIKAN KAMERA */

    if (video.srcObject) {

        let tracks =
            video
                .srcObject
                .getTracks();


        tracks.forEach(
            track =>
                track.stop()
        );

    }


    /* TAMPILKAN DATA USER */

    document
        .getElementById("hasilNama")
        .innerText =
        namaUser;


    document
        .getElementById("hasilNIM")
        .innerText =
        nimUser;


    /* PINDAH HALAMAN */

    document
        .getElementById("photobooth")
        .classList
        .remove("active");


    document
        .getElementById("hasilPage")
        .classList
        .add("active");


    let hasil =
        document.getElementById("hasil");


    hasil.innerHTML = `

        <div class="photostrip">

            <div class="photostrip-header">

                <div class="cat-decoration">
                    ⚡
                </div>

            </div>

            <div class="photostrip-title">
                ELECTRONIC MOMENTS ♡
            </div>

            <div class="photo-box">
                <img src="${fotoArray[0]}">
            </div>

            <div class="photo-box">
                <img src="${fotoArray[1]}">
            </div>

            <div class="photo-box">
                <img src="${fotoArray[2]}">
            </div>

            <div class="photostrip-footer">

                TOGETHER ♡

                <div class="photostrip-date">
                    ${namaUser} • ${nimUser}
                </div>

            </div>

        </div>



        <div class="photostrip">

            <div class="photostrip-header">

                <div class="cat-decoration">
                    🔌
                </div>

            </div>

            <div class="photostrip-title">
                CIRCUIT MEMORIES ♡
            </div>

            <div class="photo-box">
                <img src="${fotoArray[0]}">
            </div>

            <div class="photo-box">
                <img src="${fotoArray[1]}">
            </div>

            <div class="photo-box">
                <img src="${fotoArray[2]}">
            </div>

            <div class="photostrip-footer">

                FOREVER ♡

                <div class="photostrip-date">
                    ELECTRONICS • 2026
                </div>

            </div>

        </div>

    `;

}


/* ==================================================
   SAVE PHOTO
================================================== */

async function simpanFoto() {

    let tombol =
        document
            .querySelector(
                ".save-button"
            );


    tombol.innerText =
        "⏳ MEMPROSES...";


    tombol.disabled =
        true;


    let saveCanvas =
        document.createElement(
            "canvas"
        );


    let ctx =
        saveCanvas.getContext(
            "2d"
        );


    let width = 700;

    let height = 1200;


    saveCanvas.width =
        width;

    saveCanvas.height =
        height;


    /* BACKGROUND */

    ctx.fillStyle =
        "#101c2c";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* JUDUL */

    ctx.fillStyle =
        "#69f0ff";

    ctx.textAlign =
        "center";

    ctx.font =
        "bold 30px Arial";


    ctx.fillText(
        "ELECTRONIC MOMENT ⚡",
        width / 2,
        45
    );


    ctx.font =
        "15px Arial";

    ctx.fillStyle =
        "#ffffff";

    ctx.fillText(
        namaUser + " • " + nimUser,
        width / 2,
        70
    );


    /* POSISI POLAROID */

    let stripWidth =
        285;

    let stripHeight =
        1050;

    let gap =
        25;


    let startX =
        (
            width -
            (
                stripWidth * 2 +
                gap
            )
        ) / 2;


    let startY =
        90;


    /* LOAD FOTO */

    let images = [];


    for (
        let i = 0;
        i < fotoArray.length;
        i++
    ) {

        let img =
            new Image();


        img.src =
            fotoArray[i];


        await new Promise(
            function(resolve) {

                img.onload =
                    resolve;

            }
        );


        images.push(
            img
        );

    }


    /* ==================================================
       FUNGSI POLAROID
    ================================================== */

    function buatPolaroid(
        x,
        y,
        judul,
        footer
    ) {

        ctx.fillStyle =
            "#d8faff";


        ctx.fillRect(
            x,
            y,
            stripWidth,
            stripHeight
        );


        /* HEADER */

        ctx.fillStyle =
            "#101c2c";

        ctx.fillRect(
            x,
            y,
            stripWidth,
            80
        );


        ctx.fillStyle =
            "#69f0ff";

        ctx.font =
            "35px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "⚡",
            x + stripWidth / 2,
            y + 42
        );


        ctx.font =
            "bold 15px Arial";

        ctx.fillText(
            judul,
            x + stripWidth / 2,
            y + 68
        );


        /* FOTO */

        let photoY =
            y + 92;


        let photoWidth =
            stripWidth - 20;

        let photoHeight =
            285;


        for (
            let i = 0;
            i < 3;
            i++
        ) {

            ctx.fillStyle =
                "#ffffff";


            ctx.fillRect(
                x + 10,
                photoY,
                photoWidth,
                photoHeight
            );


            ctx.drawImage(
                images[i],
                x + 14,
                photoY + 4,
                photoWidth - 8,
                photoHeight - 8
            );


            photoY +=
                photoHeight + 8;

        }


        /* FOOTER */

        ctx.fillStyle =
            "#18344a";

        ctx.font =
            "bold 15px Arial";


        ctx.fillText(
            footer,
            x + stripWidth / 2,
            y + stripHeight - 35
        );


        ctx.font =
            "10px Arial";


        ctx.fillText(
            namaUser +
            " • " +
            nimUser,
            x + stripWidth / 2,
            y + stripHeight - 15
        );

    }


    /* KIRI */

    buatPolaroid(
        startX,
        startY,
        "ELECTRONIC MOMENTS",
        "TOGETHER ♡"
    );


    /* KANAN */

    buatPolaroid(
        startX +
        stripWidth +
        gap,
        startY,
        "CIRCUIT MEMORIES",
        "FOREVER ♡"
    );


    /* DOWNLOAD */

    let link =
        document.createElement(
            "a"
        );


    link.download =
        "electronic-moment-" +
        namaUser +
        ".png";


    link.href =
        saveCanvas.toDataURL(
            "image/png"
        );


    link.click();


    tombol.innerText =
        "💾 SAVE PHOTO";


    tombol.disabled =
        false;

}
