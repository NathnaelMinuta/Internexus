'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Notifications, { useNotifications } from '@/components/Notifications';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { FiSun, FiMoon } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import type { ReactNode } from 'react';

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
  const { theme, setTheme } = useTheme();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', [
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

  const [selectedProject, setSelectedProject] = useState<string>('All Projects');
  const [selectedPriority, setSelectedPriority] = useState<string>('All Priorities');

  // Auto-focus on title input when modal opens
  useEffect(() => {
    if (showAddTask && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showAddTask]);

  // Sort tasks by due date
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Calculate task counts
  const taskCounts = {
    dueToday: tasks.filter(task => {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString() && task.status !== 'Completed';
    }).length,
    inProgress: tasks.filter(task => task.status === 'In Progress').length,
    completed: tasks.filter(task => task.status === 'Completed').length
  };

  // Filter tasks based on selected project and priority
  const filteredTasks = sortedTasks.filter(task => {
    const matchesProject = selectedProject === 'All Projects' || task.project === selectedProject;
    const matchesPriority = selectedPriority === 'All Priorities' || task.priority === selectedPriority;
    return matchesProject && matchesPriority;
  });

  // Get unique project names for filter dropdown
  const projectOptions = ['All Projects', ...Array.from(new Set(tasks.map(task => task.project).filter(Boolean)))];

  // Check for upcoming deadlines with timed notifications
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
            type: 'danger',
            duration: 5000
          });
        } else if (diffDays === 1) {
          addNotification({
            message: `Task "${task.title}" is due tomorrow!`,
            type: 'warning',
            duration: 5000
          });
        } else if (diffDays === 2) {
          addNotification({
            message: `Task "${task.title}" is due in 2 days`,
            type: 'info',
            duration: 5000
          });
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [tasks, addNotification]);

  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string || '',
      dueDate: formData.get('dueDate') as string,
      priority: formData.get('priority') as Task['priority'],
      status: 'Not Started',
      project: formData.get('project') as string || undefined
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
    addNotification({
      message: 'New task added successfully!',
      type: 'info',
      duration: 3000
    });
  };

  const updateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    if (newStatus === 'Completed') {
      if (!window.confirm('Are you sure you want to mark this task as completed?')) {
        return;
      }
    }
    
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    addNotification({
      message: `Task status updated to ${newStatus}`,
      type: 'info',
      duration: 3000
    });
  };

  // Function to add emoji to task title
  const addEmojiToTitle = (title: string) => {
    const emojiMap: { [key: string]: string } = {
      'documentation': '📝',
      'meeting': '👥',
      'review': '🔍',
      'design': '🎨',
      'development': '💻',
      'testing': '🧪',
      'deployment': '🚀',
      'bug': '🐛',
      'feature': '✨',
      'urgent': '⚡',
    };

    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (title.toLowerCase().includes(keyword)) {
        return `${emoji} ${title}`;
      }
    }
    return `📌 ${title}`;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  return (
    <div className="space-y-6 dark:bg-gray-900 dark:text-white">
      <Notifications notifications={notifications} onRemove={removeNotification} />
      
      {/* Header with Dark Mode Toggle */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-white">Welcome Back, Nathnael</h2>
          <p className="mt-1 text-text-secondary dark:text-gray-300">Track your internship progress and manage your tasks efficiently.</p>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'dark' ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
        </button>
      </div>

      {/* Task Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Categories */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Due Today</h3>
            <p className="text-3xl font-bold text-danger">{taskCounts.dueToday}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">In Progress</h3>
            <p className="text-3xl font-bold text-warning">{taskCounts.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">Completed</h3>
            <p className="text-3xl font-bold text-success">{taskCounts.completed}</p>
          </div>
        </div>

        {/* Quick Add Task */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full bg-primary text-white rounded-lg py-2 hover:bg-secondary transition-colors"
          >
            + Add New Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary dark:text-white">Current Tasks</h3>
          <div className="flex space-x-2">
            <select 
              className="border dark:border-gray-600 rounded-md px-2 py-1 text-sm text-text-secondary dark:text-gray-300 dark:bg-gray-700"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projectOptions.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <select 
              className="border dark:border-gray-600 rounded-md px-2 py-1 text-sm text-text-secondary dark:text-gray-300 dark:bg-gray-700"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option>All Priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`bg-white dark:bg-gray-700 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-shadow ${
                          snapshot.isDragging ? 'shadow-2xl' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-semibold text-text-primary dark:text-white">
                              {addEmojiToTitle(task.title)}
                            </h4>
                            <p className="text-text-secondary dark:text-gray-300 mt-1">{task.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.priority === 'High' ? 'bg-danger text-white' :
                              task.priority === 'Medium' ? 'bg-warning text-white' :
                              'bg-success text-white'
                            }`}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                              className="border dark:border-gray-600 rounded-md px-2 py-1 text-sm text-text-secondary dark:text-gray-300 dark:bg-gray-700"
                            >
                              <option>Not Started</option>
                              <option>In Progress</option>
                              <option>Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-sm text-text-muted dark:text-gray-400">
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          {task.project && <span>Project: {task.project}</span>}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary dark:text-white mb-4">Add New Task</h3>
            <form onSubmit={addTask}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Title</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    name="title"
                    className="w-full border dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    className="w-full border dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full border dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full border dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Project</label>
                  <input
                    type="text"
                    name="project"
                    className="w-full border dark:border-gray-600 rounded-md px-3 py-2 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 border dark:border-gray-600 rounded-md text-text-secondary dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
