/* ==================================================
   VARIABEL & DAFTAR PERTANYAAN
================================================== */

// Daftar Pertanyaan Baru
const daftarPertanyaan = [
    {
        teks: "Apa fungsi resistor?",
        validasi: (jawaban) => jawaban.includes("hambat"),
        pesanSalah: "Tolol!"
    },
    {
        teks: "Nama lengkap km?",
        validasi: (jawaban) => jawaban.includes("yuan"),
        pesanSalah: "Dongo!"
    },
    {
        teks: "Siapa maskot di kelas EC3C?",
        validasi: (jawaban) => jawaban.includes("cahya") || jawaban.includes("bule"),
        pesanSalah: "Yah masa ga kenal sih!"
    }
];

let indeksPertanyaan = 0;
let namaUser = "";
let fotoTerambil = [];
let mediaStream = null;

/* ==================================================
   ELEM DOM
================================================== */

const registrasiPage = document.getElementById('registrasiPage');
const pertanyaanPage = document.getElementById('pertanyaanPage');
const photoboothPage = document.getElementById('photobooth');
const hasilPage = document.getElementById('hasilPage');

const inputNama = document.getElementById('inputNama');
const errRegistrasi = document.getElementById('errRegistrasi');
const displayNamaUser = document.getElementById('displayNamaUser');

const nomorPertanyaanEl = document.getElementById('nomorPertanyaan');
const judulPertanyaanEl = document.getElementById('judulPertanyaan');
const inputJawaban = document.getElementById('inputJawaban');
const errPertanyaan = document.getElementById('errPertanyaan');

const cameraVideo = document.getElementById('camera');
const canvasEl = document.getElementById('canvas');
const countdownEl = document.getElementById('countdown');
const photoCounterEl = document.getElementById('photoCounter');
const btnStartBooth = document.getElementById('btnStartBooth');

/* ==================================================
   LOGIKA ALUR APLIKASI
================================================== */

// 1. Registrasi
function submitRegistrasi() {
    const val = inputNama.value.trim();
    if (!val) {
        errRegistrasi.textContent = "Nama tidak boleh kosong!";
        return;
    }
    
    namaUser = val;
    errRegistrasi.textContent = "";
    displayNamaUser.textContent = `User: ${namaUser}`;
    
    registrasiPage.classList.remove('active');
    pertanyaanPage.classList.add('active');
    muatPertanyaan();
}

// 2. Tampilkan Pertanyaan
function muatPertanyaan() {
    nomorPertanyaanEl.textContent = `PERTANYAAN ${indeksPertanyaan + 1} / ${daftarPertanyaan.length}`;
    judulPertanyaanEl.textContent = daftarPertanyaan[indeksPertanyaan].teks;
    inputJawaban.value = "";
    errPertanyaan.textContent = "";
}

// 3. Submit & Cek Jawaban
function submitJawaban() {
    const jawabanUser = inputJawaban.value.trim().toLowerCase();
    const itemPertanyaan = daftarPertanyaan[indeksPertanyaan];

    if (!jawabanUser) {
        errPertanyaan.textContent = "Isi jawabanmu dulu!";
        return;
    }

    // Validasi Jawaban
    if (itemPertanyaan.validasi(jawabanUser)) {
        errPertanyaan.textContent = "";
        indeksPertanyaan++;

        if (indeksPertanyaan < daftarPertanyaan.length) {
            muatPertanyaan();
        } else {
            // Lanjut ke Photobooth jika semua benar
            pertanyaanPage.classList.remove('active');
            photoboothPage.classList.add('active');
            bukaKamera();
        }
    } else {
        // Tampilkan Pesan Salah Sesuai Aturan
        errPertanyaan.textContent = itemPertanyaan.pesanSalah;
    }
}

/* ==================================================
   LOGIKA KAMERA & PHOTOBOOTH
================================================== */

async function bukaKamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: false
        });
        cameraVideo.srcObject = mediaStream;
    } catch (err) {
        alert("Gagal mengakses kamera: " + err.message);
    }
}

function mulaiPhotobooth() {
    btnStartBooth.disabled = true;
    fotoTerambil = [];
    photoCounterEl.textContent = "0 / 6 Foto";
    prosesFoto(0);
}

function prosesFoto(index) {
    if (index >= 6) {
        selesaiPhotobooth();
        return;
    }

    let hitungan = 3;
    countdownEl.textContent = hitungan;

    const timer = setInterval(() => {
        hitungan--;
        if (hitungan > 0) {
            countdownEl.textContent = hitungan;
        } else {
            clearInterval(timer);
            countdownEl.textContent = "";
            
            // Ambil Foto
            tangkapGambar();
            photoCounterEl.textContent = `${index + 1} / 6 Foto`;
            
            setTimeout(() => {
                prosesFoto(index + 1);
            }, 1000);
        }
    }, 1000);
}

function tangkapGambar() {
    const ctx = canvasEl.getContext('2d');
    canvasEl.width = cameraVideo.videoWidth;
    canvasEl.height = cameraVideo.videoHeight;

    // Flip horizontal agar tidak cermin saat disimpan
    ctx.translate(canvasEl.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(cameraVideo, 0, 0, canvasEl.width, canvasEl.height);

    const dataUrl = canvasEl.toDataURL('image/png');
    fotoTerambil.push(dataUrl);
}

function selesaiPhotobooth() {
    // Matikan Kamera
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }

    photoboothPage.classList.remove('active');
    tampilkanHasil();
}

/* ==================================================
   LOGIKA HASIL (2 POLAROID STRIP)
================================================== */

function tampilkanHasil() {
    hasilPage.classList.add('active');
    document.getElementById('hasilNamaUser').textContent = `Subjek: ${namaUser}`;

    // Polaroid 1 (Foto 1, 2, 3)
    const boxP1 = document.getElementById('fotoContainer1');
    boxP1.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        if (fotoTerambil[i]) {
            boxP1.innerHTML += `<div class="photo-box"><img src="${fotoTerambil[i]}"></div>`;
        }
    }

    // Polaroid 2 (Foto 4, 5, 6)
    const boxP2 = document.getElementById('fotoContainer2');
    boxP2.innerHTML = "";
    for (let i = 3; i < 6; i++) {
        if (fotoTerambil[i]) {
            boxP2.innerHTML += `<div class="photo-box"><img src="${fotoTerambil[i]}"></div>`;
        }
    }

    // Set Tanggal
    const skrg = new Date();
    const tglStr = skrg.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('tglPolaroid1').textContent = tglStr;
    document.getElementById('tglPolaroid2').textContent = tglStr;
}

function ulangSemua() {
    indeksPertanyaan = 0;
    namaUser = "";
    fotoTerambil = [];
    btnStartBooth.disabled = false;
    
    hasilPage.classList.remove('active');
    registrasiPage.classList.add('active');
    inputNama.value = "";
}
