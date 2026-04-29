import { workshops } from "./data/workshops.js";
import { presidency } from "./data/presidency.js";
import { classes } from "./data/classes.js";
import { biz } from "./data/biz.js";

const isMobile = window.matchMedia("(max-width: 768px)").matches;
const workshopIds = Object.entries(workshops)
    .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
    .map(([id]) => id);

let currentIndex = -1;
let currentImages = [];
let activeTab = "historias";
let originalDescriptionHTML = "";
let currentImageIndex = 0;

const title = document.getElementById("title");
const date = document.getElementById("date");
const description = document.getElementById("description");
const mainImg = document.getElementById("main-img");
const content = document.getElementById("content");
const controls = document.getElementById("gallery-controls");
const personImg = document.getElementById("person-img");
const personName = document.getElementById("person-name");
const personRole = document.getElementById("person-desc");

document.addEventListener("DOMContentLoaded", () => {
    if (description) originalDescriptionHTML = description.innerHTML;

    initTabs();
    initAccordion();
    initGallery();
    initPresidency();

    renderActiveTab();
});

function initTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            activeTab = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderActiveTab();
        });
    });
}

function renderActiveTab() {
    if (!content) return;
    content.classList.remove("show");

    const isDesktop = window.innerWidth >= 768;
    const sidebar = document.getElementById("sidebar");
    const presSection = document.getElementById("presidency");

    if (isDesktop) {
        if (sidebar) sidebar.style.display = "block";
        if (presSection) presSection.style.display = "block";
    }

    switch (activeTab) {
        case "historias":
            renderIntro();
            break;
        case "clases":
            renderClasses();
            break;
        case "emprendimientos":
            renderBiz();
            break;
    }
}

function renderIntro() {
    currentIndex = -1;
    if (title) title.textContent = "Bienvenidas al B° Miguel Lanús";
    if (date) date.textContent = "";
    if (description) description.innerHTML = originalDescriptionHTML;
    if (mainImg) {
        mainImg.src = "images/RSMLanus.png";
        mainImg.style.display = "block";
    }
    if (controls) controls.style.display = "none";
    content.classList.add("show");
}

function renderWorkshop(index) {
    const id = workshopIds[index];
    const data = workshops[id];
    if (!data) return;

    currentIndex = index;
    content.classList.remove("show");

    title.textContent = data.title;
    date.textContent = data.date;

    if (data.content.images?.length) {
        currentImages = data.content.images;
        currentImageIndex = 0;
        mainImg.src = currentImages[0];
        if (controls) controls.style.display = currentImages.length > 1 ? "flex" : "none";
    } else {
        currentImages = [];
        mainImg.src = "images/placeholder.jpg";
        if (controls) controls.style.display = "none";
    }

    mainImg.style.display = "block";
    description.innerHTML = `<p>${data.content.description}</p>`;
    setTimeout(() => content.classList.add("show"), 50);
}


function renderClasses() {
    title.textContent = "Para la clase que viene...";
    date.textContent = "";

    const sortedClasses = Object.entries(classes)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([id, data]) => ({ id, ...data }));

    if (sortedClasses.length === 0) {
        description.innerHTML = '<p class="no-classes">No hay clases disponibles.</p>';
        if (mainImg) mainImg.style.display = "none";
        return;
    }

    const latest = sortedClasses[0];

    if (mainImg) {
        mainImg.src = (latest.content && latest.content.images) ? latest.content.images[0] : "images/placeholder.jpg";
        mainImg.style.display = "block";
    }

    if (controls) controls.style.display = "none";

    let html = '<div class="classes-main-view">';

    sortedClasses.forEach((c, index) => {
        html += `
            <div class="class-entry" style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <h2 style="font-size: 1.8rem; color: #333;">${c.title}</h2>
                <p style="color: #666; font-style: italic; margin-bottom: 15px;">📅 ${c.date}</p>
                
                ${index > 0 ? `<img src="${c.content.images[0]}" class="class-image" style="width: 100%; border-radius: 8px; margin-bottom: 15px; cursor: pointer;">` : ''}
                
                <div class="class-text" style="font-size: 1.1rem; line-height: 1.6; color: #444;">
                    ${c.content.description}
                </div>
            </div>
        `;
    });

    html += '</div>';
    description.innerHTML = html;
    content.classList.add("show");

    document.querySelectorAll('.class-image').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src);
        });
    });
}

