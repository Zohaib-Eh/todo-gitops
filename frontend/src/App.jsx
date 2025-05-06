import TaskList from './components/Tasks'
import './App.css'

//Making this comment to trigger CICD

function App() {
  return (
    <>
      <div>
        <header className='App-header'>
          <h1>To-Do List</h1>
        </header>
          <TaskList/>
      </div>
    </>
  )
}

export default App
