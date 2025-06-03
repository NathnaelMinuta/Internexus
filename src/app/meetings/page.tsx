'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/utils/useLocalStorage';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  attendees?: string;
}

export default function Meetings() {
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showEditMeeting, setShowEditMeeting] = useState(false);
  const [showViewMeeting, setShowViewMeeting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [meetings, setMeetings] = useLocalStorage<Meeting[]>('meetings', [
    {
      id: '1',
      title: 'Weekly 1:1 with Manager',
      description: 'Regular sync-up meeting to discuss progress and challenges',
      date: '2024-06-06',
      startTime: '14:00',
      endTime: '15:00',
      status: 'Confirmed'
    },
    {
      id: '2',
      title: 'Team Sprint Planning',
      description: 'Planning session for the upcoming sprint',
      date: '2024-06-07',
      startTime: '10:00',
      endTime: '11:00',
      status: 'Pending'
    }
  ]);

  const addMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      status: 'Pending',
      attendees: formData.get('attendees') as string
    };
    setMeetings([...meetings, newMeeting]);
    setShowAddMeeting(false);
  };

  const editMeeting = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMeeting) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedMeeting: Meeting = {
      ...selectedMeeting,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      status: formData.get('status') as Meeting['status'],
      attendees: formData.get('attendees') as string || undefined
    };

    setMeetings(meetings.map(m => m.id === selectedMeeting.id ? updatedMeeting : m));
    setShowEditMeeting(false);
    setSelectedMeeting(null);
  };

  const deleteMeeting = (meetingId: string) => {
    if (confirm('Are you sure you want to delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== meetingId));
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

  return (
    <div className="space-y-6">
      {/* Meetings Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-text-primary">Meetings</h2>
        <p className="mt-1 text-text-secondary">Schedule and manage your 1:1s and team meetings.</p>
      </div>

      {/* Calendar Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Upcoming Meetings</h3>
          <button 
            onClick={() => setShowAddMeeting(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            Schedule Meeting
          </button>
        </div>

        <div className="space-y-4">
          {meetings.map(meeting => (
            <div key={meeting.id} className={`border-l-4 pl-4 ${
              meeting.status === 'Confirmed' ? 'border-success' :
              meeting.status === 'Pending' ? 'border-warning' :
              'border-danger'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-text-primary">{meeting.title}</h4>
                  <p className="text-sm text-text-muted">
                    {formatDateTime(meeting.date, meeting.startTime)} - {new Date(`${meeting.date}T${meeting.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </p>
                  {meeting.description && (
                    <p className="text-sm text-text-secondary mt-1">{meeting.description}</p>
                  )}
                  {meeting.attendees && (
                    <p className="text-sm text-text-muted mt-1">Attendees: {meeting.attendees}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-white text-sm rounded-full ${
                    meeting.status === 'Confirmed' ? 'bg-success' :
                    meeting.status === 'Pending' ? 'bg-warning' :
                    'bg-danger'
                  }`}>{meeting.status}</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowViewMeeting(true);
                      }}
                      className="text-primary hover:text-secondary"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setShowEditMeeting(true);
                      }}
                      className="text-warning hover:text-warning-dark"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteMeeting(meeting.id)}
                      className="text-danger hover:text-danger-dark"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Meeting Modal */}
      {showViewMeeting && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-text-primary">{selectedMeeting.title}</h3>
              <span className={`px-2 py-1 text-white text-sm rounded-full ${
                selectedMeeting.status === 'Confirmed' ? 'bg-success' :
                selectedMeeting.status === 'Pending' ? 'bg-warning' :
                'bg-danger'
              }`}>{selectedMeeting.status}</span>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-text-primary">Description</h4>
                <p className="text-text-secondary">{selectedMeeting.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">Date & Time</h4>
                <p className="text-text-secondary">
                  {formatDateTime(selectedMeeting.date, selectedMeeting.startTime)} - {new Date(`${selectedMeeting.date}T${selectedMeeting.endTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>
              </div>
              {selectedMeeting.attendees && (
                <div>
                  <h4 className="font-medium text-text-primary">Attendees</h4>
                  <p className="text-text-secondary">{selectedMeeting.attendees}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowViewMeeting(false);
                  setSelectedMeeting(null);
                }}
                className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditMeeting && selectedMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Edit Meeting</h3>
            <form onSubmit={editMeeting}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedMeeting.title}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedMeeting.description}
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
                      defaultValue={selectedMeeting.date}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={selectedMeeting.status}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={selectedMeeting.startTime}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={selectedMeeting.endTime}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Attendees</label>
                  <input
                    type="text"
                    name="attendees"
                    defaultValue={selectedMeeting.attendees}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter attendee names or emails"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditMeeting(false);
                    setSelectedMeeting(null);
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

      {/* Add Meeting Modal */}
      {showAddMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-text-primary mb-4">Schedule New Meeting</h3>
            <form onSubmit={addMeeting}>
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
                  <label className="block text-sm font-medium text-text-secondary mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
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
                  <label className="block text-sm font-medium text-text-secondary mb-1">Attendees</label>
                  <input
                    type="text"
                    name="attendees"
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Enter attendee names or emails"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddMeeting(false)}
                  className="px-4 py-2 border rounded-md text-text-secondary hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 