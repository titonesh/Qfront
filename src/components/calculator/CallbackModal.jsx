import React, { useState } from 'react';
import { X, Phone, Mail, User, Hash, MapPin } from 'lucide-react';

const KENYAN_LOCATIONS = [
  'Ahero',
  'Assa (Kokane)',
  'Athi River (part of Mavoko)',
  'Awasi',
  'Bamburi',
  'Baringo West: Barwesa',
  'Bondo',
  'Bungoma',
  'Busia',
  'Chuka',
  'Dadaab',
  'Diani (Ukunda)',
  'El Wak',
  'Elburgon',
  'Eldoret',
  'Embu',
  'Engineer',
  'Garba Tula',
  'Garissa',
  'Gatundu',
  'Gilgil',
  'Githunguri',
  'Githurai',
  'Habaswein',
  'Hola',
  'Homa Bay',
  'Isebania',
  'Isinya',
  'Isiolo',
  'Iten',
  'Juja',
  'Kabarnet',
  'Kajiado',
  'Kakamega',
  'Kakuma',
  'Kangundo-Tala',
  'Kapenguria',
  'Kapsabet',
  'Karatina',
  'Karingari',
  'Karuri',
  'Katito',
  'Kehancha',
  'Kenol',
  'Kericho',
  'Keroka',
  'Kerugoya-Kutus',
  'Kiambu',
  'Kikuyu',
  'Kilgoris',
  'Kilifi',
  'Kimilili',
  'Kiminini',
  'Kipkelion',
  'Kiserian',
  'Kisii',
  'Kisumu',
  'Kitale',
  'Kitengela',
  'Kitui',
  'Kolowa',
  'Kutus (see Kerugoya-Kutus)',
  'Kwale',
  'Lafey',
  'Lamu',
  'Lari',
  'Likoni',
  'Limuru',
  'Litein',
  'Lodwar',
  'Loosuk (Samburu West)',
  'Luanda',
  'Lunga Lunga',
  'Machakos',
  'Magarini North & South',
  'Mai Mahiu',
  'Mairo-Inya',
  'Makindu',
  'Makutano',
  'Makuyu',
  'Malaba',
  'Malava',
  'Malindi',
  'Malkamari',
  'Mambrui',
  'Mandera',
  'Maralal',
  'Mariakani',
  'Marsabit',
  'Masalani',
  'Maseno',
  'Masogo (North East Kano)',
  'Matuu',
  'Maua',
  'Mavoko (incl. Athi River, Syokimau)',
  'Mazeras',
  'Mbale',
  'Mbita Point',
  'Meru',
  'Migori',
  'Misikhu',
  'Moi\'s Bridge',
  'Molo',
  'Mombasa',
  'Moyale',
  'Msambweni',
  'Mtwapa',
  'Mukothima',
  'Mukutani',
  'Mumias',
  'Murang\'a',
  'Mutuati',
  'Mwatate',
  'Mwingi',
  'Naivasha',
  'Nairobi',
  'Nakuru',
  'Nandi Hills',
  'Nanyuki',
  'Narok',
  'Ndenderu',
  'Ndhiwa',
  'Ngong',
  'Njoro',
  'North East Kano: Masogo',
  'Nuu Trading Centre',
  'Nyahururu',
  'Nyamira',
  'Nyeri',
  'Ogembo',
  'Ol Kalou',
  'Ongata Rongai',
  'Oyugis',
  'Rhamu',
  'Rongo',
  'Roysambu',
  'Ruaka',
  'Ruiru',
  'Runyenjes',
  'Saboti',
  'Samburu West: Loosuk',
  'Sare',
  'Siaya',
  'Sigowet: Chepkemel',
  'Soin: Kipsitet',
  'Sololo',
  'Suneka',
  'Syokimau (part of Mavoko)',
  'Tala (see Kangundo-Tala)',
  'Takaba',
  'Taveta',
  'Tharaka West: Kibung\'a',
  'Thika',
  'Tiaty Central: Chemolingot',
  'Turbo',
  'Turi',
  'Ugunja',
  'Ukunda (Diani)',
  'Ukwala',
  'Vihiga',
  'Voi',
  'Wajir',
  'Wanguru',
  'Wargadud',
  'Watamu',
  'Webuye',
  'Wote',
  'Wundanyi',
  'Zombe'
];

