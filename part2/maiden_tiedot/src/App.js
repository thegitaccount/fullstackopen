import { useState, useEffect } from 'react'
import countriesService from './services/Countries'
import ShowCountries from './components/ShowCountries'
import Filter from './components/Filter'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(initial => {
        setCountries(initial)
    })
  }, [])
  
  console.log(countries)

   const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filterValue.toLowerCase())
  )

  console.log(countries)

  const handleFilterChange = (event) => {
    console.log("handle filter", event.target.value)
    setFilterValue(event.target.value)
  }

  return (
    <div>
      < Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />
      < ShowCountries filteredCountries={filteredCountries} />
    </div>
  )
}

export default App
