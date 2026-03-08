/* =========================
RUN AFTER DOM LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {


/* =========================
SCROLL REVEAL ANIMATION
========================= */

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll(){

const windowHeight = window.innerHeight;

revealElements.forEach(el => {

const elementTop = el.getBoundingClientRect().top;

if(elementTop < windowHeight - 80){
el.classList.add("visible");
}

});

}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


/* =========================
NAVBAR ACTIVE LINK
========================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink(){

let current = "";

sections.forEach(section => {

const sectionTop = section.offsetTop - 140;

if(window.scrollY >= sectionTop){
current = section.getAttribute("id");
}

});

navLinks.forEach(link => {

link.classList.remove("active");

if(link.getAttribute("href").includes(current)){
link.classList.add("active");
}

});

}

window.addEventListener("scroll", updateActiveLink);


/* =========================
SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

anchor.addEventListener("click", function(e){

e.preventDefault();

const target = document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({
behavior:"smooth",
block:"start"
});

}

});

});


/* =========================
MOBILE MENU AUTO CLOSE
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navItems = document.querySelectorAll(".nav-links a");

if(menuToggle){

navItems.forEach(link => {

link.addEventListener("click", () => {
menuToggle.checked = false;
});

});

}


/* =========================
FORM TOGGLE
========================= */

const openFormBtn = document.getElementById("openFormBtn");
const formWrapper = document.getElementById("contactFormWrapper");

if(openFormBtn && formWrapper){

openFormBtn.addEventListener("click", () => {
formWrapper.classList.toggle("open");
});

}


/* =========================
GOOGLE SHEET FORM SUBMIT
========================= */

const form = document.getElementById("project-form");
const successMsg = document.getElementById("formSuccess");

/* paste your Apps Script URL here */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxLPPH3O8sGyVPsvrpWTyYghduROJwW-1sSOsMSE9U0XdHfxXSbzjVqmaDaZaAoEikuTA/exec";

if(form){

form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = Object.fromEntries(formData.entries());

try{

await fetch(SCRIPT_URL,{
method:"POST",
body:JSON.stringify(data)
});

if(successMsg){
successMsg.style.display="block";
}

form.reset();

/* auto close form after 3s */

setTimeout(()=>{

if(formWrapper){
formWrapper.classList.remove("open");
}

if(successMsg){
successMsg.style.display="none";
}

},3000);

}catch(error){

alert("Error sending form. Please try again.");

}

});

}

});   // ← missing closing bracket fixed