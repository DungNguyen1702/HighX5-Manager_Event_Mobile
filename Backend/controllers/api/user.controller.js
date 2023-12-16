require('dotenv').config() 
const cloudinary  = require("../../config/cloudinary.config") 
const objectCleaner = require("../../helpers/object-cleaner") 
const hashHelper = require(process.cwd() + "/helpers/password-encrypter") 

const { getAll, update, getUserByID } = require('../CRUD/user') 
const { getFacultyByName } = require("../CRUD/faculity")

async function index(request, response) {
    try {
        const queryResult = await getAll() 

        queryResult.count = queryResult.rows.length
        return response.status(200).json(queryResult) 
    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong!",
            error: error,
        }) 
    }
}


module.exports = {
    getUsers : index,
}