function renderBiz() {
    if (title) title.textContent = "¿Qué compramos?";
    if (date) date.textContent = "";
    if (mainImg) mainImg.style.display = "none";
    if (controls) controls.style.display = "none";

    let html = "<div class='biz-list'>";
    biz.forEach(b => {
        html += `
            <div class="biz">
                <img src="${b.image}" class="biz-img">
                <div class="biz-text">
                    <h3>${b.name}</h3>
                    <p>${b.desc}</p>
                    <div class="biz-contacts">
                        ${b.contact.instagram ? `
                        <a href="${b.contact.instagram}" target="_blank">
                        <i class="fab fa-instagram"></i>
                        </a>` : ""}

                        ${b.contact.facebook ? `
                        <a href="${b.contact.facebook}" target="_blank">
                        <i class="fab fa-facebook"></i>
                        </a>` : ""}
                    </div>
                </div>
            </div>`;
    });
    html += "</div>";
    if (description) description.innerHTML = html;
    content.classList.add("show");
}

function initAccordion() {
    const monthButtons = document.querySelectorAll(".month-btn");
    const items = document.querySelectorAll(".dates li");

    monthButtons.forEach(button => {
        button.addEventListener("click", () => {
            const list = button.nextElementSibling;
            const arrow = button.querySelector(".arrow");
            if (list) list.classList.toggle("hidden");
            if (arrow) arrow.textContent = list.classList.contains("hidden") ? "▶" : "▼";
        });
    });

    items.forEach(item => {
        item.addEventListener("click", () => {
            activeTab = "historias";
            const tabs = document.querySelectorAll(".tab");
            tabs.forEach(t => t.classList.remove("active"));
            const tabH = document.querySelector('[data-tab="historias"]');
            if (tabH) tabH.classList.add("active");

            const index = workshopIds.indexOf(item.dataset.id);
            if (index !== -1) renderWorkshop(index);
        });
    });
}

function initGallery() {
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentImages.length === 0) return;
            currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
            mainImg.src = currentImages[currentImageIndex];
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentImages.length === 0) return;
            currentImageIndex = (currentImageIndex + 1) % currentImages.length;
            mainImg.src = currentImages[currentImageIndex];
        });
    }
}

function initPresidency() {
    if (!presidency || presidency.length === 0) return;
    let i = 0;
    const renderPerson = () => {
        const p = presidency[i];
        if (personImg) personImg.src = p.image;
        if (personName) personName.textContent = p.name;
        if (personRole) personRole.textContent = p.role;
    };
    renderPerson();
    setInterval(() => {
        i = (i + 1) % presidency.length;
        renderPerson();
    }, 7500);
}

function openLightbox(imgSrc) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;justify-content:center;align-items:center;z-index:99999;cursor:pointer;`;
    const bigImg = document.createElement("img");
    bigImg.src = imgSrc;
    bigImg.style.cssText = `max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;`;
    overlay.appendChild(bigImg);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", () => overlay.remove());
}

if (isMobile && mainImg) {
    mainImg.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(mainImg.src);
    });

    let touchStartX = 0;
    if (content) {
        content.addEventListener("touchstart", (e) => {
            if (activeTab !== "historias") return;

            touchStartX = e.changedTouches[0].clientX;
        });

        content.addEventListener("touchend", (e) => {
            if (activeTab !== "historias") return;

            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) < 50) return;

            const max = workshopIds.length - 1;

            if (diff > 0) {
                if (currentIndex === -1) {
                    renderWorkshop(max);
                } else if (currentIndex <= 0) {
                    renderIntro();
                } else {
                    renderWorkshop(currentIndex - 1);
                }
            } else {
                if (currentIndex === -1) {
                    renderWorkshop(0);
                } else if (currentIndex >= max) {
                    renderIntro();
                } else {
                    renderWorkshop(currentIndex + 1);
                }
            }
        });
    }
}