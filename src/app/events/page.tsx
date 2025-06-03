'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Tech Talk' | 'Workshop' | 'Networking' | 'Training' | 'Other';
  location: string;
  registrationRequired: boolean;
  maxParticipants?: number;
}

export default function Events() {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showViewEvent, setShowViewEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useLocalStorage<Event[]>('events', [
    {
      id: '1',
      title: 'Intern Tech Talk',
      description: 'Join us for an engaging tech talk about the latest developments in cloud computing.',
      date: '2024-06-10',
      startTime: '14:00',
      endTime: '15:30',
      type: 'Tech Talk',
      location: 'Main Conference Room',
      registrationRequired: true,
      maxParticipants: 50
    },
    {
      id: '2',
      title: 'Networking Mixer',
      description: 'Network with other interns and professionals from various departments.',
      date: '2024-06-15',
      startTime: '16:00',
      endTime: '18:00',
      type: 'Networking',
      location: 'Building A Cafeteria',
      registrationRequired: true,
      maxParticipants: 100
    }
  ]);

  const addEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      type: formData.get('type') as Event['type'],
      location: formData.get('location') as string,
      registrationRequired: formData.get('registrationRequired') === 'true',
      maxParticipants: formData.get('maxParticipants') ? parseInt(formData.get('maxParticipants') as string) : undefined
    };
    setEvents([...events, newEvent]);
    setShowAddEvent(false);
  };

  const editEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedEvent: Event = {
      ...selectedEvent,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      type: formData.get('type') as Event['type'],
      location: formData.get('location') as string,
      registrationRequired: formData.get('registrationRequired') === 'true',
      maxParticipants: formData.get('maxParticipants') ? parseInt(formData.get('maxParticipants') as string) : undefined
    };

    setEvents(events.map(e => e.id === selectedEvent.id ? updatedEvent : e));
    setShowEditEvent(false);
    setSelectedEvent(null);
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'Tech Talk':
        return 'bg-primary';
      case 'Workshop':
        return 'bg-warning';
      case 'Networking':
        return 'bg-secondary';
      case 'Training':
        return 'bg-success';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Events Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-text-primary">Events</h2>
        <p className="mt-1 text-text-secondary">Track intern events, workshops, and networking opportunities.</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div className={`${getEventTypeColor(event.type)} text-white p-4`}>
              <div className="text-sm">{formatDateTime(event.date, event.startTime).split('at')[0]}</div>
              <div className="text-xl font-semibold">{event.title}</div>
            </div>
            <div className="p-4">
              <p className="text-text-secondary mb-4">{event.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-text-muted">
                  <span className="font-medium">Time:</span> {new Date(`${event.date}T${event.startTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(`${event.date}T${event.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
                <p className="text-sm text-text-muted">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                {event.maxParticipants && (
                  <p className="text-sm text-text-muted">
                    <span className="font-medium">Capacity:</span> {event.maxParticipants} participants
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="px-2 py-1 bg-gray-100 text-text-secondary text-sm rounded-full">{event.type}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowViewEvent(true);
                    }}
                    className="text-primary hover:text-secondary"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEditEvent(true);
                    }}
                    className="text-warning hover:text-warning-dark"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteEvent(event.id)}
                    className="text-danger hover:text-danger-dark"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Event Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 flex items-center justify-center">
          <button 
            onClick={() => setShowAddEvent(true)}
            className="text-primary hover:text-secondary flex items-center space-x-2"
          >
            <span className="text-2xl">+</span>
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {/* View Event Modal */}
      {showViewEvent && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-text-primary">{selectedEvent.title}</h3>
              <span className="px-2 py-1 bg-gray-100 text-text-secondary text-sm rounded-full">
                {selectedEvent.type}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary">Description</h4>
                <p className="text-text-secondary">{selectedEvent.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Date & Time</h4>
                <p className="text-text-secondary">
                  {formatDateTime(selectedEvent.date, selectedEvent.startTime)} - {new Date(`${selectedEvent.date}T${selectedEvent.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Location</h4>
                <p className="text-text-secondary">{selectedEvent.location}</p>
              </div>
              {selectedEvent.maxParticipants && (
                <div>
                  <h4 className="font-medium text-text-primary">Capacity</h4>
                  <p className="text-text-secondary">{selectedEvent.maxParticipants} participants</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-text-primary">Registration</h4>
                <p className="text-text-secondary">
                  {selectedEvent.registrationRequired ? 'Registration required' : 'No registration required'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewEvent(false);
                  setSelectedEvent(null);
                }}
                className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditEvent && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Edit Event</h3>
            <form onSubmit={editEvent}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedEvent.title}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedEvent.description}
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={selectedEvent.date}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                    <select
                      name="type"
                      defaultValue={selectedEvent.type}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="Tech Talk">Tech Talk</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Networking">Networking</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={selectedEvent.startTime}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedEvent.endTime}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={selectedEvent.location}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Registration Required</label>
                    <select
                      name="registrationRequired"
                      defaultValue={selectedEvent.registrationRequired.toString()}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      defaultValue={selectedEvent.maxParticipants}
                      className="w-full border rounded-md px-3 py-2"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditEvent(false);
                    setSelectedEvent(null);
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

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New Event</h3>
            <form onSubmit={addEvent}>
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
                    <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                    <select
                      name="type"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="Tech Talk">Tech Talk</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Networking">Networking</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Registration Required</label>
                    <select
                      name="registrationRequired"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      className="w-full border rounded-md px-3 py-2"
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 