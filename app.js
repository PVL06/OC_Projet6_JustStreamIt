const express = require("express")
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(5000, () => {
    console.log("App run on port 5000, url: http://localhost:5000/")
})
