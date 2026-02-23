import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketForm from './TicketForm';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets from backend
  const fetchTickets = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/tickets/')
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to connect to backend');
        setLoading(false);
      });
  };

  // Load tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Callback when new ticket is created
  const handleTicketCreated = (newTicket) => {
    // Refresh ticket list
    fetchTickets();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>SmartTicket - Support Ticket System</h1>
      
      {/* Ticket Submission Form */}
      <TicketForm onTicketCreated={handleTicketCreated} />

      {/* Tickets List */}
      <div style={{ border: '1px solid #ddd', padding: '20px' }}>
        <h2>All Tickets ({tickets.length})</h2>
        
        {loading && <p>Loading tickets...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && tickets.length === 0 && (
          <p>No tickets yet. Submit one above!</p>
        )}

        {tickets.map(ticket => (
          <div 
            key={ticket.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '15px', 
              marginBottom: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>#{ticket.id} - {ticket.title}</h3>
            <p>{ticket.description}</p>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <span style={{ marginRight: '15px' }}>
                <strong>Category:</strong> {ticket.category}
              </span>
              <span style={{ marginRight: '15px' }}>
                <strong>Priority:</strong> {ticket.priority}
              </span>
              <span style={{ marginRight: '15px' }}>
                <strong>Status:</strong> {ticket.status}
              </span>
              <span>
                <strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
