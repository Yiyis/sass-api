# GitHub Analyzer

A comprehensive dashboard for managing SaaS API keys with full CRUD operations, enhanced with AI-powered GitHub repository analysis. Built with Next.js 15, Supabase, Tailwind CSS, and LangChain.

## 🚀 **Project Status: Production Ready**

This project has evolved from a basic API key management system to a comprehensive, production-ready platform featuring intelligent GitHub repository analysis, user authentication, rate limiting, and interactive demonstrations.

## ✨ **Core Features**

### **API Key Management**
- ✅ **Full CRUD Operations** for API keys (Create, Read, Update, Delete)
- ✅ **Modern Dashboard** with responsive design and intuitive UI
- ✅ **Real-time Database Integration** using Supabase
- ✅ **Usage Tracking** with visual progress indicators
- ✅ **Permission System** (read, write, delete) with role-based access
- ✅ **Secure API Key Generation** with unique `api_` prefixes
- ✅ **Copy to Clipboard** functionality with visual feedback
- ✅ **API Key Limits** (3 keys per user) with enforcement
- ✅ **User-Specific Operations** with authenticated access control

### **AI-Powered GitHub Analysis** 🆕
- ✅ **GitHub README Summarizer** using LangChain and OpenAI
- ✅ **Intelligent Repository Analysis** with structured output
- ✅ **Cost-Effective AI Model** (GPT-5-nano) for budget-conscious usage
- ✅ **Automatic URL Parsing** from GitHub repository URLs
- ✅ **Structured AI Output** with summary and cool facts
- ✅ **Fallback Handling** for various README formats
- ✅ **Repository Metadata** with stars, forks, language, and latest releases
- ✅ **Parallel API Calls** for optimized performance (2-4 second responses)
- ✅ **Rate Limiting Protection** with atomic usage tracking
- ✅ **Interactive Demo** with realistic simulated responses

### **User Experience**
- ✅ **Responsive Design** optimized for all devices
- ✅ **Interactive Components** with hover effects and animations
- ✅ **Modal Forms** for seamless API key management
- ✅ **Loading States** and comprehensive error handling
- ✅ **Empty States** with clear call-to-action buttons
- ✅ **Sidebar Navigation** with active page highlighting
- ✅ **Google OAuth Authentication** with NextAuth.js integration
- ✅ **User Profile Management** with avatar fallbacks
- ✅ **API Playground** for testing and validation
- ✅ **Glassmorphism Design** with dark purple liquid theme

## 🏗️ **Architecture Overview**

```
src/
├── app/
│   ├── api/
│   │   ├── user/api-keys/         # Authenticated REST API endpoints
│   │   ├── github-summarizer/     # AI-powered GitHub analysis endpoint
│   │   ├── validate-api-key/      # API key validation endpoint
│   │   └── auth/                  # NextAuth.js authentication
│   ├── dashboards/                # Main dashboard with sidebar navigation
│   │   ├── components/            # Modular UI components
│   │   └── api-playground/        # API key testing and GitHub analysis
│   └── page.js                    # Landing page with interactive demo
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── interactive-demo-section.jsx  # GitHub API demo with simulated data
│   └── ProtectedRoute.js          # Authentication wrapper
├── lib/
│   ├── apiKeys.js                 # Client-side API service
│   ├── auth-utils.js              # Authentication utilities
│   ├── rate-limiter.js            # Rate limiting utilities
│   ├── supabase.js                # Database configuration
│   └── langchain-chain.js         # AI summarization chain
```

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes with server-side rendering
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: NextAuth.js with Google OAuth
- **AI Integration**: LangChain with OpenAI GPT-5-nano
- **Styling**: Tailwind CSS with glassmorphism design system
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks with client-side caching
- **Deployment**: Vercel with automatic deployments

## 📊 **Database Schema**

The system uses a PostgreSQL database with the following structure:

