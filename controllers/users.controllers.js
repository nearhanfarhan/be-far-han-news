const { fetchAllUsers } = require("../models/users.models")

exports.getAllUsers = (request, response, next) => {
    fetchAllUsers().then((users) => {
        response.status(200).send({users:users})
    })
}