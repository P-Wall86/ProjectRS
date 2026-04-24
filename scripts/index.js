import { workshops } from "./data.js";

const title = document.getElementById("title");
const date = document.getElementById("date");
const description = document.getElementById("description");
const img = document.getElementById("main-img");
const content = document.getElementById("content");

const controls = document.getElementById("gallery-controls");
controls.style.display = "none";

const items = document.querySelectorAll(".dates li");

let currentImages = [];
let currentIndex = 0;

items.forEach(item => {
    item.addEventListener("click", () => {
        const id = item.dataset.id;
        const data = workshops[id];

        content.classList.remove("show");
        content.classList.add("fade");

        setTimeout(() => {
            title.textContent = data.title;
            date.textContent = data.date;

            if (data.content.images?.length) {
                currentImages = data.content.images;
                currentIndex = 0;
                img.src = currentImages[currentIndex];

                if (currentImages.length > 1) {
                    controls.style.display = "block";
                } else {
                    controls.style.display = "none";
                }

            } else {
                currentImages = [];
                img.src = "images/placeholder.jpg";
                controls.style.display = "none";
            }

            description.innerHTML = `
                <p>${data.content.description}</p>
            `;

            content.classList.remove("fade");
            content.classList.add("show");
        }, 200);
    });
});
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

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

prevBtn.addEventListener("click", () => {
    if (currentImages.length === 0) return;

    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }

    img.src = currentImages[currentIndex];

});

nextBtn.addEventListener("click", () => {
    if (currentImages.length === 0) return;

    currentIndex++;
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    }

    img.src = currentImages[currentIndex];
});