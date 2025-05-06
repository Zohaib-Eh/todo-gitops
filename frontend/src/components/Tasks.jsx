import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddTaskForm from './AddTaskForm';
import RemoveTaskForm from './RemoveTaskForm.jsx';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const addTask = async (taskName) => {
    try {
      await api.post('/addtasks', { name: taskName });
      fetchTasks();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding tasks", error);
    }
  };

  const removeTask = async (taskIndex) => {
    try {
      await api.post('/removetasks', { index: taskIndex });
      fetchTasks();  // Refresh the list after adding a fruit
    } catch (error) {
      console.error("Error adding tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Task List</h2>
      <ol>
        {tasks.map((task, index) => (
          <li key={index}>{task.name}</li>
        ))}
      </ol>
      <AddTaskForm addTask={addTask} />
      <RemoveTaskForm removeTask={removeTask} />
    </div>
  );
};

export default TaskList;