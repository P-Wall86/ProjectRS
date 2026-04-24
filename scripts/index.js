import { workshops } from "./data.js";

const title = document.getElementById("title");
const date = document.getElementById("date");
const description = document.getElementById("description");

const items = document.querySelectorAll(".dates li");

items.forEach(item => {
    item.addEventListener("click", () => {
        const id = item.dataset.id;
        const data = workshops[id];

        const content = document.getElementById("content");

        content.classList.remove("show");
        content.classList.add("fade");

        setTimeout(() => {
            title.textContent = data.title;
            date.textContent = data.date;
            description.textContent = data.description;

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