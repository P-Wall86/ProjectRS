import { workshops } from "./data/workshops.js";
import { presidency } from "./data/presidency.js";

// SYSTEM CONTROL
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const workshopIds = Object.entries(workshops)
    .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
    .map(([id]) => id);
let currentIndex = 0;
let currentImages = [];
let currentImageIndex = 0;

// DOM ELEMENTS
const title = document.getElementById("title");
const date = document.getElementById("date");
const description = document.getElementById("description");
const mainImg = document.getElementById("main-img");
const content = document.getElementById("content");

const controls = document.getElementById("gallery-controls");
controls.style.display = "none";

const items = document.querySelectorAll(".dates li");

// RENDER INTRO
function renderIntro() {
    currentIndex = -1;

    title.textContent = "Bienvenidas al B° Miguel Lanús";
    date.textContent = "";
    description.innerHTML = `
        <p>La Sociedad de Socorro es una organización religiosa...</p>
    `;

    mainImg.src = "images/Souvenirs.webp";
    controls.style.display = "none";

    content.classList.remove("fade");
    content.classList.add("show");
}

// RENDER WORKSHOP (CORE LOGIC)
function renderWorkshop(index) {
    const id = workshopIds[index];
    const data = workshops[id];

    if (!data) return;

    currentIndex = index;

    content.classList.remove("show");
    content.classList.add("fade");

    setTimeout(() => {
        title.textContent = data.title;
        date.textContent = data.date;

        if (data.content.images?.length) {
            currentImages = data.content.images;
            currentImageIndex = 0;
            mainImg.src = currentImages[0];

            controls.style.display = currentImages.length > 1 ? "flex" : "none";
        } else {
            currentImages = [];
            mainImg.src = "images/placeholder.jpg";
            controls.style.display = "none";
        }

        description.innerHTML = `<p>${data.content.description}</p>`;

        content.classList.remove("fade");
        content.classList.add("show");
    }, 150);
}

function showIntro() {
    renderIntro();
}

function nextWorkshop() {
    {
        if (currentIndex >= workshopIds.length - 1) {
            renderIntro();
            return;
        }

        currentIndex++;
        renderWorkshop(currentIndex);
    }
}

function prevWorkshop() {
    if (currentIndex <= 0) {
        return;
    }

    currentIndex--;
    renderWorkshop(currentIndex);
}

// SIDEBAR CLICK (WORKSHOPS)
items.forEach(item => {
    item.addEventListener("click", () => {
        const id = item.dataset.id;
        const index = workshopIds.indexOf(id);

        if (index === -1) return;

        renderWorkshop(index);
    });
});

// MONTHS ACCORDION
const monthButtons = document.querySelectorAll(".month-btn");

monthButtons.forEach(button => {
    button.addEventListener("click", () => {

        const list = button.nextElementSibling;
        const arrow = button.querySelector(".arrow");

        list.classList.toggle("hidden");

        if (list.classList.contains("hidden")) {
            arrow.textContent = "▶";
        } else {
            arrow.textContent = "▼";
        }

    });
});

// GALLERY (IMAGES INSIDE WORKSHOP)
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

prevBtn.addEventListener("click", () => {
    if (currentImages.length === 0) return;

    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }

    mainImg.src = currentImages[currentIndex];

});

nextBtn.addEventListener("click", () => {
    if (currentImages.length === 0) return;

    currentIndex++;
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    }

    mainImg.src = currentImages[currentIndex];
});

// PRESIDENCY SLIDER
const personImg = document.getElementById("person-img");
const personName = document.getElementById("person-name");
const personRole = document.getElementById("person-desc");

document.addEventListener("DOMContentLoaded", () => {
    let i = 0;

    function renderPerson() {
        const p = presidency[i];

        personImg.src = p.image;
        personName.textContent = p.name;
        personRole.textContent = p.role;
    }

    renderPerson();

    setInterval(() => {
        i = (i + 1) % presidency.length;
        renderPerson();
    }, 7500);
});

// INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
    renderIntro();
});

// TOUCH START/END
let touchStartX = 0;
let touchEndX = 0;

function animateSwipe(direction, callback) {
    if (direction === "left") {
        content.classList.add("swipe-left");
    } else {
        content.classList.add("swipe-right");
    }

    setTimeout(() => {
        content.classList.remove("swipe-left", "swipe-right");
        callback();
    }, 180);
}

function handleSwipe() {
    const diff = touchStartX - touchEndX;
    console.log("Diferencia usada:", diff);

    if (Math.abs(diff) < 50) {
        console.log("Swipe muy corto, ignorado");
        return;
    }

    // En el intro
    if (currentIndex === -1) {
        if (diff > 0) {
            console.log("Swipe izquierda (diff > 0) -> primera fecha");
            renderWorkshop(0);
        } else {
            console.log("Swipe derecha (diff < 0) -> última fecha");
            renderWorkshop(workshopIds.length - 1);
        }
        return;
    }

    // En un workshop
    if (diff > 0) {
        console.log("Swipe izquierda -> SIGUIENTE workshop");
        if (currentIndex >= workshopIds.length - 1) {
            renderIntro();
        } else {
            nextWorkshop();
        }
    } else {
        console.log("Swipe derecha -> ANTERIOR workshop");
        if (currentIndex <= 0) {
            renderIntro();
        } else {
            prevWorkshop();
        }
    }
}

// SWIPE MOBILE ONLY
if (isMobile) {
    content.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
        console.log("Touch START:", touchStartX);
    });

    content.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        console.log("Touch END:", touchEndX);
        console.log("Diferencia (start - end):", touchStartX - touchEndX);
        handleSwipe();
    });
}