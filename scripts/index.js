import { workshops } from "./data/workshops.js";
import { presidency } from "./data/presidency.js";

// SYSTEM CONTROL
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const workshopIds = Object.keys(workshops);
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

function nextWorkshop() {
    currentIndex = (currentIndex + 1) % workshopIds.length;
    renderWorkshop(currentIndex);
}

function prevWorkshop() {
    currentIndex = (currentIndex - 1 + workshopIds.length) % workshopIds.length;
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
    if (isMobile) {
        currentIndex = -1;
        currentImages = [];
        currentImageIndex = 0;

        mainImg.src = "images/Souvenirs.webp";
        controls.style.display = "none";
    } else {
        currentIndex = -1;
        controls.style.display = "none";
    }
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

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
        animateSwipe("left", nextWorkshop);
    } else {
        animateSwipe("right", prevWorkshop);
    }
}

// SWIPE MOBILE ONLY
if (isMobile) {
    content.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].clientX;
    });

    content.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
}