const showBtn = document.querySelectorAll(".show-more button")
const modal = document.querySelector(".modal")
const modalContent = document.querySelector(".modal-content")
const modalCloseBtn = document.querySelector("#closeModal")


/**
 * Class with methods to get data to the Movie API
 * Get all category available, get movie info by movie id, get 10 best movies for all or one category
 */
class MoviesApi {
    constructor() {
        this.baseUrl = "http://localhost:8000/api/v1/"
    }

    async getCategories() {
        const categories = []
        let url = `${this.baseUrl}genres/`;
        while (url) {
            const data = await this.#getData(url)
            if (data) {
                url = data.next
                data.results.map(category => categories.push(category.name)) 
            } else {
                url = false
            }
        }
        return categories
    }

    async getMovieInfo(id) {
        const url = `${this.baseUrl}titles/${id}`
        return await this.#getData(url)
    }

    async getBestMovies() {
        let url = `${this.baseUrl}titles/?sort_by=-imdb_score&page_size=7`
        const data = await this.#getData(url)
        return data.results
    }

    async getBestMoviesByCategory(catergory) {
        const movies = []
        let url = `${this.baseUrl}titles/?genre_contains=${catergory}&sort_by=-imdb_score&page_size=10`
        let data = await this.#getData(url)
        for (const movie of data.results) {
            try {
                await this.#checkImage(movie.image_url)
                movies.push(movie)
                
            } catch {
                console.error('Remove movie without image');
            }
        }
        return movies.slice(0, 6)
    }

    async #getData(url) {
        let data
        await fetch(url)
        .then(response => {
            if (!response.ok) {throw new Error(response.status)}
            return response.json()
        })
        .then(json => data = json)
        .catch(error => console.error(error))
        return data
    }

    #checkImage(src) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.onload = () => resolve(img.height > 0)
          img.onerror = reject
          img.src = src
        })
      }
}

const moviesData = new MoviesApi()

/**
 * Display the first section for the best movie
 * @param {Object} movie Movie object returned by the MoviesApi.getMovieInfo 
 */
function displayBestMovie(movie) {
    bestmovie.innerHTML = `
        <img src = "${movie.image_url}"/>
        <div class="best-content">
            <h3>${movie.title}</h3>
            <p>${movie.description}</p>
            <div class="info-btn-ctn" id="best-btn-ctn">
                <button type="button" class="btn-red btn-large" id="${movie.id}">Détails</button>
            </div>
        </div>
    `
}

/**
 * Display the second section for best movies in all categories with détail button
 * @param {Object[]} bestMovies Array of movies object returned by MoviesApi.getBestMovies
 */
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

/**
 * Display best movies in category container selected with détail button
 * @param {String} category Name of category container
 * @param {Object[]} movies Array of movies returned by the MoviesApi.getBestMoviesByCategory
 */
function displayBestMoviesCategory(category, movies) {
    const minElement = window.innerWidth < 500 ? 2 : 4
    const showButtonMore = movies.length > minElement
    const btn = document.querySelector(`.show-more button[data-category=${category}]`)
    const categorySelector = document.getElementById(category)
    
    btn.innerHTML = "Voir plus"
    btn.style.display = showButtonMore ? "flex" : "none"
    categorySelector.innerHTML = ``
    movies.forEach(element => {
        categorySelector.innerHTML += `
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

/**
 * Display modal window with more information to the movie
 * @param {Number} movieId Movie API id
 */
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

/**
 * Put each category in select box and initialize the first category selected
 * @param {String} categorySelected Name of initial category
 */
function initOtherCategorySelector(categories, categorySelected) {
    if (categories) {
        categories.forEach(category => {
            const selected = category === categorySelected
            select.innerHTML += `
            <option value="${category}" ${selected ? "selected" : ""}>${category}</option>
            `
        })
    }
}

/**
 * Change number of movie to display with show more or less button
 * @param {String} category Category container selected
 */
function toggleDisplayMovies(category) {
    const moviesBox = document.querySelectorAll(`#${category} .box`)
    const btn = document.querySelector(`.show-more button[data-category=${category}]`)
    
    moviesBox.forEach(box => box.classList.toggle("reduce"))
    btn.innerHTML = btn.innerHTML === "Voir plus" ? "Voir moins" : "Voir plus"
}

/*Function to add event for each button 'Détail' for show the modal windows */
function infoBtnEvent() {
    const infoBtn = document.querySelectorAll(".info-btn-ctn button")
    infoBtn.forEach(btn => btn.addEventListener("click", (e) => displayModal(e.target.id)))
}

/**
 * Main function, get data with API, manage the display and add event for each button
 */
async function main() {
    const categories = await moviesData.getCategories()
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
    initOtherCategorySelector(categories, "Action")
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
