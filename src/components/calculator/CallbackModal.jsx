import React, { useState } from 'react';
import { X, Phone, Mail, User, Hash, MapPin } from 'lucide-react';

const NCBA_BRANCHES = [
  "ABC Place", "Bungoma", "Buru Buru", "Busia", "Changamwe (Magongo Rd)", "Chwele", "Ciata Mall", "City Centre",
  "CPA Center Ruaraka", "Diani", "Eastleigh", "Embakasi", "Embu", "Galleria", "Garden City Mall", "Gikomba",
  "Greenspan Mall", "Homa Bay", "Harbour House", "Industrial Area", "Junction", "Kahawa Sukari", "Kakamega",
  "Kapsabet", "Karen", "Karatina", "Kenyatta Avenue", "Kericho", "Kiambu", "Kilifi", "Kisumu", "Kitale", "Kitui",
  "Kenol", "Lavington", "Lavington Mall", "Limuru", "Machakos", "Mama Ngina Street", "Mamlaka Road", "Malindi",
  "Meru", "Migori", "Moi Ave Mombasa", "NCBA House", "Nairobi", "Nakuru", "Naivasha", "Nanyuki", "Narok",
  "Ngong", "Nyali (City Mall)", "Nyali (Naivas Centre)", "Nyeri", "Parklands", "Parkside Towers", "Prestige",
  "Riverside", "Rongai", "Rosslyn Riviera", "Ruaku", "Ruiru Eastern Bypass", "Sameer Park", "Sarit Centre",
  "The Hub Karen", "Thika Road Mall", "Two Rivers Mall", "Upper Hill", "Village Market", "Wabera Street", "Watamu",
  "Westlands", "Wote"
];

export default function CallbackModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    referralNumber: '',
    preferredBranch: '',
    message: '',
  });

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [filteredBranches, setFilteredBranches] = useState([]);

  const handleBranchInput = (value) => {
    setFormData({ ...formData, preferredBranch: value });
    
    if (value.trim()) {
      const filtered = NCBA_BRANCHES.filter(branch =>
        branch.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBranches(filtered);
      setShowBranchDropdown(true);
    } else {
      setFilteredBranches([]);
      setShowBranchDropdown(false);
    }
  };

  const handleBranchSelect = (branch) => {
    setFormData({ ...formData, preferredBranch: branch });
    setShowBranchDropdown(false);
    setFilteredBranches([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ fullName: '', phoneNumber: '', email: '', referralNumber: '', preferredBranch: '', message: '' });
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-ncb-divider p-3.5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-ncb-heading">Request a Callback</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Phone Number *</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="0712345678"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Email Address *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Referral Code (Optional)</label>
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="text"
                value={formData.referralNumber}
                onChange={(e) => setFormData({ ...formData, referralNumber: e.target.value })}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="Enter DSA code"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Preferred Branch (Optional)</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="text"
                value={formData.preferredBranch}
                onChange={(e) => handleBranchInput(e.target.value)}
                onFocus={() => formData.preferredBranch && setShowBranchDropdown(true)}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="Search or select a branch"
              />
              {showBranchDropdown && filteredBranches.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ncb-divider rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredBranches.map((branch, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleBranchSelect(branch)}
                      className="w-full text-left px-3.5 py-2 hover:bg-ncb-blue-50 text-sm text-ncb-heading border-b border-ncb-divider last:border-b-0 transition-colors"
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Additional Message</label>
            <textarea
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
              placeholder="Any specific questions?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-ncb-blue text-white font-semibold text-sm rounded-lg hover:bg-ncb-blue-dark transition-all"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}