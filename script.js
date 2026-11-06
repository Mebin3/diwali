
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d", { alpha: true });

let particles = [];
let opened = false;

function resize() {

    const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
    );

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resize();

window.addEventListener("resize", resize);

const colors = [
    "#ffd700",
    "#ff9800",
    "#ff4444",
    "#ffffff",
    "#ff55cc"
];

// LIGHTWEIGHT EXPLOSION

function explosion(x, y, amount = 30) {

    const maxParticles = 220;

    if (particles.length > maxParticles - amount) return;

    for (let i = 0; i < amount; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 55,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 2 + 1
        });
    }
}

// ANIMATION

function animate() {

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= .985;
        p.vy *= .985;
        p.vy += .025;

        p.life--;

        ctx.globalAlpha = Math.max(0, p.life / 55);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }

    ctx.globalAlpha = 1;

    requestAnimationFrame(animate);
}

animate();

// BACKGROUND FIREWORKS

setInterval(() => {

    if (!opened && !document.hidden) {

        explosion(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight * .4,
            16
        );
    }

}, 3500);


// GIFT OPENING

const openBtn = document.getElementById("openBtn");
const gift = document.getElementById("gift");
const countdown = document.getElementById("countdown");
const instruction = document.getElementById("instruction");
const celebration = document.getElementById("celebration");

openBtn.addEventListener("click", () => {

    if (opened) return;

    opened = true;

    openBtn.style.display = "none";
    instruction.style.display = "none";

    gift.classList.add("opened");

    let number = 3;

    countdown.innerText = number;

    const timer = setInterval(() => {

        number--;

        if (number > 0) {

            countdown.innerText = number;

        } else {

            clearInterval(timer);

            countdown.innerText = "✨";

            // GOLDEN POPPER

            explosion(
                window.innerWidth / 2,
                window.innerHeight / 2,
                65
            );

            setTimeout(() => {
                explosion(
                    window.innerWidth * .25,
                    window.innerHeight * .35,
                    40
                );
            }, 300);

            setTimeout(() => {
                explosion(
                    window.innerWidth * .75,
                    window.innerHeight * .35,
                    40
                );
            }, 650);

            setTimeout(() => {

                celebration.style.display = "block";

                showMessage();

                celebration.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                startCelebration();

            }, 850);
        }

    }, 850);
});


// LETTER-BY-LETTER MESSAGE
// IMPORTANT: WORDS WILL NOT BREAK BETWEEN LINES

function showMessage() {

    const text =
        "May this Diwali bring endless happiness, beautiful memories, success and prosperity into your life. Let every light bring a new reason to smile!";

    const wish = document.getElementById("wish");

    wish.innerHTML = "";

    const words = text.split(" ");

    let letterIndex = 0;

    words.forEach((word) => {

        const wordContainer = document.createElement("span");

        wordContainer.className = "word";

        [...word].forEach((letter) => {

            const span = document.createElement("span");

            span.className = "letter";
            span.textContent = letter;

            span.style.animationDelay =
                (letterIndex * .035) + "s";

            wordContainer.appendChild(span);

            letterIndex++;

        });

        wish.appendChild(wordContainer);

    });

}


// CELEBRATION FIREWORKS

function startCelebration() {

    let count = 0;

    const timer = setInterval(() => {

        if (!document.hidden) {

            explosion(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight * .4,
                28
            );
        }

        count++;

        if (count >= 6) {
            clearInterval(timer);
        }

    }, 1300);
}


// SOCIAL SHARING

function share(platform) {

    const url = window.location.href;

    const text =
        "🪔 Happy Diwali! A beautiful surprise is waiting for you! 🎆";

    if (platform === "whatsapp") {

        window.open(
            "https://wa.me/?text=" +
            encodeURIComponent(text + " " + url),
            "_blank"
        );

    }

    if (platform === "facebook") {

        window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodeURIComponent(url),
            "_blank"
        );

    }

    if (platform === "instagram") {

        if (navigator.share) {

            navigator.share({
                title: "Happy Diwali",
                text: text,
                url: url
            });

        } else {

            alert("Copy the website link and share it on Instagram!");

        }
    }
}