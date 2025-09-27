# BrokerCalc Pro

**BrokerCalc Pro** is a modern broker-agnostic P/L and tax calculation app built with Next.js, Tailwind CSS, and Prisma. Users can calculate brokerage charges, track their trades, calculate profits/losses, and manage tax reports across multiple Indian brokers.

## 🛠 Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **Backend:** Next.js API routes, Node.js 20, Prisma ORM
- **Database:** SQLite (development), PostgreSQL (production ready)
- **Authentication:** JWT-based auth with bcrypt password hashing
- **Validation:** Zod for runtime type checking and validation
- **State Management:** React Hooks and Context
- **Future Plans:** CSV/XLSX export, Recharts/ApexCharts integration

## ⚡ Features

### Implemented

- **Authentication**
  - Secure signup & login with JWT
  - Password hashing with bcrypt
  - Protected API routes with middleware
- **Broker Integration**
  - Support for Zerodha and Groww
  - Accurate brokerage calculations
  - Detailed charge breakdowns (STT, GST, etc.)
- **Input Validation**
  - Strong schema validation with Zod
  - Stock symbol format validation
  - Trade input validation (quantity, price, etc.)

### In Progress

- Stock symbol autocomplete with NSE/BSE data
- Order management and tracking
- P&L calculations with broker charges
- Dashboard analytics
- Tax report generation

### Planned

- Portfolio analytics and visualization
- Export functionality (CSV/XLSX)
- More broker integrations
- Advanced tax calculations (STCG/LTCG)

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd brokercalc-pro
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a .env file in the root:

```bash
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your_super_secure_random_string"
```

4. Run Prisma migrations & seed database

```bash
npx prisma migrate dev --name init
npm run seed
```

5. Start the development server

```bash
npm run dev
```

Visit: http://localhost:3000

## 🏗 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── broker/       # Broker management
│   │   ├── calculations/ # P&L calculations
│   │   ├── login/       # Authentication
│   │   ├── orders/      # Order management
│   │   ├── signup/      # User registration
│   │   └── symbols/     # Stock symbols data
│   ├── login/           # Login page
│   └── signup/          # Signup page
├── components/           # Reusable components
│   ├── Navigation.tsx   # Main navigation
│   └── StockSymbolInput.tsx
├── hooks/               # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── middleware/          # API middleware
│   └── auth.ts         # JWT authentication
└── utils/              # Utility functions
    ├── brokerage.ts    # Brokerage calculations
    ├── error-handler.ts # Error handling
    └── validation.ts   # Zod schemas
```

## 📝 Development Notes

### API Routes

- All routes under `src/app/api/`
- Protected by JWT authentication middleware
- Proper error handling and validation
- Consistent response format

### Authentication

- JWT-based with 1-hour expiry
- Bcrypt for password hashing
- Protected routes and API endpoints
- Client-side auth state management

### Database

- SQLite for development
- PostgreSQL recommended for production
- Prisma migrations for schema management
- Proper indexing on frequently queried fields

### Validation

- Zod schemas for all inputs
- Stock symbol format validation
- Price and quantity validation
- Broker-specific rules
