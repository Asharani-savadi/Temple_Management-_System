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

  // User Auth
  async userRegister(name, email, phone, password) {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
  }

  async userLogin(email, password) {
    return this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getUserProfile(id) {
    return this.request(`/user/profile/${id}`);
  }

  async updateUserProfile(id, updates) {
    return this.request(`/user/profile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Audio Tracks
  async getAudioTracks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/audio-tracks?${queryString}` : '/audio-tracks';
    return this.request(endpoint);
  }

  async incrementPlayCount(trackId) {
    return this.request(`/audio-tracks/${trackId}/play`, {
      method: 'PUT',
    });
  }

  async createAudioTrack(track) {
    return this.request('/audio-tracks', {
      method: 'POST',
      body: JSON.stringify(track),
    });
  }

  async updateAudioTrack(id, updates) {
    return this.request(`/audio-tracks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAudioTrack(id) {
    return this.request(`/audio-tracks/${id}`, {
      method: 'DELETE',
    });
  }

  // Room Photos
  async getRoomPhotos(roomId) {
    return this.request(`/rooms/${roomId}/photos`);
  }

  async uploadRoomPhotos(roomId, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('photos', file));
    const url = `${API_URL}/rooms/${roomId}/photos`;
    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload failed');
    }
    return response.json();
  }

  async setRoomPhotoPrimary(roomId, photoId) {
    return this.request(`/rooms/${roomId}/photos/${photoId}/primary`, { method: 'PUT' });
  }

  async deleteRoomPhoto(roomId, photoId) {
    return this.request(`/rooms/${roomId}/photos/${photoId}`, { method: 'DELETE' });
  }

  async getRoomsWithPhotos() {
    return this.request('/rooms-with-photos');
  }

  // Darshan Bookings
  async getDarshanTypes() {
    return this.request('/darshan-types');
  }

  async getDarshanSlots(date, type) {
    return this.request(`/darshan-slots?date=${date}&type=${type}`);
  }

  async createDarshanBooking(bookingData) {
    return this.request('/darshan-bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getDarshanBooking(reference) {
    return this.request(`/darshan-bookings/${reference}`);
  }

  async getDarshanBookingsByPhone(phone) {
    return this.request(`/darshan-bookings-by-phone/${phone}`);
  }

  async updateDarshanBooking(id, updates) {
    return this.request(`/darshan-bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async cancelDarshanBooking(id) {
    return this.request(`/darshan-bookings/${id}/cancel`, {
      method: 'PUT',
    });
  }

  // Admin Darshan Endpoints
  async getAdminDarshanBookings(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/admin/darshan-bookings?${queryString}` : '/admin/darshan-bookings';
    return this.request(endpoint);
  }

  async checkInDarshanBooking(id) {
    return this.request(`/admin/darshan-bookings/${id}/checkin`, {
      method: 'PUT',
    });
  }

  async getDarshanStats(date = null) {
    const endpoint = date ? `/admin/darshan-stats?date=${date}` : '/admin/darshan-stats';
    return this.request(endpoint);
  }
}

export const apiClient = new ApiClient();
