import { useState } from 'react';
import useRubberBand from '../hooks/useRubberBand.js';

export default function TaskManager({ tasks, onAdd, onComplete, onDelete }) {
  const [value, setValue] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const rubberRef = useRubberBand();

  const submit = () => {
    onAdd(value);
    setValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <section id="main-section" className="hero-block">
      <div className="container rubber" ref={rubberRef}>
        <h2>My Task List</h2>

        <div className="input-group">
          <input
            type="text"
            id="taskInput"
            placeholder="Add a new task..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="addBtn" onClick={submit}>Add Task</button>
          <button
            className={`toggle-btn${collapsed ? ' collapsed' : ''}`}
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label="Toggle task list"
          >
            <span className="arrow-icon">▼</span>
          </button>
        </div>

        <ul id="taskList" className={collapsed ? 'hidden' : undefined}>
          {tasks.map((task) => (
            <li key={task.id}>
              <span className="task-text">{task.text}</span>
              <div className="task-actions">
                <button
                  className="complete-btn"
                  title="Complete task"
                  onClick={() => onComplete(task.id)}
                >
                  ✔
                </button>
                <button
                  className="delete-btn"
                  title="Delete task"
                  onClick={() => onDelete(task.id)}
                >
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
