import client from './client';

export const getProducts = async (params = {}) => {
  const response = await client.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await client.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await client.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await client.put(`/products/${id}`, productData);
  return response.data;
};


export const deleteProduct = async (id) => {
  const response = await client.delete(`/products/${id}`);
  return response.data;
};


export const downloadProductImage = async (id, filename) => {
  const response = await client.get(`/products/${id}/download-image`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename || `producto-${id}.jpg`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};