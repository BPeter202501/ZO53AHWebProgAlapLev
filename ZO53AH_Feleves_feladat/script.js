document.addEventListener("DOMContentLoaded", function() {
    initIndexVideo();
    initGalleryLightbox();
    initContactFormAndReviews();
    initPortfolioAnimation();
});

/* ===== 1. INDEX: videó vezérlőgombok ===== */

function initIndexVideo() {
    const video = document.getElementById("bemutatoVideo");
    if (!video) return;

    const playBtn = document.getElementById("playBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const muteBtn = document.getElementById("muteBtn");

    if (!playBtn || !pauseBtn || !muteBtn) return;

    playBtn.addEventListener("click", function() {
        video.play();
    });

    pauseBtn.addEventListener("click", function() {
        video.pause();
    });

    muteBtn.addEventListener("click", function() {
        video.muted = !video.muted;
    });
}

/* ===== 2. PORTRE / ESKÜVŐ: galéria + lightbox + lapozás ===== */

function initGalleryLightbox() {
    const galleryImages = Array.from(document.querySelectorAll(".gallery img"));
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");

    if (
        galleryImages.length === 0 ||
        !lightbox ||
        !lightboxImg ||
        !closeBtn ||
        !prevBtn ||
        !nextBtn
    ) {
        return;
    }

    let currentIndex = 0;

    function showImage(index) {
        const img = galleryImages[index];
        if (!img) return;
        lightboxImg.src = img.getAttribute("src");
        lightboxImg.alt = img.getAttribute("alt") || "Nagyított kép";
        lightbox.style.display = "flex";
    }

    function hideLightbox() {
        lightbox.style.display = "none";
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener("click", function() {
            currentIndex = index;
            showImage(currentIndex);
        });
    });

    closeBtn.addEventListener("click", function() {
        hideLightbox();
    });

    lightbox.addEventListener("click", function(e) {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });

    nextBtn.addEventListener("click", function() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        showImage(currentIndex);
    });

    prevBtn.addEventListener("click", function() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(currentIndex);
    });

    document.addEventListener("keydown", function(e) {
        if (lightbox.style.display === "flex") {
            if (e.key === "Escape") {
                hideLightbox();
            } else if (e.key === "ArrowRight") {
                currentIndex = (currentIndex + 1) % galleryImages.length;
                showImage(currentIndex);
            } else if (e.key === "ArrowLeft") {
                currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
                showImage(currentIndex);
            }
        }
    });
}

/* ===== 3. KAPCSOLAT: űrlap validáció + JSON vélemények ===== */

function initContactFormAndReviews() {
    const form = document.getElementById("kapcsolatForm");
    if (!form) return;

    const nevInput = document.getElementById("nev");
    const emailInput = document.getElementById("email");
    const telefonInput = document.getElementById("telefon");
    const tipusSelect = document.getElementById("tipus");
    const uzenetInput = document.getElementById("uzenet");
    const adatkezelesInput = document.getElementById("adatkezeles");

    const nevHiba = document.getElementById("nevHiba");
    const emailHiba = document.getElementById("emailHiba");
    const telefonHiba = document.getElementById("telefonHiba");
    const tipusHiba = document.getElementById("tipusHiba");
    const uzenetHiba = document.getElementById("uzenetHiba");
    const adatkezelesHiba = document.getElementById("adatkezelesHiba");
    const visszajelzesDoboz = document.getElementById("visszajelzes");

    const velemenyLista = document.getElementById("velemenyek");
    const velemenyHiba = document.getElementById("velemenyHiba");

    function torolHibakat() {
        [nevInput, emailInput, telefonInput, tipusSelect, uzenetInput].forEach(elem => {
            elem.classList.remove("hiba");
        });

        [nevHiba, emailHiba, telefonHiba, tipusHiba, uzenetHiba, adatkezelesHiba].forEach(elem => {
            if (elem) elem.textContent = "";
        });

        if (visszajelzesDoboz) {
            visszajelzesDoboz.style.display = "none";
        }
    }

    function emailErvenyes(email) {
        const minta = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return minta.test(email);
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        torolHibakat();

        let jo = true;

        // Név
        if (nevInput.value.trim().length < 3) {
            nevInput.classList.add("hiba");
            nevHiba.textContent = "Kérlek add meg a neved (legalább 3 karakter).";
            jo = false;
        }

        // Email
        if (!emailInput.value.trim()) {
            emailInput.classList.add("hiba");
            emailHiba.textContent = "Kérlek add meg az e-mail címed.";
            jo = false;
        } else if (!emailErvenyes(emailInput.value.trim())) {
            emailInput.classList.add("hiba");
            emailHiba.textContent = "Az e-mail cím formátuma nem megfelelő.";
            jo = false;
        }

        // Telefon
        if (telefonInput.value.trim().length < 7) {
            telefonInput.classList.add("hiba");
            telefonHiba.textContent = "Kérlek adj meg egy érvényes telefonszámot.";
            jo = false;
        }

        // Típus
        if (!tipusSelect.value) {
            tipusSelect.classList.add("hiba");
            tipusHiba.textContent = "Kérlek válaszd ki a fotózás típusát.";
            jo = false;
        }

        // Üzenet
        if (uzenetInput.value.trim().length < 10) {
            uzenetInput.classList.add("hiba");
            uzenetHiba.textContent = "Kérlek írj legalább néhány mondatot (min. 10 karakter).";
            jo = false;
        }

        // Adatkezelés
        if (!adatkezelesInput.checked) {
            adatkezelesHiba.textContent = "Az adatkezelési feltételek elfogadása kötelező.";
            jo = false;
        }

        if (jo) {
            if (visszajelzesDoboz) {
                visszajelzesDoboz.style.display = "block";
            }
            form.reset();
        }
    });

    // Vélemények betöltése JSON-ból
    if (velemenyLista) {
        fetch("velemenyek.json")
            .then(valasz => {
                if (!valasz.ok) {
                    throw new Error("Hálózati hiba: " + valasz.status);
                }
                return valasz.json();
            })
            .then(adatok => {
                if (!Array.isArray(adatok) || adatok.length === 0) {
                    if (velemenyHiba) {
                        velemenyHiba.textContent = "Jelenleg nincsenek elérhető vélemények.";
                    }
                    return;
                }

                if (velemenyHiba) velemenyHiba.textContent = "";
                velemenyLista.innerHTML = "";

                adatok.forEach(v => {
                    const kartya = document.createElement("div");
                    kartya.className = "velemeny-kartya";

                    kartya.innerHTML = `
                        <h4>${v.nev}</h4>
                        <span class="velemeny-datum">${v.datum}</span>
                        <p>${v.szoveg}</p>
                    `;

                    velemenyLista.appendChild(kartya);
                });
            })
            .catch(hiba => {
                console.error(hiba);
                if (velemenyHiba) {
                    velemenyHiba.textContent = "Nem sikerült betölteni a véleményeket.";
                }
            });
    }
}

function initPortfolioAnimation() {
    if (!document.querySelector(".kategoriak")) return;

    $(".kat-kartya").css("opacity", 0);
    $(".kat-kartya").each(function(index) {
        $(this).delay(400 * index).animate({ opacity: 1 }, 1500); 
    });
}