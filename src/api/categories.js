import client from './client';

export const getCategories = async () => {
  const response = await client.get('/categories');
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await client.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await client.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await client.delete(`/categories/${id}`);
  return response.data;
};