import React, { useState } from 'react';

const RemoveTaskForm = ({ removeTask }) => {
  const [taskIndex, setTaskIndex] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (taskIndex) {
      removeTask(taskIndex);
      setTaskIndex('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={taskIndex}
        onChange={(e) => setTaskIndex(e.target.value)}
        placeholder="Enter task name"
      />
      <button type="submit">Remove Task</button>
    </form>
  );
};

export default RemoveTaskForm;