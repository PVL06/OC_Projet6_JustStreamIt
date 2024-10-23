export { MoviesApi }

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
