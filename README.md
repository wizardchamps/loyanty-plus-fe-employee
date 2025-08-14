# Loyalty Plus FE Employee Dashboard

A modern loyalty program management system built with Next.js, TypeScript, Tailwind CSS, and TanStack Query (React Query) with Axios for HTTP requests and token-based authentication.

## 🚀 Features

- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **State Management**: TanStack Query for server state management
- **HTTP Client**: Axios with automatic token refresh and error handling
- **Authentication**: JWT token-based authentication with automatic refresh
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Optimistic updates and background refetching
- **Error Handling**: Comprehensive error handling with toast notifications

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Form Validation**: Yup
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/wizardchamps/loyanty-plus-fe-employee.git
cd loyanty-plus-fe-employee
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
NEXT_PUBLIC_MOCK_API=true
```

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗 Project Structure

```
app/
├── analytics/          # Analytics dashboard
├── login/             # Authentication page
├── settings/          # System settings
├── store/             # Store management
├── transactions/      # Transaction management
├── users/             # Customer management
├── layout.tsx         # Root layout
└── page.tsx          # Home page

components/
├── navigation/        # Navigation components
├── transactions/      # Transaction-specific components
├── ui/               # Reusable UI components
├── protected-route.tsx # Route protection
└── theme-provider.tsx # Theme management

hooks/
├── use-auth.ts       # Authentication hooks
└── use-loyalty-data.ts # Data fetching hooks

lib/
├── api.ts            # API functions
├── axios-config.ts   # Axios configuration
├── types.ts          # TypeScript types
├── utils.ts          # Utility functions
└── validations.ts    # Form validation schemas

providers/
└── query-provider.tsx # TanStack Query provider
```

## 🔐 Authentication

The application uses JWT token-based authentication with automatic refresh:

### Features:
- Automatic token refresh on expiration
- Protected routes with role-based access
- Secure token storage in localStorage
- Automatic logout on refresh failure

### Usage:
```typescript
import { useAuth } from '@/hooks/use-auth'

const { user, isAuthenticated, login, logout, isLoading } = useAuth()
```

### Demo Credentials:
- Email: admin@example.com
- Password: admin123

## 🌐 API Integration

### Axios Configuration

The application uses Axios with interceptors for:
- Automatic token attachment
- Token refresh on 401 errors
- Error handling and notifications
- Request/response logging in development

### API Functions

```typescript
import { userApi, transactionApi, storeApi } from '@/lib/api'

// Users
const users = await userApi.getUsers()
const user = await userApi.getUser(id)

// Transactions
const transactions = await transactionApi.getTransactions()
const newTransaction = await transactionApi.createTransaction(data)

// Stores
const stores = await storeApi.getStores()
```

## 📊 Data Management with TanStack Query

### Features:
- Automatic caching and background updates
- Optimistic updates for better UX
- Error boundaries and retry logic
- Loading states and error handling

### Usage Examples:

```typescript
import { useUsers, useCreateTransaction } from '@/hooks/use-loyalty-data'

// Fetching data
const { data: users, isLoading, error } = useUsers()

// Mutations
const createTransaction = useCreateTransaction()

const handleSubmit = async (data) => {
  try {
    await createTransaction.mutateAsync(data)
    // Success handled automatically with toast
  } catch (error) {
    // Error handled automatically with toast
  }
}
```

## 🎨 UI Components

The application uses a custom design system built on top of Radix UI:

### Available Components:
- Forms (Input, Select, Textarea, etc.)
- Navigation (Sidebar, Header, etc.)
- Data Display (Tables, Cards, etc.)
- Feedback (Alerts, Toasts, etc.)
- Layout (Grid, Stack, etc.)

### Theme Support:
- Light/Dark mode toggle
- System preference detection
- Persistent theme selection

## 📱 Pages and Features

### 1. Dashboard (`/`)
- Overview of key metrics
- Quick navigation to main features
- Real-time data updates

### 2. Analytics (`/analytics`)
- Customer engagement metrics
- Points earning/redemption statistics
- Top customers and performance insights

### 3. Customer Management (`/users`)
- Customer list with search and filters
- Customer details and point history
- Add/edit/delete customer operations

### 4. Transaction Management (`/transactions`)
- Create new transactions
- Transaction history and status
- Point earning and redemption tracking

### 5. Store Management (`/store`)
- Store information management
- Loyalty program settings
- Store statistics and performance

## 🔧 Development

### Scripts:
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

### Environment Variables:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NODE_ENV=development
NEXT_PUBLIC_MOCK_API=true
NEXT_PUBLIC_API_TIMEOUT=10000
```

## 🚀 Deployment

### Build for production:
```bash
pnpm build
```

### Environment Setup:
1. Set `NODE_ENV=production`
2. Configure `NEXT_PUBLIC_API_URL` to your production API
3. Set `NEXT_PUBLIC_MOCK_API=false` to use real API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Mock data is used in development mode
- Some form validations may need refinement
- Real-time notifications not yet implemented

## 🔮 Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced analytics and reporting
- [ ] Bulk operations for customer management
- [ ] Mobile app support
- [ ] Multi-store management
- [ ] Advanced role-based permissions

## 💬 Support

For support and questions, please contact the development team or create an issue in the repository.
