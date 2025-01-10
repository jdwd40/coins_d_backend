# Crypto Trading Platform Backend

A real-time cryptocurrency trading platform backend built with Node.js, Express, MongoDB, and Socket.IO. This server provides real-time price updates, user authentication, and price history tracking for various cryptocurrencies.

## Features

- **Real-time Price Updates**: Simulated cryptocurrency price updates using Socket.IO
- **User Authentication**: JWT-based authentication system
- **Price History**: Track and store historical price data for each cryptocurrency
- **RESTful API**: Comprehensive API endpoints for cryptocurrency data
- **WebSocket Integration**: Real-time data streaming for price updates
- **Database Integration**: MongoDB for persistent data storage
- **Security**: Environment variables, JWT authentication, and secure password hashing

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crypto-trading
JWT_SECRET=your_jwt_secret_key
```

## Environment Variables

- `PORT`: Server port number (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Project Structure

```
server/
├── src/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic
│   ├── socket/          # WebSocket handlers
│   └── index.js         # Application entry point
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
└── package.json        # Project dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Cryptocurrency
- `GET /api/coins` - Get all available coins
- `GET /api/coins/:symbol` - Get specific coin details
- `GET /api/price-history/:symbol/:timeframe` - Get price history

## WebSocket Events

### Client -> Server
- `subscribe`: Subscribe to real-time updates
- `unsubscribe`: Unsubscribe from updates

### Server -> Client
- `prices-updated`: Real-time price updates
- `coin-updated`: Individual coin updates

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Price Simulator

The server includes a price simulator that generates realistic price movements for cryptocurrencies. Features include:

- Random price fluctuations based on market volatility
- Volume simulation
- Price history tracking
- Configurable update intervals

## Security Measures

1. JWT Authentication
2. Password Hashing
3. Rate Limiting
4. CORS Protection
5. Environment Variables
6. Input Validation

## Error Handling

The API implements standardized error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```


