document.addEventListener("DOMContentLoaded", () => {

    // --- PARALLAX HERO ---
    const hero = document.querySelector("#hero");
    const head = document.querySelector(".hero-image-container");
    const title = document.querySelector(".main-title");
    const nav = document.querySelector("nav");
    const quote = document.querySelector(".hero-quote");

    window.addEventListener("scroll", () => {
        const scroll = window.scrollY;

        // Toggle Nav Bar style
        if (scroll > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }

        if (scroll < window.innerHeight) {
            // Head moves slower (parallax)
            head.style.transform = `translate(-50%, calc(-50% + ${scroll * 0.3}px))`;

            // Title moves up
            title.style.transform = `translateY(${scroll * -0.1}px)`;

            // Quote content
            quote.style.transform = `translateY(${scroll * 0.4}px)`;
            quote.style.opacity = 1 - (scroll / (window.innerHeight * 0.6));
        }
    });

    // --- MOBILE MENU ---
    const menuToggle = document.querySelector("#mobile-menu");
    const menu = document.querySelector(".menu");
    const menuLinks = document.querySelectorAll(".menu li a");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            menu.classList.toggle("active");
            document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "auto";
        });

        // Close menu when clicking a link
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                menu.classList.remove("active");
                document.body.style.overflow = "auto";
            });
        });
    }

    // --- COUNTERS ---
    const statsSection = document.querySelector("#stats");
    const counters = document.querySelectorAll(".count");
    let started = false;

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute("data-target");
            const updateCounter = () => {
                const current = +counter.innerText.replace("+", "");
                const increment = target / 50; // Speed adjustment

                if (current < target) {
                    counter.innerText = `+${Math.ceil(current + increment)}`;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = `+${target}`;
                }
            };
            updateCounter();
        });
    };

    const observerOptions = {
        threshold: 0.5
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                startCounters();
                started = true;
            }
        });
    }, observerOptions);

    if (statsSection) statsObserver.observe(statsSection);


    // --- SLIDE ENTRANCE ANIMATIONS ---
    const slides = document.querySelectorAll(".portfolio-slide");

    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.3 });

    slides.forEach(slide => slideObserver.observe(slide));

    // --- QUOTE SCROLL EFFECT ---
    const quoteSection = document.querySelector("#quote");
    const quoteP = document.querySelector(".quote-text");

    if (quoteP) {
        // Wrap each character in a span
        const text = quoteP.innerHTML;
        quoteP.innerHTML = "";

        // We need to keep the <br> tags
        const parts = text.split(/(<br>)/);
        parts.forEach(part => {
            if (part === "<br>") {
                quoteP.innerHTML += "<br>";
            } else {
                [...part].forEach(char => {
                    const span = document.createElement("span");
                    span.textContent = char;
                    quoteP.appendChild(span);
                });
            }
        });

        const chars = quoteP.querySelectorAll("span");

        window.addEventListener("scroll", () => {
            const rect = quoteSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const scrollPos = window.innerHeight - rect.top;

            // --- ANIMATION PARAMETERS ---
            // 'start': How much of the section must be visible before the effect begins.
            // Increase this value (e.g. window.innerHeight * 0.5) to wait longer before starting.
            const start = window.innerHeight * 0.45; // Starts when the section is almost centered

            // 'end': When the last letter should turn white.
            // Increase this to slow down the overall coloring speed.
            const end = sectionHeight + window.innerHeight * 0.2;

            // Calculation of progress (0 to 1)
            let progress = (scrollPos - start) / (end - start);
            progress = Math.max(0, Math.min(1, progress));

            // Determine how many characters should be lit up
            const activeIndex = Math.floor(progress * chars.length);

            chars.forEach((char, index) => {
                if (index <= activeIndex) {
                    char.classList.add("active");
                } else {
                    char.classList.remove("active");
                }
            });
        });
    }
});

// --- LIGHTBOX LOGIC ---
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const galleryItems = document.querySelectorAll(".gallery-item img");
let activeThumb = null;

if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach(img => {
        img.parentElement.addEventListener("click", () => {
            activeThumb = img;
            const rect = img.getBoundingClientRect();

            // 1. Position image exactly over the thumb (Initial stage)
            lightboxImg.src = img.src;
            lightboxImg.style.transition = "none";
            lightboxImg.style.top = `${rect.top}px`;
            lightboxImg.style.left = `${rect.left}px`;
            lightboxImg.style.width = `${rect.width}px`;
            lightboxImg.style.height = `${rect.height}px`;

            // 2. Show background overlay
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";

            // 3. Animate to final centered large state
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    lightboxImg.style.transition = "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";

                    // Final position calculation (centered 90% view)
                    const margin = 0.9;
                    const maxWidth = window.innerWidth * margin;
                    const maxHeight = window.innerHeight * margin;
                    const imgRatio = img.naturalWidth / img.naturalHeight;
                    const screenRatio = window.innerWidth / window.innerHeight;

                    let finalW, finalH;
                    if (imgRatio > screenRatio) {
                        finalW = maxWidth;
                        finalH = maxWidth / imgRatio;
                    } else {
                        finalH = maxHeight;
                        finalW = maxHeight * imgRatio;
                    }

                    lightboxImg.style.top = `${(window.innerHeight - finalH) / 2}px`;
                    lightboxImg.style.left = `${(window.innerWidth - finalW) / 2}px`;
                    lightboxImg.style.width = `${finalW}px`;
                    lightboxImg.style.height = `${finalH}px`;
                });
            });
        });
    });

    const closeLightbox = () => {
        if (!activeThumb) return;
        const rect = activeThumb.getBoundingClientRect();

        // Animate back to thumb position
        lightboxImg.style.top = `${rect.top}px`;
        lightboxImg.style.left = `${rect.left}px`;
        lightboxImg.style.width = `${rect.width}px`;
        lightboxImg.style.height = `${rect.height}px`;

        lightbox.classList.remove("active");

        // Cleanup after transition
        setTimeout(() => {
            document.body.style.overflow = "";
            activeThumb = null;
        }, 600);
    };

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox || e.target.classList.contains("close-lightbox")) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && lightbox.classList.contains("active")) {
            closeLightbox();
        }
    });
}
