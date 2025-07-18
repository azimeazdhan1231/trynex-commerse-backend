// Fallback data for development/testing when database is not available
export const fallbackCategories = [
  { id: 1, name: 'Mugs & Drinkware', nameBn: 'মগ ও পানীয় পাত্র', slug: 'mugs-drinkware', createdAt: new Date() },
  { id: 2, name: 'Clothing', nameBn: 'পোশাক', slug: 'clothing', createdAt: new Date() },
  { id: 3, name: 'Keychains', nameBn: 'কীচেইন', slug: 'keychains', createdAt: new Date() },
  { id: 4, name: 'Bottles & Flasks', nameBn: 'বোতল ও ফ্লাস্ক', slug: 'bottles-flasks', createdAt: new Date() },
  { id: 5, name: 'Accessories', nameBn: 'অ্যাক্সেসরিজ', slug: 'accessories', createdAt: new Date() },
  { id: 6, name: 'Jewelry & Beauty', nameBn: 'গহনা ও সৌন্দর্য', slug: 'jewelry-beauty', createdAt: new Date() },
  { id: 7, name: 'Home Decor', nameBn: 'বাড়ির সাজসজ্জা', slug: 'home-decor', createdAt: new Date() },
  { id: 8, name: 'Baby Items', nameBn: 'শিশু সামগ্রী', slug: 'baby-items', createdAt: new Date() },
  { id: 9, name: 'Couple Items', nameBn: 'কাপল আইটেম', slug: 'couple-items', createdAt: new Date() },
  { id: 10, name: 'Gift Hampers', nameBn: 'গিফট হ্যাম্পার', slug: 'gift-hampers', createdAt: new Date() },
  { id: 11, name: 'Flowers & Chocolates', nameBn: 'ফুল ও চকলেট', slug: 'flowers-chocolates', createdAt: new Date() }
];

export const fallbackProducts = [
  {
    id: 1,
    name: 'Premium Bluetooth Headphones',
    nameBn: 'প্রিমিয়াম ব্লুটুথ হেডফোন',
    description: 'High-quality wireless headphones with noise cancellation',
    price: '2500',
    originalPrice: '3000',
    categoryId: 1,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    featured: true,
    inStock: true,
    stockQuantity: 50,
    rating: '4.5',
    reviewCount: 125,
    tags: ['wireless', 'bluetooth', 'noise-cancellation'],
    variants: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Stylish Cotton T-Shirt',
    nameBn: 'স্টাইলিশ কটন টি-শার্ট',
    description: 'Comfortable and fashionable cotton t-shirt',
    price: '1200',
    originalPrice: '1500',
    categoryId: 2,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    featured: true,
    inStock: true,
    stockQuantity: 100,
    rating: '4.3',
    reviewCount: 89,
    tags: ['cotton', 'casual', 'comfortable'],
    variants: { sizes: ['S', 'M', 'L', 'XL'], colors: ['white', 'black', 'blue'] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: 'Smart LED Table Lamp',
    nameBn: 'স্মার্ট LED টেবিল ল্যাম্প',
    description: 'Energy-efficient LED lamp with smart controls',
    price: '1800',
    originalPrice: '2200',
    categoryId: 3,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    featured: false,
    inStock: true,
    stockQuantity: 30,
    rating: '4.7',
    reviewCount: 45,
    tags: ['LED', 'smart', 'energy-efficient'],
    variants: {},
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: 'Yoga Mat Premium',
    nameBn: 'প্রিমিয়াম যোগ ম্যাট',
    description: 'Non-slip yoga mat for all fitness levels',
    price: '1500',
    originalPrice: '1800',
    categoryId: 4,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
    featured: true,
    inStock: true,
    stockQuantity: 75,
    rating: '4.6',
    reviewCount: 67,
    tags: ['yoga', 'fitness', 'non-slip'],
    variants: { colors: ['purple', 'blue', 'green'] },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: 'Programming Fundamentals Book',
    nameBn: 'প্রোগ্রামিং ফান্ডামেন্টাল বই',
    description: 'Comprehensive guide to programming basics',
    price: '800',
    originalPrice: '1000',
    categoryId: 5,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'],
    featured: false,
    inStock: true,
    stockQuantity: 20,
    rating: '4.8',
    reviewCount: 34,
    tags: ['programming', 'education', 'beginner'],
    variants: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const fallbackPromoCodes = [
  {
    id: 1,
    code: 'WELCOME20',
    discount: 20,
    type: 'percentage' as const,
    active: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 100,
    usageCount: 5,
    createdAt: new Date()
  },
  {
    id: 2,
    code: 'SAVE100',
    discount: 100,
    type: 'fixed' as const,
    active: true,
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    usageLimit: 50,
    usageCount: 12,
    createdAt: new Date()
  }
];