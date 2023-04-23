import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([]) 
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [message, setMessage] = useState('')



  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filterValue.toLowerCase())
  )

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPhonebook => {
        setPersons(initialPhonebook)
      })
   }, [])


  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const nameObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName);
        const updatedPerson = { ...personToUpdate, number: newNumber }
        phonebookService
        .update(personToUpdate.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map(person => person.id !== personToUpdate.id ? person : returnedPerson))
        setMessage(`${String.fromCharCode(9998)} Successfully updated ${returnedPerson.name}'s number to ${newNumber}`)
        setTimeout(() => {
          setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage(`🛑 Error: ${personToUpdate.name} has already been removed.`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          phonebookService
            .getAll()
            .then(initialPhonebook => {
              setPersons(initialPhonebook)
            })
        })
      }
    }
    else if (persons.some(person => person.number === newNumber)) {
      alert(`${newNumber} is already added to the phonebook for someone else`)
    }  

    else {
        phonebookService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))

        setMessage(`${String.fromCharCode(10004)} Added ${returnedPerson.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        })
        phonebookService
          .getAll()
          .then(initialPhonebook => {
            setPersons(initialPhonebook)
        })

    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (name, id) => {
    console.log(id)
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      setMessage(`${String.fromCharCode(10060)} Deleted ${name}`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      })
      .catch(error => {
        setMessage(`🛑 Error: ${name} has already been removed.`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        phonebookService
          .getAll()
          .then(initialPhonebook => {
            setPersons(initialPhonebook)
          })
      })

    }
  }

  const handleNameChange = (event) => {
    console.log("handle name", event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log("handle number", event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log("handle filter", event.target.value)
    setFilterValue(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>    
      <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />
      <h2>Add a new person</h2>
      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
      <Notification message={message} />

    </div>
  )
}

export default App
