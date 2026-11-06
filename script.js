
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

let particles = [];

const colors = [
    "#ff0000",
    "#ffd700",
    "#ff7700",
    "#ffffff",
    "#ff00ff",
    "#00ffff",
    "#00ff66"
];

// Firecracker explosion

function explosion(x, y, power = 120) {

    for (let i = 0; i < power; i++) {

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 1;

        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 1
        });
    }
}

// Firework animation

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= .99;
        p.vy *= .99;
        p.vy += .035;

        p.life--;

        ctx.globalAlpha = p.life / 100;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
            particles.splice(i, 1);
        }

    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
}

animate();

// Background fireworks

setInterval(() => {

    if (!document.hidden) {
        explosion(
            Math.random() * canvas.width,
            Math.random() * canvas.height * .6,
            65
        );
    }

}, 1800);


// Gift opening sequence

const openBtn = document.getElementById("openBtn");
const gift = document.getElementById("gift");
const countdown = document.getElementById("countdown");
const instruction = document.getElementById("instruction");
const celebration = document.getElementById("celebration");

let opened = false;

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

            explosion(
                canvas.width / 2,
                canvas.height / 2,
                40
            );

        } else {

            clearInterval(timer);

            countdown.innerText = "✨";

            // Massive opening explosion

            for (let i = 0; i < 18; i++) {

                setTimeout(() => {

                    explosion(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height * .75,
                        160
                    );

                }, i * 180);

            }

            setTimeout(() => {

                celebration.style.display = "block";

                showMessage();

                celebration.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 1200);

        }

    }, 1000);

});


// Beautiful letter-by-letter message

function showMessage() {

    const text =
        "May this Diwali bring endless happiness, beautiful memories, success and prosperity into your life. Let every light bring a new reason to smile!";

    const wish = document.getElementById("wish");

    wish.innerHTML = "";

    [...text].forEach((letter, index) => {

        const span = document.createElement("span");

        span.textContent = letter === " " ? "\u00A0" : letter;

        span.style.animationDelay = (index * .035) + "s";

        wish.appendChild(span);

    });

    // More fireworks during celebration

    let count = 0;

    const celebrationFireworks = setInterval(() => {

        explosion(
            Math.random() * canvas.width,
            Math.random() * canvas.height * .7,
            150
        );

        count++;

        if (count >= 20) {
            clearInterval(celebrationFireworks);
        }

    }, 450);

}


// Social sharing

function share(platform) {

    const url = window.location.href;

    const text = "🪔 Happy Diwali! A beautiful surprise is waiting for you! 🎆";

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