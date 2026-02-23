import React, { useState } from 'react';
import axios from 'axios';

function TicketList({ tickets, onTicketUpdated }) {
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    search: ''
  });

  const [updatingTicket, setUpdatingTicket] = useState(null);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingTicket(ticketId);

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/tickets/${ticketId}/`,
        { status: newStatus }
      );

      // Notify parent to refresh
      if (onTicketUpdated) {
        onTicketUpdated();
      }

    } catch (err) {
      console.error('Failed to update ticket:', err);
      alert('Failed to update ticket status');
    } finally {
      setUpdatingTicket(null);
    }
  };

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter(ticket => {
    // Category filter
    if (filters.category && ticket.category !== filters.category) {
      return false;
    }

    // Priority filter
    if (filters.priority && ticket.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status && ticket.status !== filters.status) {
      return false;
    }

    // Search filter (title or description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const titleMatch = ticket.title.toLowerCase().includes(searchLower);
      const descMatch = ticket.description.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch) {
        return false;
      }
    }

    return true;
  });

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px' }}>
      <h2>Tickets ({filteredTickets.length})</h2>

      {/* Filters */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', border: '1px solid #ddd' }}>
        <h3 style={{ marginTop: 0 }}>Filters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            >
              <option value="">All Categories</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Priority
            </label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search title or description"
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filters.category || filters.priority || filters.status || filters.search) && (
          <button
            onClick={() => setFilters({ category: '', priority: '', status: '', search: '' })}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Tickets List */}
      {filteredTickets.length === 0 ? (
        <p>No tickets match your filters.</p>
      ) : (
        filteredTickets.map(ticket => (
          <div
            key={ticket.id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            {/* Ticket Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>
                #{ticket.id} - {ticket.title}
              </h3>
              
              {/* Status Selector */}
              <div>
                <label style={{ fontSize: '12px', marginRight: '5px' }}>Status:</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  disabled={updatingTicket === ticket.id}
                  style={{
                    padding: '5px',
                    fontSize: '14px',
                    backgroundColor: updatingTicket === ticket.id ? '#ccc' : 'white',
                    cursor: updatingTicket === ticket.id ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Ticket Description */}
            <p style={{ margin: '10px 0', color: '#333' }}>
              {ticket.description}
            </p>

            {/* Ticket Metadata */}
            <div style={{ fontSize: '14px', color: '#666' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  marginRight: '10px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '3px'
                }}
              >
                <strong>Category:</strong> {ticket.category}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  marginRight: '10px',
                  backgroundColor: 
                    ticket.priority === 'critical' ? '#dc3545' :
                    ticket.priority === 'high' ? '#fd7e14' :
                    ticket.priority === 'medium' ? '#ffc107' : '#28a745',
                  color: 'white',
                  borderRadius: '3px'
                }}
              >
                <strong>Priority:</strong> {ticket.priority}
              </span>
              <span style={{ marginLeft: '10px', color: '#999' }}>
                <strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TicketList;