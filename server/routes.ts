import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertOrderSchema, insertReviewSchema, insertNewsletterSchema } from "@shared/schema";
import { fallbackCategories, fallbackProducts, fallbackPromoCodes } from "./data/fallback";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.log("Using fallback categories data");
      res.json(fallbackCategories);
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    const {
      categoryId,
      minPrice,
      maxPrice,
      search,
      featured,
      inStock,
      limit = 20,
      offset = 0
    } = req.query;

    const filters = {
      categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      search: search as string,
      featured: featured === 'true',
      inStock: inStock !== 'false',
      limit: parseInt(limit as string),
      offset: parseInt(offset as string)
    };

    try {
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      console.log("Using fallback products data");
      
      // Apply filters to fallback data
      let filteredProducts = [...fallbackProducts];
      
      if (filters.categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === filters.categoryId);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.featured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.featured === filters.featured);
      }
      
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.price) >= filters.minPrice!);
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.price) <= filters.maxPrice!);
      }
      
      // Apply pagination
      const startIndex = filters.offset || 0;
      const endIndex = startIndex + (filters.limit || 20);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      res.json(paginatedProducts);
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      console.log("Using fallback product data");
      
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      
      const product = fallbackProducts.find(p => p.id === id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const orderId = storage.generateOrderId();
      
      const order = await storage.createOrder({
        ...orderData,
        orderId
      });
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/track/:orderId", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await storage.getOrderByOrderId(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error tracking order:", error);
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Promos
  app.get("/api/promos/:code", async (req, res) => {
    try {
      const code = req.params.code.toUpperCase();
      const promo = await storage.getPromoByCode(code);
      
      if (!promo) {
        return res.status(404).json({ error: "Promo code not found" });
      }
      
      if (!promo.active) {
        return res.status(400).json({ error: "Promo code is not active" });
      }
      
      if (promo.expiresAt && new Date() > promo.expiresAt) {
        return res.status(400).json({ error: "Promo code has expired" });
      }
      
      if (promo.usageLimit && (promo.usageCount ?? 0) >= promo.usageLimit) {
        return res.status(400).json({ error: "Promo code usage limit reached" });
      }
      
      res.json(promo);
    } catch (error) {
      console.error("Error validating promo:", error);
      console.log("Using fallback promo data");
      
      const code = req.params.code.toUpperCase();
      const promo = fallbackPromoCodes.find(p => p.code === code);
      
      if (!promo) {
        return res.status(404).json({ error: "Promo code not found" });
      }
      
      if (!promo.active) {
        return res.status(400).json({ error: "Promo code is not active" });
      }
      
      if (promo.expiresAt && new Date() > promo.expiresAt) {
        return res.status(400).json({ error: "Promo code has expired" });
      }
      
      if (promo.usageLimit && (promo.usageCount ?? 0) >= promo.usageLimit) {
        return res.status(400).json({ error: "Promo code usage limit reached" });
      }
      
      res.json(promo);
    }
  });

  // Reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getReviewsByProductId(productId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid review data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(email);
      res.status(201).json(subscription);
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email", details: error.errors });
      }
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Email endpoint for order notifications
  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { to, subject, orderData } = req.body;
      
      // In a real implementation, you would integrate with an email service
      // For now, we'll just log the email data
      console.log("Sending order email:", { to, subject, orderData });
      
      res.json({ success: true, message: "Order email sent successfully" });
    } catch (error) {
      console.error("Error sending order email:", error);
      res.status(500).json({ error: "Failed to send order email" });
    }
  });

  // WhatsApp integration endpoint
  app.post("/api/whatsapp-order", async (req, res) => {
    try {
      const { orderData } = req.body;
      
      // Format order data for WhatsApp
      const whatsappMessage = `
*New Order from TryneX*

*Order ID:* ${orderData.orderId}
*Customer:* ${orderData.customerName}
*Phone:* ${orderData.customerPhone}
*Total:* ৳${orderData.total}

*Items:*
${orderData.items.map((item: any) => `• ${item.name} x${item.quantity} - ৳${item.price}`).join('\n')}

*Delivery:* ${orderData.deliveryLocation}
*Payment:* ${orderData.paymentMethod}

${orderData.specialInstructions ? `*Instructions:* ${orderData.specialInstructions}` : ''}
      `.trim();
      
      const whatsappUrl = `https://wa.me/01747292277?text=${encodeURIComponent(whatsappMessage)}`;
      
      res.json({ success: true, whatsappUrl });
    } catch (error) {
      console.error("Error creating WhatsApp order:", error);
      res.status(500).json({ error: "Failed to create WhatsApp order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
