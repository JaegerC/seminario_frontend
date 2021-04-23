import axios from 'axios';
import { API_URL } from '../../constants/api';

export async function getProducts() {
  return axios.get(`${API_URL}/product`);
}