'use client';

import { useState, useEffect } from 'react';
import Notifications, { useNotifications } from '@/components/Notifications';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  project?: string;
}

export default function Dashboard() {
  const [showAddTask, setShowAddTask] = useState(false);
  const { notifications, addNotification, removeNotification } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Project Documentation',
      description: 'Complete the documentation for the current sprint',
      dueDate: '2024-03-25',
      priority: 'High',
      status: 'In Progress',
      project: 'Sprint 1'
    }
  ]);

  // Check for upcoming deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      tasks.forEach(task => {
        if (task.status === 'Completed') return;
        
        const dueDate = new Date(task.dueDate);
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          addNotification({
            message: `Task "${task.title}" is due today!`,
            type: 'danger'
          });
        } else if (diffDays === 1) {
          addNotification({
            message: `Task "${task.title}" is due tomorrow!`,
            type: 'warning'
          });
        } else if (diffDays === 2) {
          addNotification({
            message: `Task "${task.title}" is due in 2 days`,
            type: 'info'
          });
        }
      });
    };

    // Check deadlines immediately and then every hour
    checkDeadlines();
    const interval = setInterval(checkDeadlines, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, [tasks, addNotification]);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowAddTask(false);
    addNotification({
      message: 'New task added successfully!',
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      <Notifications notifications={notifications} onRemove={removeNotification} />
      {/* Welcome Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-text-primary">Welcome Back, Nathnael</h2>
        <p className="mt-1 text-text-secondary">Track your internship progress and manage your tasks efficiently.</p>
      </div>

      {/* Task Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Categories */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Due Today</h3>
            <p className="text-3xl font-bold text-danger">2</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-text-primary mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-warning">3</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-text-primary mb-2">Completed</h3>
            <p className="text-3xl font-bold text-success">5</p>
          </div>
        </div>

        {/* Quick Add Task */}
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full bg-primary text-white rounded-lg py-2 hover:bg-secondary transition-colors"
          >
            + Add New Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary">Current Tasks</h3>
          <div className="flex space-x-2">
            <select className="border rounded-md px-2 py-1 text-sm text-text-secondary">
              <option>All Projects</option>
              <option>Sprint 1</option>
              <option>Documentation</option>
            </select>
            <select className="border rounded-md px-2 py-1 text-sm text-text-secondary">
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-text-primary">{task.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    task.priority === 'High' ? 'bg-danger text-white' :
                    task.priority === 'Medium' ? 'bg-warning text-white' :
                    'bg-success text-white'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-text-muted mt-1">{task.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-text-secondary">
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  {task.project && <span>Project: {task.project}</span>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="border rounded-md px-2 py-1 text-sm bg-white"
                  value={task.status}
                  onChange={(e) => {
                    const newTasks = tasks.map(t =>
                      t.id === task.id ? { ...t, status: e.target.value as Task['status'] } : t
                    );
                    setTasks(newTasks);
                  }}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New Task</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              addTask({
                id: Date.now().toString(),
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                dueDate: formData.get('dueDate') as string,
                priority: formData.get('priority') as Task['priority'],
                status: 'Not Started',
                project: formData.get('project') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Priority</label>
                    <select
                      name="priority"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Project</label>
                  <input
                    type="text"
                    name="project"
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 