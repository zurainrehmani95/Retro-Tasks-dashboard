import { useCallback, useReducer } from 'react';
import Navbar from './components/Navbar.jsx';
import VaporBackground from './components/VaporBackground.jsx';
import TaskManager from './components/TaskManager.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import RadioPlayer from './components/RadioPlayer.jsx';
import Arcade from './components/Arcade.jsx';
import Archive from './components/Archive.jsx';

const initialState = { tasks: [], archive: [], nextId: 1 };

// Pure reducer keeps task/archive state consistent (and StrictMode-safe).
function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const text = action.text.trim();
      if (text === '') return state;
      return {
        ...state,
        tasks: [...state.tasks, { id: state.nextId, text }],
        nextId: state.nextId + 1,
      };
    }
    case 'DELETE':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'COMPLETE': {
      const target = state.tasks.find((t) => t.id === action.id);
      if (!target) return state;
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
        archive: [...state.archive, { ...target, time: action.time }],
      };
    }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  const addTask = useCallback((text) => dispatch({ type: 'ADD', text }), []);
  const deleteTask = useCallback((id) => dispatch({ type: 'DELETE', id }), []);
  const completeTask = useCallback((id) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dispatch({ type: 'COMPLETE', id, time });
  }, []);

  const completedCount = state.archive.length;
  const pendingCount = state.tasks.length;
  const totalCount = completedCount + pendingCount;

  return (
    <>
      <Navbar />
      <VaporBackground>
        <TaskManager
          tasks={state.tasks}
          onAdd={addTask}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
        <StatsPanel
          completed={completedCount}
          pending={pendingCount}
          total={totalCount}
        />
        <RadioPlayer />
        <Arcade />
        <Archive archive={state.archive} />
        <div className="wireframe-grid" />
      </VaporBackground>
    </>
  );
}
