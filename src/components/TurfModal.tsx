import { useState, useEffect } from 'react';
import type { Turf } from '../types';
import './TurfModal.css';

interface TurfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (turfData: Omit<Turf, 'id'>, id?: string) => Promise<void>;
  initialData?: Turf | null;
}

export default function TurfModal({ isOpen, onClose, onSave, initialData }: TurfModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    surface: '',
    amenities: '',
    morningPrice: '',
    eveningPrice: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        size: initialData.size,
        surface: initialData.surface,
        amenities: initialData.amenities.join(', '),
        morningPrice: initialData.morningPrice.toString(),
        eveningPrice: initialData.eveningPrice.toString()
      });
    } else {
      setFormData({ name: '', size: '', surface: '', amenities: '', morningPrice: '', eveningPrice: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const turfData = {
      name: formData.name,
      size: formData.size,
      surface: formData.surface,
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(a => a),
      morningPrice: parseInt(formData.morningPrice) || 0,
      eveningPrice: parseInt(formData.eveningPrice) || 0
    };

    try {
      await onSave(turfData, initialData?.id);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to save turf');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content card">
        <div className="modal-header">
          <h2 className="serif">{initialData ? 'Edit Turf' : 'Add New Turf'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Turf Name *</label>
            <input required type="text" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Grand Arena" />
          </div>
          
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Size</label>
              <input type="text" className="form-input" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} placeholder="e.g. 60 x 40 ft" />
            </div>
            <div className="form-group">
              <label className="form-label">Surface Type</label>
              <input type="text" className="form-input" value={formData.surface} onChange={e => setFormData({...formData, surface: e.target.value})} placeholder="e.g. Premium Synthetic" />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Morning Price (₹/hr) *</label>
              <input required type="number" className="form-input" value={formData.morningPrice} onChange={e => setFormData({...formData, morningPrice: e.target.value})} placeholder="900" />
            </div>
            <div className="form-group">
              <label className="form-label">Evening Price (₹/hr) *</label>
              <input required type="number" className="form-input" value={formData.eveningPrice} onChange={e => setFormData({...formData, eveningPrice: e.target.value})} placeholder="1200" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Amenities (Comma separated)</label>
            <input type="text" className="form-input" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} placeholder="Floodlights, Parking, Changing Rooms" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Turf'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