```sql
users table:
- id: Primary key (UUID)
- email: User email (unique)
- name: User display name
- image_url: Profile picture URL
- created_at: Account creation timestamp

api_keys table:
- id: Primary key (auto-incrementing)
- user_id: Foreign key to users table (required)
- name: API key name (required)
- description: Optional description
- key: Unique API key string (starts with 'api_')
- type: Key type (dev/live/test)
- usage: Usage count for tracking
- usage_limit: Maximum usage allowed (default: 1000)
- rate_limit_window: Time window for rate limiting (monthly/daily/hourly)
- rate_limit_reset_at: When the usage counter resets
- permissions: JSON array of permissions (read, write, delete)
- created_at: Creation timestamp
- updated_at: Last update timestamp
- last_used: Last usage timestamp

Row Level Security (RLS):
- Users can only access their own API keys
- Authenticated operations only
- Admin bypass for service operations
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console project (for OAuth)
- OpenAI API key (for AI features)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sass-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-template.txt .env.local
   ```
   
   Configure your environment:
   ```env
   # Database Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Authentication Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_generated_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # GitHub Configuration (Optional)
   GITHUB_TOKEN=your_github_personal_access_token
   
   # OpenAI Configuration (Required for AI Summarization)
   OPENAI_API_KEY=your_openai_api_key
   
   # Demo Configuration
   NEXT_PUBLIC_DEMO_API_KEY=demo_key_for_testing
   ```

