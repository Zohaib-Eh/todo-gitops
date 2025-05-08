import React, { useState } from 'react';

const AddTaskForm = ({ addTask }) => {
  const [taskName, setTaskName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskName) {
      addTask(taskName);
      setTaskName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
        data-testid='addTaskForm' 
      />
      <button data-testid='addTask' type="submit">Add Task</button>
    </form>
  );
};

export default AddTaskForm;