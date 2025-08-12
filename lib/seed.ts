import { connectToDatabase } from "@/lib/db";
import { User, Product, Collection, Order } from "@/lib/models";
import bcrypt from "bcryptjs";
import { collections as collectionsData } from "@/data/collections";
import { allProducts as productsData } from "@/data/products";
import { orders as ordersData } from "@/data/orders";

// Load environment variables from .env.local
import dotenv from "dotenv";
import path from "path";

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  try {
    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ Error: MONGODB_URI environment variable is not set");
      console.log(
        "Please create a .env.local file with your MongoDB connection string"
      );
      console.log("Example: MONGODB_URI=mongodb://localhost:27017/sirahats");
      console.log(`Current working directory: ${process.cwd()}`);
      console.log(
        `Looking for .env.local at: ${path.resolve(
          process.cwd(),
          ".env.local"
        )}`
      );
      console.log("Available environment variables:");
      console.log(
        Object.keys(process.env)
          .filter((key) => key.includes("MONGO"))
          .map((key) => `  ${key}: ${process.env[key]}`)
      );
      process.exit(1);
    }

    console.log("✅ MONGODB_URI found:", process.env.MONGODB_URI);

    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database successfully!");

    // Clear existing data
    console.log("Clearing existing data...");
    // await User.deleteMany({});
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Order.deleteMany({});
    console.log("Existing data cleared!");

    // Create test user
    console.log("Creating test user...");
    const hashedPassword = await bcrypt.hash("password123", 12);
    const user = await User.findOneAndUpdate(
      { email: "john.doe@example.com" },
      {
        email: "john.doe@example.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, Anytown, NY 12345",
        role: "user",
      },
      { upsert: true, new: true }
    );
    console.log("Test user created:", user.email);

    // Create collections
    console.log("Creating collections...");
    const collections = await Collection.insertMany(
      collectionsData.map((collection) => ({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        image: collection.image,
        productCount: 0, // Will be updated after products are created
      }))
    );
    console.log(`Created ${collections.length} collections`);

    // Create a map of collection IDs for easy lookup
    const collectionMap = new Map();
    collections.forEach((collection: any) => {
      collectionMap.set(collection.slug, collection._id.toString());
    });

    // Create products
    console.log("Creating products...");
    const products = await Product.insertMany(
      productsData.map((product) => {
        // Find the collection by matching the collectionId from data with the slug
        const collectionSlug = collectionsData.find(
          (c) => c._id === product.collectionId
        )?.slug;
        const collectionId = collectionSlug
          ? collectionMap.get(collectionSlug)
          : null;

        if (!collectionId) {
          console.warn(
            `⚠️  Warning: Collection not found for product "${product.name}", using default collection`
          );
        }

        return {
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          description: product.description,
          category: product.category,
          collectionId: collectionId || (collections[0] as any)._id.toString(),
          isNewProduct: product.isNew || false,
          inStock: product.inStock,
          materials: product.materials,
          dimensions: product.dimensions,
          origin: product.origin,
        };
      })
    );
    console.log(`Created ${products.length} products`);

    // Create a map of product IDs for easy lookup
    const productMap = new Map();
    products.forEach((product: any) => {
      productMap.set(product.slug, product._id.toString());
    });

    // Update collection product counts
    console.log("Updating collection product counts...");
    for (const collection of collections) {
      const count = await Product.countDocuments({
        collectionId: (collection as any)._id.toString(),
      });
      await Collection.findByIdAndUpdate((collection as any)._id, {
        productCount: count,
      });
      console.log(
        `   Collection "${(collection as any).name}": ${count} products`
      );
    }

    // Create orders
    console.log("Creating orders...");
    const orders = await Order.insertMany(
      ordersData.map((order) => {
        const orderItems = order.items.map((item) => {
          // Find product by name and get its ID
          const productSlug = productsData.find(
            (p) => p.name === item.name
          )?.slug;
          const productId = productSlug ? productMap.get(productSlug) : null;

          if (!productId) {
            console.warn(
              `⚠️  Warning: Product not found for order item "${item.name}", using default product`
            );
          }

          return {
            product: productId || (products[0] as any)._id,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          };
        });

        return {
          user: user._id,
          items: orderItems,
          subtotal: order.total,
          shipping: 0,
          tax: 0,
          total: order.total,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery
            ? new Date(order.estimatedDelivery)
            : undefined,
          shippingAddress: {
            firstName: "John",
            lastName: "Doe",
            address: "123 Main Street",
            city: "Anytown",
            state: "NY",
            zipCode: "12345",
            country: "USA",
            phone: "+1 (555) 123-4567",
          },
          paymentMethod: {
            cardNumber: "****-****-****-1234",
            nameOnCard: "John Doe",
          },
        };
      })
    );
    console.log(`Created ${orders.length} orders`);

    // Create admin user
    console.log("Creating admin user...");
    const adminHashedPassword = await bcrypt.hash("admin123", 12);
    const adminUser = await User.findOneAndUpdate(
      { email: "admin@sirahats.com" },
      {
        email: "admin@sirahats.com",
        password: adminHashedPassword,
        firstName: "Admin",
        lastName: "User",
        phone: "+1 (555) 999-8888",
        address: "456 Admin Street, Admin City, AC 99999",
        role: "admin",
      },
      { upsert: true, new: true }
    );
    console.log("Admin user created:", adminUser.email);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Collections: ${await Collection.countDocuments()}`);
    console.log(`   Products: ${await Product.countDocuments()}`);
    console.log(`   Orders: ${await Order.countDocuments()}`);
    console.log("\n🔑 Test Accounts:");
    console.log("   User: john.doe@example.com / password123");
    console.log("   Admin: admin@sirahats.com / admin123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    console.log("\n💡 Troubleshooting tips:");
    console.log("   1. Make sure MongoDB is running");
    console.log("   2. Check your MONGODB_URI environment variable");
    console.log("   3. Ensure your database is accessible");
    process.exit(1);
  }
}

seed();
