export const POPULAR_SUGGESTIONS = [
  // Hospitality & Travel
  { label: 'Hotels & Luxury Resorts', query: 'Hotels', category: 'Hospitality', icon: '🏨' },
  { label: 'Guest Houses & Serviced Apartments', query: 'Guest House', category: 'Hospitality', icon: '🏡' },
  { label: 'Travel Agencies & Air Ticketing', query: 'Travel Agency', category: 'Travel', icon: '✈️' },
  { label: 'Tour Operators & Visa Processing', query: 'Tour Operator', category: 'Travel', icon: '🎟️' },

  // Food & Beverage
  { label: 'Restaurants & Fine Dining', query: 'Restaurants', category: 'Food & Dining', icon: '🍽️' },
  { label: 'Coffee Shops & Specialty Cafes', query: 'Coffee Shop', category: 'Food & Cafe', icon: '☕' },
  { label: 'Bakeries & Pastry Shops', query: 'Bakery', category: 'Food & Bakery', icon: '🧁' },
  { label: 'Sweet Shops & Confectionery', query: 'Sweet Shop', category: 'Food & Sweets', icon: '🍬' },
  { label: 'Catering & Buffet Services', query: 'Catering Service', category: 'Food & Events', icon: '🍲' },
  { label: 'Fast Food Joints & Burger Shops', query: 'Fast Food', category: 'Food & Dining', icon: '🍔' },

  // Tech & Electronics
  { label: 'Mobile Shops & Gadget Stores', query: 'Mobile Shop', category: 'Electronics', icon: '📱' },
  { label: 'Computer & Laptop Showrooms', query: 'Computer Shop', category: 'Electronics', icon: '💻' },
  { label: 'Software Companies & IT Agencies', query: 'Software Companies', category: 'Technology', icon: '🖥️' },
  { label: 'CCTV & Security Systems', query: 'CCTV Security', category: 'Technology', icon: '📹' },
  { label: 'Electronics & Home Appliances', query: 'Electronics Shop', category: 'Electronics', icon: '🔌' },
  { label: 'Digital Marketing & SEO Agencies', query: 'Digital Marketing Agency', category: 'Marketing', icon: '🚀' },

  // Healthcare & Fitness
  { label: 'Hospitals & Medical Centers', query: 'Hospitals', category: 'Medical', icon: '🏥' },
  { label: 'Diagnostic & Pathology Labs', query: 'Diagnostic Center', category: 'Medical', icon: '🔬' },
  { label: 'Dentists & Dental Clinics', query: 'Dentists', category: 'Healthcare', icon: '🦷' },
  { label: 'Eye Care & Optical Showrooms', query: 'Eye Clinic', category: 'Healthcare', icon: '👓' },
  { label: 'Gym & Fitness Centers', query: 'Gym', category: 'Fitness', icon: '🏋️' },
  { label: 'Pharmacies & Medicine Stores', query: 'Pharmacies', category: 'Healthcare', icon: '💊' },
  { label: 'Veterinary Clinics & Pet Care', query: 'Veterinary Clinic', category: 'Pet Care', icon: '🐾' },

  // Retail & Fashion
  { label: 'Clothing & Fashion Boutiques', query: 'Clothing Store', category: 'Fashion', icon: '👗' },
  { label: 'Jewelry Stores & Gold Showrooms', query: 'Jewelry Store', category: 'Retail', icon: '💍' },
  { label: 'Footwear & Shoe Stores', query: 'Shoe Store', category: 'Fashion', icon: '👟' },
  { label: 'Cosmetics & Skincare Shops', query: 'Cosmetics Shop', category: 'Beauty', icon: '💄' },
  { label: 'Furniture Showrooms & Home Decor', query: 'Furniture Showroom', category: 'Home', icon: '🛋️' },
  { label: 'Supermarkets & Grocery Stores', query: 'Supermarket', category: 'Retail', icon: '🛒' },
  { label: 'Bookshops & Stationeries', query: 'Bookstore', category: 'Education', icon: '📚' },
  { label: 'Toy Stores & Kids Shops', query: 'Toy Store', category: 'Retail', icon: '🧸' },

  // Services & Repairs
  { label: 'Automobile Repair & Garages', query: 'Automobile Repair', category: 'Automotive', icon: '🚗' },
  { label: 'Car Wash & Detailing Studios', query: 'Car Wash', category: 'Automotive', icon: '🧽' },
  { label: 'AC Repair & Servicing Center', query: 'AC Repair', category: 'Home Services', icon: '❄️' },
  { label: 'Electricians & Electrical Hardware', query: 'Electrician', category: 'Home Services', icon: '🔧' },
  { label: 'Laundry & Dry Cleaners', query: 'Dry Cleaner', category: 'Services', icon: '🧺' },
  { label: 'Pest Control Services', query: 'Pest Control', category: 'Services', icon: '🐜' },

  // Professional & Corporate
  { label: 'Real Estate & Property Developers', query: 'Real Estate', category: 'Properties', icon: '🏢' },
  { label: 'Law Firms & Legal Consultants', query: 'Law Firm', category: 'Legal', icon: '⚖️' },
  { label: 'Audit Firms & Tax Consultants', query: 'Audit Firm', category: 'Finance', icon: '📊' },
  { label: 'Interior Designers & Architects', query: 'Interior Design', category: 'Construction', icon: '🎨' },
  { label: 'Printing & Packaging Press', query: 'Printing Press', category: 'Services', icon: '🖨️' },
  { label: 'Recruitment & HR Agencies', query: 'HR Agency', category: 'Corporate', icon: '💼' },

  // Education & Training
  { label: 'Schools & High Schools', query: 'Schools', category: 'Education', icon: '🏫' },
  { label: 'Universities & Colleges', query: 'Universities', category: 'Education', icon: '🎓' },
  { label: 'Coaching & Tuition Academies', query: 'Coaching Center', category: 'Education', icon: '📝' },
  { label: 'IELTS & Foreign Language Institutes', query: 'IELTS Center', category: 'Education', icon: '🗣️' },
  { label: 'IT & Software Training Centers', query: 'IT Training', category: 'Education', icon: '🧑‍💻' },

  // Beauty, Personal Care & Events
  { label: 'Ladies Beauty Salons & Parlors', query: 'Beauty Parlor', category: 'Beauty', icon: '💇' },
  { label: 'Gents Salons & Barber Shops', query: 'Barber Shop', category: 'Personal Care', icon: '💈' },
  { label: 'Photography & Wedding Studios', query: 'Photography Studio', category: 'Media', icon: '📷' },
  { label: 'Event Managers & Wedding Decorators', query: 'Event Management', category: 'Events', icon: '🎉' },
  { label: 'Convention Halls & Community Centers', query: 'Convention Hall', category: 'Events', icon: '🏛️' },
];

