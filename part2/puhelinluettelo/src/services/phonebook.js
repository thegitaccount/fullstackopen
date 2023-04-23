import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async nameObject => {
  const request = axios.post(baseUrl, nameObject)
  const response = await request
  return response.data
}

const remove = async (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  const response = await request
  return response
}

const update = async (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson)
  const response = await request
  return response.data
}

export default {getAll, create, remove, update}
