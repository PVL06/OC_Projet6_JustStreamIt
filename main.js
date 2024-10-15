import {MoviesApi} from "./data.js"

const moviesData = new MoviesApi()
const categories = await moviesData.getCategories()

const showBtn = document.querySelectorAll(".show-more button")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modal-content")
const modalCloseBtn = document.querySelector("#closeModal")


function displayBestMovie(movie) {
    bestmovie.innerHTML = `
        <img src = "${movie.image_url}"/>
        <div class="best-content">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="info-btn-ctn" id="best-btn-ctn">
                <button type="button" id="${movie.id}">Détails</button>
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
                    <button type="button" id=${element.id}>Détails</button> 
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
                    <button type="button" id=${element.id}>Détails</button> 
                </div>
            </div>
        </div>
        `
    })
}

async function displayModal(movieId) {
    const movie = await moviesData.getMovieInfo(movieId)
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3 class="strong">${movie.title}</h3>
            <p class="strong">${movie.year} - ${movie.genres.join(', ')}</p>
            <p class="strong">${movie.duration} minutes (${movie.countries.join(', ')})</p>
            <p class="strong">IMDB score: ${movie.imdb_score}/10</p>
        </div>
        <div class class="modal-realize">
            <p class="strong">Réalisé par:</p>
            <p>${movie.directors.join(', ')}</p>
        </div>
        <div class="modal-description">
            <p>${movie.long_description}</p>
        </div>
        <div class="modal-img">
            <img src=${movie.image_url}/>
        </div>
        <div class="modal-actors">
            <p class="strong">Avec: </p>
            <p>${movie.actors.join(', ')}</p>
        </div>
    `
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
    infoBtn.forEach(btn => btn.addEventListener("click", (e) => displayModal(e.target.id)))
}


async function main() {
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

    /* events listener */
    infoBtnEvent()
    showBtn.forEach(btn => btn.addEventListener("click", (e) => {
        toggleDisplayMovies(e.target.dataset.category)
    }))
    select.addEventListener("change", async () => {
        const movies = await moviesData.getBestMoviesByCategory(select.value)
        displayBestMoviesCategory("others", movies)
        infoBtnEvent()
    })
    modalCloseBtn.addEventListener("click", () => {
        modal.style.display = "none"
        document.body.style.overflow = "auto"
    })
}

main()
