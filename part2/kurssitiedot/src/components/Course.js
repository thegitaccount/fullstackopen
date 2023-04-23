const Course = (props) => {
  console.log("Course props", props)
  return (
    <div>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
  </div>
  )
}

const Header = (props) => {
  console.log("Header",props)
  return (
    <div>
      <h2>{props.name}</h2>
    </div>
  )
}

const Content = (props) => {
  console.log('Content', props)
  return (
    <div>
      {props.parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  )
}

const Total = (props) => {
  console.log("Total", props)
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  console.log(total)
  return (
    <div>
      <b>total of {total} exercises</b>
    </div>
  )
}

const Part = (props) => {
  console.log("Part", props)
  return (
    <div>
      {props.name} {props.exercises}
    </div>
  )
}

export default Course