const NCBA_BRANCHES = [
  "ABC",
  "BUNGOMA",
  "BURUBURU",
  "BUSIA",
  "CHANGAMWE",
  "CHWELE",
  "CIATA MALL",
  "CITY CENTRE",
  "DIANI",
  "EASTLEIGH",
  "ELDORET",
  "EMBAKASI",
  "EMBU",
  "GALLERIA",
  "GARDEN CITY MALL",
  "GIKOMBA",
  "GITHUNGURI",
  "GREENSPAN MALL",
  "GRENADIER WESTLANDS",
  "HARAMBEE",
  "HOMA BAY",
  "ICIPE AGENCY",
  "ICRAF AGENCY",
  "ILRI AGENCY",
  "INDUSTRIAL AREA",
  "JICA- UPPERHILL",
  "JUNCTION MALL",
  "KAHAWA SUKARI",
  "KAKAMEGA",
  "KAPSABET",
  "KARATINA",
  "KAWANGWARE",
  "KENOL",
  "KENYATTA AVENUE",
  "KERICHO",
  "KERUGOYA",
  "KIAMBU",
  "KILIFI",
  "KILIMANI",
  "KISII",
  "KISUMU TIVOLI",
  "KITALE",
  "KITENGELA",
  "KITUI",
  "KQ CARGO CENTRE",
  "LAVINGTON",
  "LIMURU",
  "LUNGALUNGA SQUARE",
  "MACHAKOS",
  "MALINDI",
  "MAMA NGINA STREET",
  "MAMLAKA ROAD",
  "MERU",
  "MIGORI",
  "MITCHEL COTTS AGENCY",
  "MOI AVENUE, MOMBASA",
  "MURANGA",
  "MWEMBE TAYARI",
  "NAIROBI HOSPITAL AGENCY",
  "NAIVASHA",
  "NAKURU NCBA CENTRE",
  "NAKURU TOWER ONE",
  "NANYUKI",
  "NAROK",
  "NCBA HOUSE",
  "NGONG",
  "NKURUMAH",
  "NYAHURURU",
  "NYALI CENTRE",
  "NYALI CITY MALL",
  "NYERI",
  "ONE KENTONS SQUARE",
  "PARKLANDS",
  "PARKSIDE TOWERS",
  "PRESTIGE",
  "RIVERROAD",
  "RIVERSIDE",
  "RONGAI",
  "RUAKA BRANCH",
  "RUIRU EASTERN BYPASS",
  "SAMEER PARK",
  "SARIT CENTRE",
  "SWISSPORT",
  "TATU CITY",
  "THE HUB KAREN",
  "THE MALL",
  "THE NORD RUIRU",
  "THIKA",
  "THIKA ROAD MALL",
  "TWO RIVERS MALL",
  "UKUNDA",
  "UPPER HILL",
  "US EMBASSY AGENCY",
  "UTAWALA",
  "VILLAGE MARKET",
  "WABERA STREET",
  "WATAMU",
  "WORLD VISION AGENCY",
  "WOTE",
  "YAYA CENTRE"
];

export default function CallbackModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    referralNumber: '',
    preferredBranch: '',
    location: '',
    message: '',
  });

  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);

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

  const handleLocationInput = (value) => {
    setFormData({ ...formData, location: value });
    
    if (value.trim()) {
      const filtered = KENYAN_LOCATIONS.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
      setShowLocationDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowLocationDropdown(false);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, location: location });
    setShowLocationDropdown(false);
    setFilteredLocations([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({ fullName: '', phoneNumber: '', email: '', referralNumber: '', preferredBranch: '', location: '', message: '' });
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
            <label className="block text-xs font-semibold text-ncb-heading mb-0.5">Location (Optional)</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ncb-text" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleLocationInput(e.target.value)}
                onFocus={() => formData.location && setShowLocationDropdown(true)}
                className="w-full pl-9 pr-3.5 py-1.5 text-sm border border-ncb-divider rounded-lg focus:outline-none focus:border-ncb-blue"
                placeholder="Search or select a location"
              />
              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-ncb-divider rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredLocations.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-3.5 py-2 hover:bg-ncb-blue-50 text-sm text-ncb-heading border-b border-ncb-divider last:border-b-0 transition-colors"
                    >
                      {location}
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