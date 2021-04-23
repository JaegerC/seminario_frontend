import axios from 'axios';
import { API_URL } from '../../constants/api'

export async function getClients() {
  return await axios.get(`${API_URL}/client`);
}

export async function getClientData(id) {
  return await axios.get(`${API_URL}/client/${id}`);
}