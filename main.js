import {MoviesApi} from "./data.js"

const moviesData = new MoviesApi()
const categories = await moviesData.getCategories()

const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modal-content")
const modalCloseBtn = document.querySelector(".closeModal")


function displayBestMovie(movie) {
    bestmovie.innerHTML = `
        <img src = "${movie.image_url}"/>
        <div class="best-content">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="best-btn">
                <button type="button" class="info-btn" data-id=${movie.id}>Détails</button>
            </div>
        </div>
    `
}

function displayBestMoviesAll(bestMovies) {
    bestMovies.forEach(element => {
        all.innerHTML += `
        <div class="box" style="background: url(${element.image_url}) center/cover">
            <div class="info">
                <p>${element.title}</p>
                <button type="button" class="info-btn" data-id=${element.id}>Détails</button> 
            </div>
        </div>
        `
    })
}

function displayBestMoviesCategory(category, movies) {
    document.getElementById(category).innerHTML = ``
    movies.forEach(element => {
        document.getElementById(category).innerHTML += `
        <div class="box" style="background: url(${element.image_url}) center/cover">
            <div class="info">
                <p>${element.title}</p>
                <button type="button" class="info-btn" data-id=${element.id}>Détails</button> 
            </div>
        </div>
        `
    })
}

function otherCategorySelector(selected) {
    if (categories) {
        categories.forEach(category => {
            select.innerHTML += `
            <option value="${category}" ${
                category === selected ? "selected" : ""
            }>${
                category
            }</option>
            `
        })
    }
}

function infoBtnEvent() {
    const infoBtn = document.querySelectorAll(".info-btn")
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

async function start(categories) {
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
    otherCategorySelector(categories, "Action")
    displayBestMoviesCategory("others", selectedMovies)
}

await start(categories)
infoBtnEvent()

select.addEventListener("change", async (e) => {
    const selection = e.target.value
    const movies = await moviesData.getBestMoviesByCategory(selection)
    otherCategorySelector(selection)
    displayBestMoviesCategory("others", movies)
    infoBtnEvent()
})

modalCloseBtn.addEventListener("click", () => modal.style.display = "none")
