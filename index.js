const express = require("express")
const server = express()
const port = process.env.PORT || 5000
require("dotenv").config()
const usersRouter = require("./users/users-router")

server.use(express.json())
server.use(usersRouter)
server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})