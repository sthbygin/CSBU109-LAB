import { useState } from 'react';

export default function PostForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAdd({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        textAlign: 'left'
      }}
    >
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>
        New post
      </h3>
      <input 
        type="text"
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        style={{
          width: '100%',
          padding: '10px 14px',
          marginBottom: '12px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          outline: 'none',
          fontSize: '14px'
        }}
      />
      <textarea 
        placeholder="Body" 
        value={body} 
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          padding: '10px 14px',
          marginBottom: '16px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          outline: 'none',
          fontSize: '14px',
          resize: 'vertical'
        }}
      />
      <button 
        type="submit" 
        style={{
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          fontWeight: '600',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Add post
      </button>
    </form>
  );
}