4. **Set up database**
   - Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md)
   - Run the SQL schema from `supabase-schema.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Access dashboard at `/dashboards`

## 📱 **Usage Guide**

### **Getting Started**
1. **Sign In**: Use Google OAuth to authenticate (`/auth/signin`)
2. **Dashboard Access**: Navigate to `/dashboards` for the main interface
3. **Profile Setup**: Your profile appears in the bottom navigation with avatar

### **API Key Management**
1. **Create Keys**: Click "Add" button to generate new API keys (max 3 per user)
2. **Manage Permissions**: Set read, write, and delete permissions
3. **Track Usage**: Monitor individual and total usage across all keys
4. **Copy Keys**: Use the copy button for secure key sharing
5. **Rate Limiting**: Each key has usage limits with automatic reset

### **GitHub Repository Analysis** 🆕
1. **Interactive Demo**: Try the landing page demo with simulated responses
2. **API Playground**: Use `/dashboards/api-playground` for real API testing
3. **API Endpoint**: POST to `/api/github-summarizer`
4. **Request Format**: Send `{"githubUrl": "https://github.com/owner/repo"}`
5. **Authentication**: Include your API key in the `apiKey` header
6. **Rich Response**: Get repository metadata, stars, releases, and AI summary

### **API Playground**
- **Key Validation**: Test API key validity and permissions
- **GitHub Testing**: Test the summarizer API with real GitHub URLs
- **Usage Monitoring**: Real-time usage and rate limit tracking
- **Response Analysis**: Detailed response structure and timing

## 🔒 **Security Features**

- **Row Level Security (RLS)** enabled on all database tables
- **Google OAuth Authentication** with NextAuth.js
- **User-Specific Data Access** with JWT-based authentication
- **Environment Variables** for sensitive configuration management
- **Input Validation** on all API endpoints with proper error handling
- **Secure API Key Generation** with unique prefixes and validation
- **Permission-based Access Control** with granular permissions
- **Rate Limiting Protection** with atomic usage tracking
- **API Key Limits** (3 per user) to prevent abuse
- **Authenticated Endpoints** (`/api/user/*`) for secure operations

## 🧠 **AI Integration Details**

### **LangChain Chain Architecture**
- **Modern Approach**: Uses `withStructuredOutput` for efficient processing
- **Zod Schema Validation**: Type-safe output with automatic parsing
- **Cost Optimization**: GPT-5-nano model for budget-friendly AI analysis
- **Structured Output**: Consistent JSON responses with summary and cool facts

### **GitHub Analysis Features**
- **Smart URL Parsing**: Automatically extracts owner/repo from GitHub URLs
- **README Processing**: Fetches and analyzes repository documentation
- **Repository Metadata**: Stars, forks, language, size, and release information
- **Parallel API Calls**: README, repo data, and releases fetched simultaneously
- **Rate Limiting**: Built-in usage tracking with automatic limit enforcement
- **Fallback Support**: Handles various README formats and locations
- **Performance Optimized**: 2-4 second response times with 4-way parallelization

## 🚧 **Development Journey & Lessons Learned**

### **Key Challenges Overcome**
- **Hydration Mismatches**: Resolved by separating server and client components
- **Permission Handling**: Fixed array type issues with JSON string parsing
- **API Key Validation**: Implemented robust header and body parsing
- **Vercel Deployment**: Resolved dependency conflicts and font issues
- **AI Integration**: Successfully integrated LangChain with modern patterns
- **User Authentication**: Implemented secure Google OAuth with NextAuth.js
- **Rate Limiting**: Built atomic usage tracking with concurrent request handling
- **User Profile Management**: Created robust avatar system with fallbacks
- **API Key Limits**: Enforced per-user limits with proper error handling

### **Technical Decisions**
- **Component Architecture**: Modular design with separate concerns
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance**: Optimized for production with proper loading states
- **Accessibility**: WCAG-compliant design with proper contrast and labels

## 🧪 **Testing & Quality Assurance**

```bash
# Run linting
npm run lint

# Check for build issues
npm run build

# Start development server
npm run dev
```

## 📦 **Deployment**

### **Vercel (Production Ready)**
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Configure all required environment variables
3. **Automatic Deployments**: Deploy on every push to main branch
4. **Custom Domain**: Configure your domain for production use

### **Environment Configuration**
- **Database**: Supabase with proper RLS policies
- **AI Services**: OpenAI API with rate limiting
- **GitHub Integration**: Optional token for higher rate limits
- **Security**: All sensitive data in environment variables

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following the established patterns
4. **Test thoroughly** with the development environment
5. **Submit a pull request** with detailed description

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support & Documentation**

- **API Documentation**: Check the test guides in the repository
- **Setup Issues**: Refer to [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **AI Features**: See [test-ai-summary.md](./test-ai-summary.md)
- **General Usage**: Review [test-github-api.md](./test-github-api.md)
- **Issues**: Create an issue in the repository for bugs or feature requests

## 🎯 **Project Roadmap**

### **Phase 1: MVP (✅ Complete)**
- Basic CRUD operations for API keys
- Modern dashboard UI with responsive design
- Database integration with Supabase

### **Phase 2: AI Integration (✅ Complete)**
- GitHub repository analysis with LangChain
- OpenAI integration for intelligent summarization
- Structured output with summary and cool facts

### **Phase 3: Advanced Features (✅ Complete)**
- ✅ User authentication and multi-tenancy with Google OAuth
- ✅ API rate limiting with atomic usage tracking
- ✅ Enhanced error handling and validation
- ✅ Performance optimizations with parallel API calls
- ✅ Interactive demo with simulated responses

### **Phase 4: Enterprise Features (📋 Future)**
- Advanced analytics and reporting dashboard
- Webhook integrations for real-time notifications
- Team management and collaborative features
- API usage analytics and insights
- Custom rate limiting configurations

## 🌟 **What Makes This Project Special**

- **AI-Powered Insights**: Intelligent analysis of GitHub repositories with comprehensive metadata
- **Modern Architecture**: Built with the latest Next.js and React patterns
- **Production Ready**: Comprehensive error handling, security, and authentication
- **Performance Optimized**: 2-4 second response times with parallel processing
- **User-Centric Design**: Secure multi-tenancy with Google OAuth integration
- **Rate Limiting**: Built-in protection with atomic usage tracking
- **Interactive Demo**: Realistic simulated responses for showcasing capabilities
- **Glassmorphism UI**: Beautiful dark purple liquid glass design theme
- **Developer Experience**: Clean code structure and modular components
- **Cost Effective**: Optimized AI usage with GPT-5-nano
- **Real-World Tested**: Deployed and tested in production environments

---

**Built with ❤️ using Next.js 15, Supabase, Tailwind CSS, and LangChain**

*This project represents a complete journey from basic API management to a production-ready platform with intelligent repository analysis, user authentication, rate limiting, and interactive demonstrations - showcasing modern web development practices and AI integration.*
