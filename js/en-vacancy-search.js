import "bootstrap";

let cards, card;
let newCards = [];
let newCard;
let firstCards;
const list = document.querySelector("#cards-vacancy");

function searchResult(element) {
    list.innerHTML += `
    <div class="search__card">
    <div>
        <h5 class="search__card-title card-title">${element.occupation}</h5>
        <div class="search__card-subtitle">Company</div>
        <div class="search__card-experience">${element.company}</div>
        <div class="search__card-subtitle">City</div>
        <div class="search__card-city">${element.city2}</div>
        <div class="search__card-subtitle">Salary</div>
        <div class="search__card-salary">${element.salary} $</div>
    </div>
</div>`;
}

document.addEventListener("DOMContentLoaded", async function () {
    let url = "https://raw.githubusercontent.com/nas-tay/WorkIT-project/main/js/vacancy.json";
    let response = await fetch(url);
    cards = await response.json();
    firstCards = cards;

    if (localStorage.getItem("searchRequest")) {
        document.querySelector("#inputSearchvacancy").value = localStorage.getItem("searchRequest");
        createObject();
        localStorage.removeItem("searchRequest");
    } else {
        for (card of cards) {
            searchResult(card);
        }
    }

    let arrCity = [];

    for (card of cards) {
        arrCity.push(card.city2);
    }
    let uniqArrCity = [...new Set(arrCity)];
    for (uniqCity of uniqArrCity) {
        document.querySelector("#cities").innerHTML += `<option>${uniqCity}</option>`;
    }
});

function createObject() {
    const filterObject = {
        city: document.querySelector("#city").value,
        experience: [],
        jobFormat: [],
        level: [],
        minSalary: +document.querySelector("#minSalary").value,
        maxSalary: +document.querySelector("#maxSalary").value,
    };

    function getFilter(filter, objectPush) {
        filter.forEach((element) => {
            if (element.checked) {
                objectPush.push(element.value);
            }
        });
    }

    const level = document.querySelectorAll(".level");
    const jobFormat = document.querySelectorAll(".format");
    const experience = document.querySelectorAll(".experience");

    getFilter(level, filterObject.level);
    getFilter(jobFormat, filterObject.jobFormat);
    getFilter(experience, filterObject.experience);

    console.log(filterObject);

    function searchApp() {
        list.innerHTML = "";
        const searchText = document.querySelector("#inputSearchvacancy").value;
        for (card of cards) {
            if (!searchText == "") {
                const search = new RegExp(searchText, "gi");
                const rez = search.test(card.keyWords);
                if (rez) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (searchText == "") {
                searchResult(card);
                newCards.push(card);
            }
        }
        cards = newCards;
        newCards = [];
    }

    if (document.querySelector("#inputSearchvacancy").value !== "") {
        searchApp();
    }

    function searchCity() {
        list.innerHTML = "";
        for (card of cards) {
            if (card.city2 == filterObject.city2) {
                searchResult(card);
                newCards.push(card);
            }
        }
        cards = newCards;
        newCards = [];
    }
    if (document.querySelector("#city").value !== "") {
        searchCity();
    }

    function searchLevel() {
        list.innerHTML = "";
        for (card of cards) {
            if (card.level == filterObject.level) {
                searchResult(card);
                newCards.push(card);
            }
        }
        cards = newCards;
        newCards = [];
    }
    if (filterObject.level.length !== 0) {
        searchLevel();
    }

    function serchSalary() {
        list.innerHTML = "";
        for (card of cards) {
            if (filterObject.minSalary !== 0 && card.salary >= filterObject.minSalary) {
                if (filterObject.maxSalary !== 0 && card.salary <= filterObject.minSalary) {
                    searchResult(card);
                    newCards.push(card);
                }
                if (filterObject.maxSalary == 0) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (filterObject.maxSalary !== 0 && card.salary <= filterObject.maxSalary) {
                if (filterObject.minSalary !== 0 && card.salary >= filterObject.minSalary) {
                    searchResult(card);
                    newCards.push(card);
                }
                if (filterObject.minSalary == 0) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
        }
    }

    if (filterObject.minSalary !== 0 || filterObject.maxSalary !== 0) {
        serchSalary();
    }

    function searchExperience() {
        list.innerHTML = "";
        for (card of cards) {
            let expYears = +card.experience.replace(/\D/g, "");
            console.log(expYears);
            if (document.querySelector("#zero").checked)
                if (expYears == 0) {
                    searchResult(card);
                    newCards.push(card);
                }
            if (document.querySelector("#small").checked) {
                if (expYears >= 1 && expYears <= 3) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (document.querySelector("#medium").checked) {
                if (expYears >= 3 && expYears <= 6) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (document.querySelector("#large").checked) {
                if (expYears >= 6) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
        }
        cards = newCards;
        newCards = [];
    }

    if (filterObject.experience.length !== 0) {
        searchExperience();
    }

    function searchFormat() {
        list.innerHTML = "";
        for (card of cards) {
            if (document.querySelector("#distant").checked) {
                const search = new RegExp("удален", "gi");
                const rez = search.test(card.jobFormat);
                if (rez) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (document.querySelector("#office").checked) {
                const search = new RegExp("офис", "gi");
                const rez = search.test(card.jobFormat);
                if (rez) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
            if (document.querySelector("#hybrid").checked) {
                const search = new RegExp("гибрид", "gi");
                const rez = search.test(card.jobFormat);
                if (rez) {
                    searchResult(card);
                    newCards.push(card);
                }
            }
        }
        cards = newCards;
        newCards = [];
    }
    if (filterObject.jobFormat.length !== 0) {
        searchFormat();
    }
}

const btnSearch = document.querySelector("#btnSearchvacancy");
const inputSearchvacancy = document.querySelector("#inputSearchvacancy");
const btnFilter = document.querySelector("#btnFilter");
const btnReboot = document.querySelector("#btnReboot");

btnSearch.addEventListener("click", () => {
    cards = firstCards;
    createObject();
});
btnFilter.addEventListener("click", () => {
    cards = firstCards;
    createObject();
});
inputSearchvacancy.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        cards = firstCards;
        createObject();
    }
});

btnReboot.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input");
    inputs.forEach((item) => {
        item.checked = false;
        item.value = "";
    });
});

function filtermobilen() {
    var ele = document.querySelector(".filter-content");
    var text = document.querySelector(".filter-mobile");
    if (ele.style.display == "block") {
        ele.style.display = "none";
        text.innerHTML = "Filter";
        document.querySelector(".searching__filters").classList.remove("shadow-on");
    } else {
        ele.style.display = "block";
        text.innerHTML = "Close filter";
        document.querySelector(".searching__filters").classList.remove("searching__filters_shadow");
        document.querySelector(".searching__filters").classList.add("shadow-on");
    }
}
document.getElementById("btnappfilter1").addEventListener("click", () => {
    filtermobilen();
});



