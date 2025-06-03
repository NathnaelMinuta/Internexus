'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';

interface Project {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export default function Projects() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showViewProject, setShowViewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', [
    {
      id: '1',
      title: 'Sprint 1 Documentation',
      description: 'Complete documentation for current sprint features and implementations.',
      dueDate: '2024-06-15',
      status: 'In Progress'
    }
  ]);

  const addProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      status: 'Not Started'
    };
    setProjects([...projects, newProject]);
    setShowAddProject(false);
  };

  const editProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedProject: Project = {
      ...selectedProject,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      status: formData.get('status') as Project['status']
    };

    setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
    setShowEditProject(false);
    setSelectedProject(null);
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Projects Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-text-primary">Projects</h2>
        <p className="mt-1 text-text-secondary">Manage and track your internship projects.</p>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
              <span className={`px-2 py-1 text-white text-sm rounded-full ${
                project.status === 'Not Started' ? 'bg-danger' :
                project.status === 'In Progress' ? 'bg-warning' :
                'bg-success'
              }`}>{project.status}</span>
            </div>
            <p className="mt-2 text-text-secondary">{project.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-text-muted">Due: {new Date(project.dueDate).toLocaleDateString()}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setSelectedProject(project);
                    setShowViewProject(true);
                  }}
                  className="text-primary hover:text-secondary"
                >
                  View Details
                </button>
                <button 
                  onClick={() => {
                    setSelectedProject(project);
                    setShowEditProject(true);
                  }}
                  className="text-warning hover:text-warning-dark"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-danger hover:text-danger-dark"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Project Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex items-center justify-center">
          <button 
            onClick={() => setShowAddProject(true)}
            className="text-primary hover:text-secondary flex items-center space-x-2"
          >
            <span className="text-2xl">+</span>
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* View Project Modal */}
      {showViewProject && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-text-primary">{selectedProject.title}</h3>
              <span className={`px-2 py-1 text-white text-sm rounded-full ${
                selectedProject.status === 'Not Started' ? 'bg-danger' :
                selectedProject.status === 'In Progress' ? 'bg-warning' :
                'bg-success'
              }`}>{selectedProject.status}</span>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary">Description</h4>
                <p className="text-text-secondary">{selectedProject.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Due Date</h4>
                <p className="text-text-secondary">
                  {new Date(selectedProject.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewProject(false);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProject && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Edit Project</h3>
            <form onSubmit={editProject}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedProject.title}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedProject.description}
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    defaultValue={selectedProject.dueDate}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedProject.status}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProject(false);
                    setSelectedProject(null);
                  }}
                  className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New Project</h3>
            <form onSubmit={addProject}>
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
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 