export const BANGLADESH_LOCATIONS_MAP = {
  dhaka: ['dhaka', 'ঢাকা', 'gulshan', 'banani', 'dhanmondi', 'mirpur', 'uttara', 'motijheel', 'mohammadpur', 'badda', 'khilkhet', 'tejgaon', 'ramna', 'basundhara'],
  dinajpur: ['dinajpur', 'দিনাজপুর', 'fulbari', 'birganj', 'biral', 'parbatipur'],
  chittagong: ['chittagong', 'chattogram', 'চট্টগ্রাম', 'agrabad', 'gec', 'halishahar', 'patenga', 'khulshi'],
  sylhet: ['sylhet', 'সিলেট', 'zindabazar', 'chouhatta', 'amberkhana'],
  rajshahi: ['rajshahi', 'রাজশাহী'],
  khulna: ['khulna', 'খুলনা'],
  barishal: ['barishal', 'barisal', 'বরিশাল'],
  rangpur: ['rangpur', 'রংপুর'],
  comilla: ['comilla', 'cumilla', 'কুমিল্লা'],
  gazipur: ['gazipur', 'গাজীপুর', 'tongi'],
  narayanganj: ['narayanganj', 'নারায়ণগঞ্জ'],
  gulshan: ['gulshan', 'গুলশান'],
  banani: ['banani', 'বনানী'],
  dhanmondi: ['dhanmondi', 'ধানমন্ডি'],
  mirpur: ['mirpur', 'মিরপুর'],
  uttara: ['uttara', 'উত্তরা'],
};

export function isProfessionalWebsite(websiteUrl = '') {
  try {
    if (!websiteUrl || typeof websiteUrl !== 'string' || !websiteUrl.trim()) return false;
    const url = websiteUrl.trim().toLowerCase();
    const socialDomains = [
      'facebook.com', 'fb.com', 'fb.me', 'instagram.com', 'wa.me', 'whatsapp.com',
      'google.com', 'maps.google.com', 'business.site', 'page.link', 'tiktok.com',
      'youtube.com', 'linkedin.com', 'twitter.com', 'x.com'
    ];
    for (const domain of socialDomains) {
      if (url.includes(domain)) return false;
    }
    return url.startsWith('http://') || url.startsWith('https://') || url.includes('.');
  } catch {
    return false;
  }
}
