import { useState } from 'react'
import Weather from '../services/Weather'

const ShowCountries = ({ filteredCountries }) => {
  const [showDetails, setShowDetails] = useState(null)


  const handleShowDetails = (country) => {
    setShowDetails(country)
  }

  const handleBack = () => {
    window.location.reload()
  }
  
  if (showDetails) {
    const country = showDetails

    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>
          <p>
            Capital: {country.capital}<br />
            Area: {country.area}<br />
            Population: {country.population}<br />
            GoogleMaps: <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">{country.maps.googleMaps}</a>
          </p>
        </div>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map((language, i) => <li key={i}>{language}</li>)}
        </ul>
        <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="200" /><br />
        < Weather city={country.capital} />
        <button onClick={handleBack}><span>&larr;</span> Back</button>
      </div>
    )
  }

  return (
    <div>
      {filteredCountries.length === 1 ? (
        <div>
          <h2>{filteredCountries[0].name.common}</h2>
          <div>
            <p>
              Capital: {filteredCountries[0].capital}<br />
              Area: {filteredCountries[0].area}<br />
              Population: {filteredCountries[0].population}<br />
              GoogleMaps: <a href={filteredCountries[0].maps.googleMaps} target="_blank" rel="noopener noreferrer">{filteredCountries[0].maps.googleMaps}</a>
            </p>
          </div>
          <h3>Languages</h3>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language, i) => <li key={i}>{language}</li>)}
          </ul>
          <img src={filteredCountries[0].flags.svg} alt={`Flag of ${filteredCountries[0].name.common}`} width="200" />
          < Weather city={filteredCountries[0].capital} />
        </div>
      ) : filteredCountries.length >= 2 && filteredCountries.length <= 10 ? (
        filteredCountries.map(country => (
          <div key={country.name.common}>
            {country.name.common} {``}
            <button onClick={() => handleShowDetails(country)}>Show</button>
          </div>
        ))
      ) : (
        <p>Too many matches, specify another filter</p>
      )}
    </div>
  )
}

export default ShowCountries
