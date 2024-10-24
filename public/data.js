/**
 * Class with methods to get data to the Movie API
 * Get all category available, get movie info by movie id, get 10 best movies for all or one category
 */
export class MoviesApi {
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
        let movie = await this.#getData(url)
        try {
            await this.#checkImageSource(movie.image_url)
        } catch {
            movie.image_url = "./assets/img/no-image-available.png"
        }
        return movie
    }

    async getBestMovies() {
        const url = `${this.baseUrl}titles/?sort_by=-imdb_score&page_size=7`
        let data = await this.#getData(url)
        return this.#getMovies(data)
    }

    async getBestMoviesByCategory(catergory) {
        const url = `${this.baseUrl}titles/?genre_contains=${catergory}&sort_by=-imdb_score&page_size=6`
        let data = await this.#getData(url)
        return this.#getMovies(data)
    }

    /**
     * Get data of the API and check if reponse is ok (status = 200)
     * @param {String} url Endpoint for the API
     * @returns Data in json
     */
    async #getData(url) {
        let data
        await fetch(url)
        .then(response => {
            if (!response.ok) {throw new Error(response.status)}
            data = response.json()
        })
        .catch(error => console.error(error))
        return data
    }

    /**
     * Create promise to check if image url is valid
     * @param {String} src Url of image to test 
     */
    #checkImageSource(src) {
        return new Promise((resolve, reject) => {
          let img = new Image()
          img.onload = () => resolve(img.height > 0)
          img.onerror = reject
          img.src = src
        })
    }

    /**
     * Return movies array and check for each movie if image is available else replace image by no-image-available.png
     * @param {Object} data Data in json returned by the api
     * @returns Array of movies
     */
    async #getMovies(data) {
        const movies = []
        for (const movie of data.results) {
            try {
                await this.#checkImageSource(movie.image_url)
                movies.push(movie)
                
            } catch {
                movie.image_url = "./assets/img/no-image-available.png"
                movies.push(movie)
            }
        }
        return movies
    }
}