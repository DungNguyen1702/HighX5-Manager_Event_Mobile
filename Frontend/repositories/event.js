import axios from 'axios'

const SERVER_NAME = 'localhost:3000'

const getEvents = async () => {
    try {
        const response = await axios.get(`http://${SERVER_NAME}/events`)
        return response.data
    } catch (error) {
        throw error
    }
}

const getEventsHome = async () => {
    try {
        const response = await axios.get(`http://${SERVER_NAME}/events-home`)
        return response.data
    } catch (error) {
        throw error
    }
}

const getEventDetail = async (id) => {
    try {
        const response = await axios.get(`http://${SERVER_NAME}/event-detail?id=${id}`)
    } catch (error) {
        throw error
    }
}

export default {
    getEvents,
    getEventsHome,
    getEventDetail
}
