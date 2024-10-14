import {MoviesApi} from "./data.js"

const moviesData = new MoviesApi()
const categories = await moviesData.getCategories()

const showBtn = document.querySelectorAll(".show-more button")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modal-content")
const modalCloseBtn = document.querySelector(".closeModal")


function displayBestMovie(movie) {
    bestmovie.innerHTML = `
        <img src = "${movie.image_url}"/>
        <div class="best-content">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="info-btn-ctn" id="best-btn-ctn">
                <button type="button" data-id=${movie.id}>Détails</button>
            </div>
        </div>
    `
}

function displayBestMoviesAll(bestMovies) {
    bestMovies.forEach(element => {
        all.innerHTML += `
        <div class="box reduce" style="background: url(${element.image_url}) center/cover">
            <div class="info">
                <p>${element.title}</p>
                <div class="info-btn-ctn">
                    <button type="button" data-id=${element.id}>Détails</button> 
                </div>
            </div>
        </div>
        `
    })
}

function displayBestMoviesCategory(category, movies) {
    const minElement = window.innerWidth < 500 ? 2 : 4
    const showButtonMore = movies.length > minElement
    const btn = document.querySelector(`.show-more button[data-category=${category}]`)
    if (showButtonMore) {
        btn.style.display = "flex"
    } else {
        btn.style.display = "none"
        btn.innerHTML = "Voir plus"
    }
    document.getElementById(category).innerHTML = ``
    movies.forEach(element => {
        document.getElementById(category).innerHTML += `
        <div class="box ${showButtonMore ? "reduce" : ""}" style="background: url(${element.image_url}) center/cover">
            <div class="info">
                <p>${element.title}</p>
                <div class="info-btn-ctn">
                    <button type="button" data-id=${element.id}>Détails</button> 
                </div>
            </div>
        </div>
        `
    })
}

function InitOtherCategorySelector(categorySelected) {
    if (categories) {
        categories.forEach(category => {
            const selected = category === categorySelected
            select.innerHTML += `
            <option value="${category}" ${selected ? "selected" : ""}>${category}</option>
            `
        })
    }
}

function toggleDisplayMovies(category) {
    const moviesBox = document.querySelectorAll(`#${category} .box`)
    moviesBox.forEach(box => box.classList.toggle("reduce"))

    const btn = document.querySelector(`.show-more button[data-category=${category}]`)
    if (btn.innerHTML === "Voir plus") {
        btn.innerHTML = "Voir moins"
    } else {
        btn.innerHTML = "Voir plus"
    }
}

function infoBtnEvent() {
    const infoBtn = document.querySelectorAll(".info-btn-ctn button")
    infoBtn.forEach(btn => btn.addEventListener("click", (e) => displayModal(e.target.dataset.id)))
}

async function displayModal(id) {
    modal.style.display = "flex"
    const data = await moviesData.getMovieInfo(id)
    modalContent.innerHTML = `
    <div>
        <div>
            <img src=${data.image_url}/>
            <p>${data.title}</p>
        </div>
    </div>
    `
}

async function start() {
    const bestMoviesData = await moviesData.getBestMovies()
    const bestMovieData = await moviesData.getMovieInfo(bestMoviesData[0].id)
    displayBestMovie(bestMovieData)
    displayBestMoviesAll(bestMoviesData.slice(1, 7))

    const staticCategories = ["adventure", "comedy"]
    for (const category of staticCategories) {
        const movies = await moviesData.getBestMoviesByCategory(category)
        displayBestMoviesCategory(category, movies)
    }

    const selectedMovies = await moviesData.getBestMoviesByCategory("Action")
    InitOtherCategorySelector("Action")
    displayBestMoviesCategory("others", selectedMovies)
}

await start()

/* events listener */

infoBtnEvent()

showBtn.forEach(btn => btn.addEventListener("click", (e) => {
    toggleDisplayMovies(e.target.dataset.category)
}))

select.addEventListener("change", async (e) => {
    const selection = e.target.value
    const movies = await moviesData.getBestMoviesByCategory(selection)
    displayBestMoviesCategory("others", movies)
    infoBtnEvent()
})

modalCloseBtn.addEventListener("click", () => modal.style.display = "none")
