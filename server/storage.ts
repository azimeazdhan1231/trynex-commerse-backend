import { db } from "./lib/supabase";
import { 
  users, categories, products, orders, promos, reviews, newsletter, blogPosts,
  type User, type InsertUser, type Category, type InsertCategory, 
  type Product, type InsertProduct, type Order, type InsertOrder,
  type Promo, type InsertPromo, type Review, type InsertReview,
  type Newsletter, type InsertNewsletter, type BlogPost, type InsertBlogPost
} from "@shared/schema";
import { fallbackCategories, fallbackProducts, fallbackPromoCodes } from "./data/fallback";
import { eq, desc, like, and, or, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(filters?: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    inStock?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product>;

  // Orders
  getOrders(limit?: number, offset?: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderByOrderId(orderId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order>;
  generateOrderId(): string;

  // Promos
  getPromos(): Promise<Promo[]>;
  getPromoByCode(code: string): Promise<Promo | undefined>;
  createPromo(promo: InsertPromo): Promise<Promo>;
  updatePromo(id: number, updates: Partial<InsertPromo>): Promise<Promo>;

  // Reviews
  getReviewsByProductId(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  approveReview(id: number): Promise<Review>;

  // Newsletter
  subscribeNewsletter(email: string): Promise<Newsletter>;
  getNewsletterSubscribers(): Promise<Newsletter[]>;

  // Blog
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Products
  async getProducts(filters?: {
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    inStock?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    
    const conditions = [];
    
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(products.name, `%${filters.search}%`),
          like(products.description, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }
    
    if (filters?.inStock !== undefined) {
      conditions.push(eq(products.inStock, filters.inStock));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(products.createdAt)) as any;
    
    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    
    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }
    
    return await query;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const productData: any = {
      ...product,
      tags: product.tags ? (Array.isArray(product.tags) ? product.tags : [product.tags]) : []
    };
    const [newProduct] = await db.insert(products).values(productData).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const updateData: any = {
      ...updates,
      tags: updates.tags ? (Array.isArray(updates.tags) ? updates.tags : [updates.tags]) : undefined
    };
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Orders
  async getOrders(limit = 50, offset = 0): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByOrderId(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const orderData: any = {
      ...order,
      items: Array.isArray(order.items) ? order.items : []
    };
    const [newOrder] = await db.insert(orders).values(orderData).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  generateOrderId(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXR-${dateStr}-${randomNum}`;
  }

  // Promos
  async getPromos(): Promise<Promo[]> {
    return await db.select().from(promos).where(eq(promos.active, true));
  }

  async getPromoByCode(code: string): Promise<Promo | undefined> {
    const [promo] = await db.select().from(promos).where(eq(promos.code, code.toUpperCase()));
    return promo;
  }

  async createPromo(promo: InsertPromo): Promise<Promo> {
    const [newPromo] = await db.insert(promos).values(promo).returning();
    return newPromo;
  }

  async updatePromo(id: number, updates: Partial<InsertPromo>): Promise<Promo> {
    const [updatedPromo] = await db
      .update(promos)
      .set(updates)
      .where(eq(promos.id, id))
      .returning();
    return updatedPromo;
  }

  // Reviews
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.approved, true)))
      .orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async approveReview(id: number): Promise<Review> {
    const [approvedReview] = await db
      .update(reviews)
      .set({ approved: true })
      .where(eq(reviews.id, id))
      .returning();
    return approvedReview;
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<Newsletter> {
    const [subscription] = await db
      .insert(newsletter)
      .values({ email })
      .onConflictDoUpdate({
        target: newsletter.email,
        set: { subscribed: true }
      })
      .returning();
    return subscription;
  }

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    return await db.select().from(newsletter).where(eq(newsletter.subscribed, true));
  }

  // Blog
  async getBlogPosts(published = true): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (published) {
      query = query.where(eq(blogPosts.published, true)) as any;
    }
    
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
}

export const storage = new SupabaseStorage();
