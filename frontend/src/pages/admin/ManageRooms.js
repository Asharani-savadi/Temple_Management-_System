import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../../apiClient';
import AdminNavbar from '../../components/AdminNavbar';
import './AdminManage.css';
import './ManageRooms.css';

const BACKEND = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '');

const emptyForm = {
  name: '', type: '', price: '', total: '',
  lift: false, floor: '', occupancy: '', commode_type: '', ac: false
};

// ─── Gallery / Photo Manager ──────────────────────────────────────────────────
function PhotoGallery({ room, onClose }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index
  const fileRef = useRef();

  const load = useCallback(async () => {
    try {
      const res = await apiClient.getRoomPhotos(room.id);
      setPhotos(res.data || []);
    } catch (e) { console.error(e); }
  }, [room.id]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      await apiClient.uploadRoomPhotos(room.id, files);
      await load();
    } catch (err) { alert('Upload failed: ' + err.message); }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSetPrimary = async (photoId) => {
    try {
      await apiClient.setRoomPhotoPrimary(room.id, photoId);
      await load();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await apiClient.deleteRoomPhoto(room.id, photoId);
      await load();
      if (lightbox !== null && photos[lightbox]?.id === photoId) setLightbox(null);
    } catch (e) { alert('Failed: ' + e.message); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="photo-gallery-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="gallery-modal-header">
          <div>
            <h2>📷 {room.name}</h2>
            <p className="gallery-subtitle">{room.type} — {photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
          </div>
          <button className="gallery-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Upload bar */}
        <div className="gallery-upload-bar">
          <label className={`gallery-upload-btn ${uploading ? 'uploading' : ''}`}>
            {uploading ? (
              <><span className="spinner" /> Uploading…</>
            ) : (
              <><span>+</span> Add Photos</>
            )}
            <input ref={fileRef} type="file" accept="image/*" multiple hidden
              onChange={handleUpload} disabled={uploading} />
          </label>
          <span className="gallery-upload-hint">Select single or multiple images (JPG, PNG, WEBP · max 5MB each)</span>
        </div>

        {/* Photo grid */}
        {photos.length === 0 ? (
          <div className="gallery-empty">
            <div className="gallery-empty-icon">🏨</div>
            <p>No photos yet</p>
            <p className="gallery-empty-sub">Click "Add Photos" to upload room images</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {photos.map((p, idx) => (
              <div key={p.id} className={`gallery-item ${p.is_primary ? 'is-primary' : ''}`}>
                <div className="gallery-img-wrap" onClick={() => setLightbox(idx)}>
                  <img src={`${BACKEND}${p.photo_url}`} alt={`Room ${idx + 1}`} />
                  {p.is_primary && <span className="gallery-primary-badge">★ Featured</span>}
                  <div className="gallery-img-overlay">
                    <span>View</span>
                  </div>
                </div>
                <div className="gallery-item-actions">
                  {!p.is_primary && (
                    <button className="gal-btn gal-btn-star" title="Set as featured"
                      onClick={() => handleSetPrimary(p.id)}>★ Set Featured</button>
                  )}
                  <button className="gal-btn gal-btn-del" title="Delete"
                    onClick={() => handleDelete(p.id)}>🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightbox !== null && photos[lightbox] && (
          <div className="lightbox" onClick={() => setLightbox(null)}>
            <button className="lightbox-prev"
              onClick={e => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }}>‹</button>
            <img src={`${BACKEND}${photos[lightbox].photo_url}`} alt="full" onClick={e => e.stopPropagation()} />
            <button className="lightbox-next"
              onClick={e => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }}>›</button>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <div className="lightbox-counter">{lightbox + 1} / {photos.length}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Room Form ────────────────────────────────────────────────────────────────
function RoomFormModal({ title, formData, onChange, onSubmit, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Room / Block Name *</label>
            <input name="name" placeholder="e.g. Dheerendra Vasathi Gruha"
              value={formData.name} onChange={onChange} required />
          </div>
          <div className="form-group">
            <label>Room Type *</label>
            <input name="type" placeholder="e.g. NON-AC | 2-Occupancy | First Floor"
              value={formData.type} onChange={onChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price per night (₹) *</label>
              <input name="price" type="number" min="0" placeholder="500"
                value={formData.price} onChange={onChange} required />
            </div>
            <div className="form-group">
              <label>Total rooms *</label>
              <input name="total" type="number" min="1" placeholder="10"
                value={formData.total} onChange={onChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Floor</label>
              <input name="floor" placeholder="Ground Floor / First Floor"
                value={formData.floor} onChange={onChange} />
            </div>
            <div className="form-group">
              <label>Occupancy</label>
              <input name="occupancy" placeholder="2-Occupancy"
                value={formData.occupancy} onChange={onChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Commode Type</label>
            <select name="commode_type" value={formData.commode_type} onChange={onChange}>
              <option value="">Select</option>
              <option value="Western">Western</option>
              <option value="Indian">Indian</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="ac" checked={formData.ac} onChange={onChange} />
              <span>AC Available</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="lift" checked={formData.lift} onChange={onChange} />
              <span>Lift Available</span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-action btn-view">Save Room</button>
            <button type="button" className="btn-action btn-delete" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomPhotos, setRoomPhotos] = useState({}); // { roomId: [photos] }
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [galleryRoom, setGalleryRoom] = useState(null);

  // Load flat rooms directly from API
  const loadRooms = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getRooms();
      const flat = Array.isArray(data) ? data : [];
      setRooms(flat);
      // Load photos for each room
      const photoMap = {};
      await Promise.all(flat.map(async r => {
        try {
          const res = await apiClient.getRoomPhotos(r.id);
          photoMap[r.id] = res.data || [];
        } catch (e) { photoMap[r.id] = []; }
      }));
      setRoomPhotos(photoMap);
    } catch (e) {
      console.error(e);
      setRooms([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAdd = () => { setFormData(emptyForm); setShowAddModal(true); };

  const handleEdit = (room) => {
    setCurrentRoom(room);
    setFormData({
      name: room.name || '', type: room.type || '', price: room.price || '',
      total: room.total || '', lift: !!room.lift, floor: room.floor || '',
      occupancy: room.occupancy || '', commode_type: room.commode_type || '',
      ac: !!room.ac
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room and all its photos?')) return;
    try {
      await apiClient.deleteRoom(id);
      await loadRooms();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createRoom({
        name: formData.name, type: formData.type,
        price: parseInt(formData.price) || 0,
        total: parseInt(formData.total) || 0,
        available: parseInt(formData.total) || 0,
        lift: formData.lift, floor: formData.floor,
        occupancy: formData.occupancy, commode_type: formData.commode_type,
        ac: formData.ac, image: null
      });
      setShowAddModal(false);
      await loadRooms();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.updateRoom(currentRoom.id, {
        name: formData.name, type: formData.type,
        price: parseInt(formData.price) || 0,
        total: parseInt(formData.total) || 0,
        available: parseInt(formData.total) || 0,
        lift: formData.lift, floor: formData.floor,
        occupancy: formData.occupancy, commode_type: formData.commode_type,
        ac: formData.ac
      });
      setShowEditModal(false);
      await loadRooms();
    } catch (e) { alert('Failed: ' + e.message); }
  };

  const totalRooms = rooms.reduce((s, r) => s + (r.total || 0), 0);
  const availableRooms = rooms.reduce((s, r) => s + (r.available || 0), 0);

  return (
    <div className="admin-manage-page">
      <AdminNavbar />
      <div className="manage-page-header"><h1>Manage Rooms</h1></div>

      <div className="manage-container">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box"><h3>Room Types</h3><p className="stat-value">{rooms.length}</p></div>
          <div className="stat-box"><h3>Total Rooms</h3><p className="stat-value">{totalRooms}</p></div>
          <div className="stat-box"><h3>Available</h3><p className="stat-value">{availableRooms}</p></div>
          <div className="stat-box"><h3>Occupied</h3><p className="stat-value">{totalRooms - availableRooms}</p></div>
        </div>

        {/* Header + Add button */}
        <div className="management-section">
          <h2>Room Listings</h2>
          <button className="btn-add" onClick={handleAdd}>+ Add Room</button>
        </div>

        {/* Room cards */}
        {loading ? (
          <div className="rooms-loading">Loading rooms…</div>
        ) : rooms.length === 0 ? (
          <div className="rooms-empty">
            <div style={{ fontSize: '3rem' }}>🏨</div>
            <p>No rooms yet. Click "+ Add Room" to create one.</p>
          </div>
        ) : (
          <div className="rooms-card-grid">
            {rooms.map(room => {
              const photos = roomPhotos[room.id] || [];
              const featured = photos.find(p => p.is_primary) || photos[0];
              return (
                <div key={room.id} className="room-card">
                  {/* Photo thumbnail */}
                  <div className="room-card-thumb" onClick={() => setGalleryRoom(room)}>
                    {featured ? (
                      <img src={`${BACKEND}${featured.photo_url}`} alt={room.name} />
                    ) : (
                      <div className="room-card-no-photo">
                        <span>🏨</span>
                        <p>No photos</p>
                      </div>
                    )}
                    <div className="room-card-thumb-overlay">
                      <span>📷 {photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
                    </div>
                    {photos.length > 1 && (
                      <div className="room-thumb-strip">
                        {photos.slice(0, 4).map((p, i) => (
                          <img key={p.id} src={`${BACKEND}${p.photo_url}`} alt="" className="thumb-strip-img" />
                        ))}
                        {photos.length > 4 && <span className="thumb-more">+{photos.length - 4}</span>}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="room-card-body">
                    <div className="room-card-title-row">
                      <h3>{room.name}</h3>
                      <span className="room-price">₹{room.price}<small>/night</small></span>
                    </div>
                    <p className="room-type-label">{room.type}</p>
                    <div className="room-availability">
                      <div className="avail-bar">
                        <div className="avail-fill"
                          style={{ width: `${room.total ? (room.available / room.total) * 100 : 0}%` }} />
                      </div>
                      <span>{room.available}/{room.total} available</span>
                    </div>
                    <div className="room-tags">
                      {room.ac && <span className="tag tag-ac">AC</span>}
                      {room.lift && <span className="tag tag-lift">Lift</span>}
                      {room.floor && <span className="tag">{room.floor}</span>}
                      {room.occupancy && <span className="tag">{room.occupancy}</span>}
                      {room.commode_type && <span className="tag">{room.commode_type} Commode</span>}
                    </div>
                    <div className="room-card-actions">
                      <button className="room-btn room-btn-gallery" onClick={() => setGalleryRoom(room)}>
                        📷 Gallery
                      </button>
                      <button className="room-btn room-btn-edit" onClick={() => handleEdit(room)}>
                        ✏ Edit
                      </button>
                      <button className="room-btn room-btn-delete" onClick={() => handleDelete(room.id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Photo Gallery Modal */}
      {galleryRoom && (
        <PhotoGallery
          room={galleryRoom}
          onClose={async () => {
            // Refresh photos for this room on close
            try {
              const res = await apiClient.getRoomPhotos(galleryRoom.id);
              setRoomPhotos(prev => ({ ...prev, [galleryRoom.id]: res.data || [] }));
            } catch (e) {}
            setGalleryRoom(null);
          }}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <RoomFormModal title="Add New Room" formData={formData}
          onChange={handleChange} onSubmit={handleSubmitAdd}
          onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <RoomFormModal title="Edit Room" formData={formData}
          onChange={handleChange} onSubmit={handleSubmitEdit}
          onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
}

export default ManageRooms;
