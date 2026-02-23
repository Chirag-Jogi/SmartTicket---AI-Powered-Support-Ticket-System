import React, { useState } from 'react';
import axios from 'axios';

function TicketForm({ onTicketCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });

  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // AI Classification
  const handleGetAISuggestion = async () => {
    if (!formData.description.trim()) {
      alert('Please enter a description first!');
      return;
    }

    setClassifying(true);
    setError(null);
    setAiSuggestion(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/tickets/classify/',
        { description: formData.description }
      );

      // AI suggestion received
      const { suggested_category, suggested_priority } = response.data;

      setAiSuggestion({
        category: suggested_category,
        priority: suggested_priority
      });

      // Auto-fill the dropdowns
      setFormData({
        ...formData,
        category: suggested_category,
        priority: suggested_priority
      });

    } catch (err) {
      console.error('AI classification error:', err);
      setError('AI suggestion failed. You can still submit manually.');
    } finally {
      setClassifying(false);
    }
  };

  // Submit Ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/tickets/',
        formData
      );

      setSuccess(true);
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium'
      });
      setAiSuggestion(null);

      if (onTicketCreated) {
        onTicketCreated(response.data);
      }

    } catch (err) {
      setError(err.response?.data || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
      <h2>Submit a Ticket</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Title: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength="200"
            required
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            placeholder="Brief summary of the issue"
          />
          <small>{formData.title.length}/200 characters</small>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Description: <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            placeholder="Detailed description of the problem"
          />
        </div>

        {/* AI Suggestion Button */}
        <div style={{ marginBottom: '15px' }}>
          <button
            type="button"
            onClick={handleGetAISuggestion}
            disabled={classifying || !formData.description.trim()}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: classifying ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              cursor: classifying ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            {classifying ? '🤖 Analyzing...' : '🤖 Get AI Suggestion'}
          </button>
          
          {aiSuggestion && (
            <span style={{ color: '#28a745', fontSize: '14px' }}>
              ✅ AI suggested: {aiSuggestion.category} / {aiSuggestion.priority}
            </span>
          )}
        </div>

        {/* Category */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Category: <span style={{ color: 'red' }}>*</span>
            {aiSuggestion && <span style={{ color: '#28a745', fontSize: '12px' }}> (AI suggested)</span>}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '14px',
              backgroundColor: aiSuggestion ? '#d4edda' : 'white'
            }}
          >
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Priority: <span style={{ color: 'red' }}>*</span>
            {aiSuggestion && <span style={{ color: '#28a745', fontSize: '12px' }}> (AI suggested)</span>}
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              fontSize: '14px',
              backgroundColor: aiSuggestion ? '#d4edda' : 'white'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <small style={{ color: '#666' }}>You can change AI suggestions if needed</small>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>
            ✅ Ticket created successfully!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
            ❌ Error: {JSON.stringify(error)}
          </div>
        )}
      </form>
    </div>
  );
}

export default TicketForm;