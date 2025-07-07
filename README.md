# 🛠️ Fullstack E-commerce App

A modern e-commerce platform built with Next.js 15, Tailwind CSS v4, Prisma, and PostgreSQL.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (with dark/light theme support)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Role-based auth (Admin and User)
- **Email Marketing**: Brevo API (formerly Sendinblue)
- **Image Upload**: Local or third-party (Cloudinary/UploadThing - optional)

## ✨ Features

### 🔐 Admin Features
- **Store Onboarding**: Set up store name, description, logo, and banner
- **Product Management**: Add, edit, delete products with categories
- **Analytics Dashboard**: View total orders, most viewed products, revenue
- **Order Management**: Track and manage customer orders
- **Marketing Tools**: Email marketing integration with Brevo API

### 👤 User Features
- **Authentication**: Register/login as customer
- **Product Browsing**: Browse products with search and filtering
- **Product Details**: View detailed product information
- **Order Placement**: Place orders with shipping information
- **Order Confirmation**: Receive order confirmation

### 🎨 UI/UX Features
- **Responsive Design**: Mobile-first responsive layout
- **Dark/Light Theme**: Toggle between themes with system preference
- **Modern UI**: Clean, professional design with shadcn/ui components
- **Loading States**: Smooth loading indicators and transitions

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd ecommerce-app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Create a `.env` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Brevo API (for email marketing)
BREVO_API_KEY="your-brevo-api-key"

# Optional: Image upload services
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"
\`\`\`

### 4. Database Setup
\`\`\`bash
# Push the schema to your database
npx prisma db push

# (Optional) Seed the database
npx prisma db seed

# Open Prisma Studio to view your data
npx prisma studio
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.



## 🔐 Authentication & Authorization

The app uses NextAuth.js with role-based authentication:

- **USER**: Can browse products and place orders
- **ADMIN**: Can manage store, products, and view analytics

### Default Routes Protection:
- `/admin/*` - Admin only
- `/dashboard/*` - Authenticated users only

## 📊 Database Schema

Key models:
- **User**: Authentication and user data
- **Store**: Admin store information
- **Product**: Product catalog
- **Order**: Customer orders
- **Category**: Product categories
- **OrderItem**: Order line items

## 🎨 Theming

The app supports dark/light theme switching using next-themes:
- System preference detection
- Manual theme toggle
- Persistent theme selection

## 📧 Email Marketing

Integrated with Brevo API for:
- Promotional email campaigns
- Order confirmations
- Newsletter subscriptions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request


Built with ❤️ using Next.js 15 and modern web technologies.
