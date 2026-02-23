import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Stats({ refreshTrigger }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/tickets/stats/')
      .then(response => {
        setStats(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load statistics');
        setLoading(false);
      });
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh when parent triggers
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchStats();
    }
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
        <h2>Statistics</h2>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
        <h2>Statistics</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
      <h2>Statistics Dashboard</h2>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        {/* Total Tickets */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.total_tickets}</div>
          <div style={{ fontSize: '16px' }}>Total Tickets</div>
        </div>

        {/* Open Tickets */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.open_tickets}</div>
          <div style={{ fontSize: '16px' }}>Open Tickets</div>
        </div>

        {/* Avg Per Day */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#17a2b8', 
          color: 'white', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.avg_tickets_per_day}</div>
          <div style={{ fontSize: '16px' }}>Avg Tickets/Day</div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Priority Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {/* Critical */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.priority_breakdown.critical}
            </div>
            <div style={{ fontSize: '14px' }}>Critical</div>
          </div>

          {/* High */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fd7e14', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.priority_breakdown.high}
            </div>
            <div style={{ fontSize: '14px' }}>High</div>
          </div>

          {/* Medium */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#ffc107', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.priority_breakdown.medium}
            </div>
            <div style={{ fontSize: '14px' }}>Medium</div>
          </div>

          {/* Low */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.priority_breakdown.low}
            </div>
            <div style={{ fontSize: '14px' }}>Low</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h3>Category Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {/* Billing */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#6f42c1', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.category_breakdown.billing}
            </div>
            <div style={{ fontSize: '14px' }}>Billing</div>
          </div>

          {/* Technical */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#e83e8c', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.category_breakdown.technical}
            </div>
            <div style={{ fontSize: '14px' }}>Technical</div>
          </div>

          {/* Account */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#20c997', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.category_breakdown.account}
            </div>
            <div style={{ fontSize: '14px' }}>Account</div>
          </div>

          {/* General */}
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
              {stats.category_breakdown.general}
            </div>
            <div style={{ fontSize: '14px' }}>General</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;