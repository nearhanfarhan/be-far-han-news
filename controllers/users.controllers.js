const { fetchAllUsers } = require("../models/users.models")

exports.getAllUsers = (request, response, next) => {
    console.log("in controller")
    fetchAllUsers().then((users) => {
        response.status(200).send({users:users})
    })
}