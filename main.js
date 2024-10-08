import {MoviesApi} from "./data.js"

const moviesData = new MoviesApi()

const bestMovieSelector = document.getElementById("best-movie")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modal-content")
const modalCloseBtn = document.querySelector(".closeModal")

async function displayBestMovie() {
    const bestMovie = await moviesData.getBestMovie()
    const movie = await moviesData.getMovieInfo(bestMovie.id)
    bestMovieSelector.innerHTML = `
        <img src = "${movie.image_url}"/>
        <div>
            <h3>${movie.title}<h3/>
            <p>${movie.description}</p>
            <button type="button" class="info-btn" data-id=${movie.id}>Détail</button>
        </div>
    `
}

async function displayMovies(category) {
    let movies
    if (category === "all") {
        movies = await moviesData.getBestMovies()
    } else if (category === "others"){
        movies = await moviesData.getBestMoviesByCategory("romance")
    } else {
        movies = await moviesData.getBestMoviesByCategory(category)
    }
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

async function test() {
    await displayBestMovie()
    for (const category of ["all", "adventure", "comedy", "others"]) {
        await displayMovies(category)
    }
    const infoBtn = document.querySelectorAll(".info-btn")
    infoBtn.forEach(btn => btn.addEventListener("click", (e) => displayModal(e.target.dataset.id)))
    modalCloseBtn.addEventListener("click", () => modal.style.display = "none")
    
}

test()
