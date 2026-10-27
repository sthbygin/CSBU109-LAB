export default function PostItem({ post, onDelete, onView }) {
  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px',
        textAlign: 'left'
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>
        {post.title}
      </h3>
      
      {/* Danh sách Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {post.tags?.map((tag) => (
          <span 
            key={tag} 
            style={{
              color: '#3b82f6',
              backgroundColor: '#eff6ff',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Số lượt Reactions */}
      <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>👍 {post.reactions?.likes ?? post.reactions ?? 0}</span>
        <span>-</span>
        <span>👎 {post.reactions?.dislikes ?? 0}</span>
      </div>

      {/* Hành động View / Delete */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          type="button"
          onClick={() => onView && onView(post)}
          style={{
            backgroundColor: '#e0e7ff',
            color: '#4338ca',
            fontWeight: '600',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          View
        </button>
        <button 
          type="button"
          onClick={() => onDelete(post.id)}
          style={{
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontWeight: '600',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}