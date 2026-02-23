import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TicketForm from './TicketForm';
import TicketList from './TicketList';

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
    fetchTickets();
  };

  // Callback when ticket is updated
  const handleTicketUpdated = () => {
    fetchTickets();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>SmartTicket - AI-Powered Support System</h1>
      
      {/* Ticket Submission Form */}
      <TicketForm onTicketCreated={handleTicketCreated} />

      {/* Tickets List with Filters */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <TicketList tickets={tickets} onTicketUpdated={handleTicketUpdated} />
      )}
    </div>
  );
}

export default App;