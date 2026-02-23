import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stats from './Stats';
import TicketForm from './TicketForm';
import TicketList from './TicketList';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

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
    // Trigger stats refresh
    setStatsRefreshTrigger(prev => prev + 1);
  };

  // Callback when ticket is updated
  const handleTicketUpdated = () => {
    fetchTickets();
    // Trigger stats refresh
    setStatsRefreshTrigger(prev => prev + 1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        🎫 SmartTicket - AI-Powered Support System
      </h1>
      
      {/* Statistics Dashboard */}
      <Stats refreshTrigger={statsRefreshTrigger} />

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