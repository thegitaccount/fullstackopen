const Persons = ({ filteredPersons, deletePerson }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {filteredPersons.map(person => 
        <div key={person.id}>
          {person.name} {person.number} {``}
          <button onClick={() => deletePerson(person.name, person.id)}>delete</button>
        </div>
      )}
    </div>
  )
}

export default Persons
