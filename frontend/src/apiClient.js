// API client for MySQL backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Rooms
  async getRooms() {
    return this.request('/rooms');
  }

  async createRoom(room) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async updateRoom(id, updates) {
    return this.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteRoom(id) {
    return this.request(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  // Marriage Halls
  async getMarriageHalls() {
    return this.request('/marriage-halls');
  }

  async createMarriageHall(hall) {
    return this.request('/marriage-halls', {
      method: 'POST',
      body: JSON.stringify(hall),
    });
  }

  async updateMarriageHall(id, updates) {
    return this.request(`/marriage-halls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMarriageHall(id) {
    return this.request(`/marriage-halls/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings() {
    return this.request('/bookings');
  }

  async createBooking(booking) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async updateBooking(id, updates) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBooking(id) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Donations
  async getDonations() {
    return this.request('/donations');
  }

  async createDonation(donation) {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(donation),
    });
  }

  async updateDonation(id, updates) {
    return this.request(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteDonation(id) {
    return this.request(`/donations/${id}`, {
      method: 'DELETE',
    });
  }

  // Gallery
  async getGalleryImages() {
    return this.request('/gallery');
  }

  async createGalleryImage(image) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(image),
    });
  }

  async updateGalleryImage(id, updates) {
    return this.request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteGalleryImage(id) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // Site Content
  async getSiteContent() {
    return this.request('/site-content');
  }

  async upsertSiteContent(key, value) {
    return this.request('/site-content', {
      method: 'POST',
      body: JSON.stringify({ key, value }),
    });
  }

  // Temples
  async getTemples() {
    return this.request('/temples');
  }

  async createTemple(temple) {
    return this.request('/temples', {
      method: 'POST',
      body: JSON.stringify(temple),
    });
  }

  async updateTemple(id, updates) {
    return this.request(`/temples/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTemple(id) {
    return this.request(`/temples/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Auth
  async adminLogin(username, password) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }
}

export const apiClient = new ApiClient();
