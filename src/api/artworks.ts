import axios from 'axios';

const API_BASE_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};