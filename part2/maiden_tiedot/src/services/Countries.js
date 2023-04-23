import axios from 'axios'

const baseUrl = 'https://restcountries.com/v3.1'

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/all`)
  return response.data
}

export default { getAll }
