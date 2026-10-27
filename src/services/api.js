const BASE_URL = 'https://dummyjson.com/posts';

export const getPosts = async (skip = 0) => {
  const res = await fetch(`${BASE_URL}?limit=10&skip=${skip}`);
  return res.json();
};

export const searchPosts = async (keyword) => {
  const res = await fetch(`${BASE_URL}/search?q=${keyword}`);
  return res.json();
};

export const getComments = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/comments`);
  return res.json();
};

export const addPost = async (postData) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...postData, userId: 1 }),
  });
  return res.json();
};

export const deletePost = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};