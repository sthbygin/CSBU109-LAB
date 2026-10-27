import { useState, useEffect } from 'react';
import { getPosts, searchPosts, addPost, deletePost } from '../services/api';
import useDebounce from '../hooks/useDebounce';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';
import PostDetail from '../components/PostDetail';

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = debouncedSearch 
        ? await searchPosts(debouncedSearch) 
        : await getPosts(skip);
      setPosts(data.posts || []);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [skip, debouncedSearch]);

  const handleAdd = async (newPostData) => {
    try {
      const newPost = await addPost(newPostData);
      setPosts([newPost, ...posts]);
    } catch (err) {
      alert('Không thể thêm bài viết');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này không?')) {
      try {
        const res = await deletePost(id);
        if (res.isDeleted) {
          setPosts(posts.filter((p) => p.id !== id));
        }
      } catch (err) {
        alert('Lỗi khi xóa bài viết');
      }
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '0 16px', textAlign: 'left' }}>
      <h1 style={{ color: '#4f46e5', fontSize: '26px', fontWeight: '800', marginBottom: '24px' }}>
        Mini Blog Manager
      </h1>

      <PostForm onAdd={handleAdd} />

      <input 
        type="text" 
        placeholder="Search posts..." 
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setSkip(0);
        }}
        style={{
          width: '100%',
          padding: '12px 16px',
          marginBottom: '20px',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          outline: 'none',
          fontSize: '14px'
        }}
      />

      {loading && <p style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>Đang tải bài viết...</p>}
      {error && <p style={{ color: '#ef4444', textAlign: 'center', margin: '20px 0' }}>{error}</p>}

      {!loading && !error && (
        <>
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              onDelete={handleDelete}
              onView={(p) => setSelectedPost(p)}
            />
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
            <button 
              type="button"
              disabled={skip === 0 || debouncedSearch !== ''} 
              onClick={() => setSkip((prev) => Math.max(0, prev - 10))}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: skip === 0 || debouncedSearch ? '#e2e8f0' : '#ffffff',
                cursor: skip === 0 || debouncedSearch ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <button 
              type="button"
              disabled={debouncedSearch !== '' || posts.length < 10} 
              onClick={() => setSkip((prev) => prev + 10)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: debouncedSearch || posts.length < 10 ? '#e2e8f0' : '#ffffff',
                cursor: debouncedSearch || posts.length < 10 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Hiển thị chi tiết bài viết và bình luận */}
      <PostDetail 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
      />
    </div>
  );
}