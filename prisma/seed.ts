import { PrismaClient, Role, OrderStatus, ContentType } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data (optional - remove if you want to keep existing data)
  console.log("🧹 Cleaning existing data...")
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.store.deleteMany()
  await prisma.marketingContent.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories
  console.log("📂 Creating categories...")
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
      },
    }),
    prisma.category.create({
      data: {
        name: "Clothing",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Garden",
      },
    }),
    prisma.category.create({
      data: {
        name: "Books",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports & Outdoors",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty & Health",
      },
    }),
  ])

  // Create Users
  console.log("👥 Creating users...")
  const hashedPassword = await bcrypt.hash("password123", 12)

  // Admin Users
  const admin1 = await prisma.user.create({
    data: {
      name: "John Smith",
      email: "admin@example.com",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: "+1-555-0101",
    },
  })

  const admin2 = await prisma.user.create({
    data: {
      name: "Sarah Johnson",
      email: "sarah@techstore.com",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: "+1-555-0102",
    },
  })

  const admin3 = await prisma.user.create({
    data: {
      name: "Mike Wilson",
      email: "mike@fashionhub.com",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: "+1-555-0103",
    },
  })

  // Regular Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Cooper",
        email: "alice@example.com",
        password: hashedPassword,
        role: Role.USER,
        phone: "+1-555-0201",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Brown",
        email: "bob@example.com",
        password: hashedPassword,
        role: Role.USER,
        phone: "+1-555-0202",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carol Davis",
        email: "carol@example.com",
        password: hashedPassword,
        role: Role.USER,
        phone: "+1-555-0203",
      },
    }),
    prisma.user.create({
      data: {
        name: "David Miller",
        email: "david@example.com",
        password: hashedPassword,
        role: Role.USER,
        phone: "+1-555-0204",
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Wilson",
        email: "emma@example.com",
        password: hashedPassword,
        role: Role.USER,
        phone: "+1-555-0205",
      },
    }),
  ])

  // Create Stores
  console.log("🏪 Creating stores...")
  const stores = await Promise.all([
    prisma.store.create({
      data: {
        name: "TechWorld",
        description: "Your one-stop shop for the latest electronics and gadgets",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
        banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
        userId: admin1.id,
      },
    }),
    prisma.store.create({
      data: {
        name: "Fashion Hub",
        description: "Trendy clothing and accessories for every style",
        logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=200&h=200&fit=crop",
        banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=300&fit=crop",
        userId: admin2.id,
      },
    }),
    prisma.store.create({
      data: {
        name: "Home Essentials",
        description: "Everything you need to make your house a home",
        logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
        banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=300&fit=crop",
        userId: admin3.id,
      },
    }),
  ])

  // Create Products
  console.log("📦 Creating products...")
  const products = await Promise.all([
    // Electronics Products
    prisma.product.create({
      data: {
        title: "iPhone 15 Pro",
        description: "The latest iPhone with advanced camera system and A17 Pro chip",
        price: 999.99,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
        stock: 50,
        views: 245,
        storeId: stores[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "MacBook Air M2",
        description: "Supercharged by M2 chip, incredibly thin and light laptop",
        price: 1199.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
        stock: 30,
        views: 189,
        storeId: stores[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "AirPods Pro",
        description: "Active Noise Cancellation and Spatial Audio",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop",
        stock: 100,
        views: 156,
        storeId: stores[0].id,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "Samsung 4K Smart TV",
        description: "55-inch QLED 4K Smart TV with HDR",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
        stock: 25,
        views: 134,
        storeId: stores[0].id,
        categoryId: categories[0].id,
      },
    }),

    // Clothing Products
    prisma.product.create({
      data: {
        title: "Classic Denim Jacket",
        description: "Timeless denim jacket perfect for any season",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
        stock: 75,
        views: 98,
        storeId: stores[1].id,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "Cotton T-Shirt Pack",
        description: "Set of 3 premium cotton t-shirts in various colors",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        stock: 120,
        views: 87,
        storeId: stores[1].id,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "Designer Sneakers",
        description: "Comfortable and stylish sneakers for everyday wear",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        stock: 60,
        views: 112,
        storeId: stores[1].id,
        categoryId: categories[1].id,
      },
    }),

    // Home & Garden Products
    prisma.product.create({
      data: {
        title: "Modern Coffee Table",
        description: "Sleek wooden coffee table with storage compartment",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        stock: 15,
        views: 76,
        storeId: stores[2].id,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        title: "Indoor Plant Set",
        description: "Collection of 5 easy-care indoor plants with pots",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
        stock: 40,
        views: 65,
        storeId: stores[2].id,
        categoryId: categories[2].id,
      },
    }),

    // Books
    prisma.product.create({
      data: {
        title: "The Art of Programming",
        description: "Comprehensive guide to modern software development",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
        stock: 80,
        views: 54,
        storeId: stores[0].id,
        categoryId: categories[3].id,
      },
    }),

    // Sports & Outdoors
    prisma.product.create({
      data: {
        title: "Yoga Mat Premium",
        description: "Non-slip yoga mat with carrying strap",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        stock: 90,
        views: 43,
        storeId: stores[2].id,
        categoryId: categories[4].id,
      },
    }),

    // Beauty & Health
    prisma.product.create({
      data: {
        title: "Skincare Routine Set",
        description: "Complete skincare set with cleanser, toner, and moisturizer",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
        stock: 55,
        views: 67,
        storeId: stores[1].id,
        categoryId: categories[5].id,
      },
    }),
  ])

  // Create Orders
  console.log("🛒 Creating orders...")
  const orders = await Promise.all([
    // Alice's Orders
    prisma.order.create({
      data: {
        userId: users[0].id,
        customerName: users[0].name!,
        customerEmail: users[0].email,
        customerPhone: users[0].phone!,
        shippingAddress: "123 Main St, New York, NY 10001",
        status: OrderStatus.DELIVERED,
        total: 1249.98,
        orderItems: {
          create: [
            {
              productId: products[0].id, // iPhone 15 Pro
              quantity: 1,
              price: 999.99,
            },
            {
              productId: products[2].id, // AirPods Pro
              quantity: 1,
              price: 249.99,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[0].id,
        customerName: users[0].name!,
        customerEmail: users[0].email,
        customerPhone: users[0].phone!,
        shippingAddress: "123 Main St, New York, NY 10001",
        status: OrderStatus.SHIPPED,
        total: 169.98,
        orderItems: {
          create: [
            {
              productId: products[4].id, // Denim Jacket
              quantity: 1,
              price: 89.99,
            },
            {
              productId: products[7].id, // Indoor Plants
              quantity: 1,
              price: 79.99,
            },
          ],
        },
      },
    }),

    // Bob's Orders
    prisma.order.create({
      data: {
        userId: users[1].id,
        customerName: users[1].name!,
        customerEmail: users[1].email,
        customerPhone: users[1].phone!,
        shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
        status: OrderStatus.PROCESSING,
        total: 1199.99,
        orderItems: {
          create: [
            {
              productId: products[1].id, // MacBook Air
              quantity: 1,
              price: 1199.99,
            },
          ],
        },
      },
    }),

    // Carol's Orders
    prisma.order.create({
      data: {
        userId: users[2].id,
        customerName: users[2].name!,
        customerEmail: users[2].email,
        customerPhone: users[2].phone!,
        shippingAddress: "789 Pine St, Chicago, IL 60601",
        status: OrderStatus.PENDING,
        total: 219.97,
        orderItems: {
          create: [
            {
              productId: products[6].id, // Designer Sneakers
              quantity: 1,
              price: 129.99,
            },
            {
              productId: products[11].id, // Skincare Set
              quantity: 1,
              price: 89.99,
            },
          ],
        },
      },
    }),

    // David's Orders
    prisma.order.create({
      data: {
        userId: users[3].id,
        customerName: users[3].name!,
        customerEmail: users[3].email,
        customerPhone: users[3].phone!,
        shippingAddress: "321 Elm St, Houston, TX 77001",
        status: OrderStatus.DELIVERED,
        total: 834.98,
        orderItems: {
          create: [
            {
              productId: products[3].id, // Samsung TV
              quantity: 1,
              price: 799.99,
            },
            {
              productId: products[10].id, // Yoga Mat
              quantity: 1,
              price: 34.99,
            },
          ],
        },
      },
    }),

    // Emma's Orders
    prisma.order.create({
      data: {
        userId: users[4].id,
        customerName: users[4].name!,
        customerEmail: users[4].email,
        customerPhone: users[4].phone!,
        shippingAddress: "654 Maple Dr, Miami, FL 33101",
        status: OrderStatus.CANCELLED,
        total: 89.98,
        orderItems: {
          create: [
            {
              productId: products[5].id, // T-Shirt Pack
              quantity: 1,
              price: 39.99,
            },
            {
              productId: products[9].id, // Programming Book
              quantity: 1,
              price: 49.99,
            },
          ],
        },
      },
    }),
  ])

  // Create Marketing Content
  console.log("📢 Creating marketing content...")
  await Promise.all([
    prisma.marketingContent.create({
      data: {
        type: ContentType.EMAIL,
        title: "Welcome to EcoStore!",
        content: "Thank you for joining our community. Discover amazing products from verified sellers.",
        isGenerated: false,
      },
    }),
    prisma.marketingContent.create({
      data: {
        type: ContentType.EMAIL,
        title: "Flash Sale - 50% Off Electronics",
        content: "Limited time offer on all electronics. Shop now and save big on your favorite gadgets!",
        isGenerated: true,
      },
    }),
    prisma.marketingContent.create({
      data: {
        type: ContentType.FLYER,
        title: "Summer Fashion Collection",
        content: "Discover the latest trends in summer fashion. From casual wear to formal attire.",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
        isGenerated: true,
      },
    }),
    prisma.marketingContent.create({
      data: {
        type: ContentType.VIDEO,
        title: "Home Decor Ideas",
        content: "Transform your living space with these amazing home decor tips and tricks.",
        videoUrl: "https://example.com/video/home-decor.mp4",
        isGenerated: false,
      },
    }),
  ])

  console.log("✅ Database seeding completed successfully!")
  console.log("\n📊 Seeded data summary:")
  console.log(`👥 Users: ${users.length + 3} (${users.length} customers + 3 admins)`)
  console.log(`🏪 Stores: ${stores.length}`)
  console.log(`📂 Categories: ${categories.length}`)
  console.log(`📦 Products: ${products.length}`)
  console.log(`🛒 Orders: ${orders.length}`)
  console.log(`📢 Marketing Content: 4 items`)

  console.log("\n🔐 Test Accounts:")
  console.log("Admin: admin@example.com / password123")
  console.log("User: alice@example.com / password123")
  console.log("User: bob@example.com / password123")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
