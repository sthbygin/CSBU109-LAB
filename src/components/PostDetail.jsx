import { useEffect, useState } from 'react';
import { getComments } from '../services/api';

export default function PostDetail({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    if (!post) return;
    const loadComments = async () => {
      setLoadingComments(true);
      try {
        const data = await getComments(post.id);
        setComments(data.comments || []);
      } catch (err) {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };
    loadComments();
  }, [post]);

  if (!post) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '24px',
          textAlign: 'left'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
            {post.title}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Nội dung đầy đủ của bài viết */}
        <p style={{ color: '#334155', lineHeight: '1.6', marginBottom: '20px', fontSize: '15px' }}>
          {post.body}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

        {/* Danh sách bình luận */}
        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
          Comments
        </h4>

        {loadingComments ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>No comments yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {comments.map((comment) => (
              <div 
                key={comment.id}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              >
                <p style={{ fontWeight: '600', color: '#4338ca', fontSize: '13px', marginBottom: '4px' }}>
                  @{comment.user?.username || 'user'}
                </p>
                <p style={{ color: '#475569', fontSize: '14px' }}>
                  {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}