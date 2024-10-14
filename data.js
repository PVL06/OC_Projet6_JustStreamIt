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
        return await this.#getData(url)
    }

    async getBestMovies() {
        const bestMovies = []
        let url = `${this.baseUrl}titles/?sort_by=-imdb_score`
        for (let step = 0; step < 2; step++) {
            const data = await this.#getData(url)
            if (data) {
                data.results.map(movie => bestMovies.push(movie))
                url = data.next
            }
        }  
        return bestMovies
    }

    async getBestMoviesByCategory(catergory) {
        const movies = []
        let url = `${this.baseUrl}titles/?genre_contains=${catergory}&sort_by=-imdb_score`
        for (let step = 0; step < 2; step++) {
            const data = await this.#getData(url)
            if (data) {
                data.results.map(movie => movies.push(movie))
                url = data.next
            }
            if (!data.next) break
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
}
