# GitHub Analyzer

A comprehensive dashboard for managing SaaS API keys with full CRUD operations, enhanced with AI-powered GitHub repository analysis. Built with Next.js 15, Supabase, Tailwind CSS, and LangChain.

## 🚀 **Project Status: Feature Complete**

This project has evolved from a basic API key management system to a comprehensive platform that includes intelligent GitHub repository analysis using AI.

## ✨ **Core Features**

### **API Key Management**
- ✅ **Full CRUD Operations** for API keys (Create, Read, Update, Delete)
- ✅ **Modern Dashboard** with responsive design and intuitive UI
- ✅ **Real-time Database Integration** using Supabase
- ✅ **Usage Tracking** with visual progress indicators
- ✅ **Permission System** (read, write, delete) with role-based access
- ✅ **Secure API Key Generation** with unique `api_` prefixes
- ✅ **Copy to Clipboard** functionality with visual feedback

### **AI-Powered GitHub Analysis** 🆕
- ✅ **GitHub README Summarizer** using LangChain and OpenAI
- ✅ **Intelligent Repository Analysis** with structured output
- ✅ **Cost-Effective AI Model** (GPT-5-nano) for budget-conscious usage
- ✅ **Automatic URL Parsing** from GitHub repository URLs
- ✅ **Structured AI Output** with summary and cool facts
- ✅ **Fallback Handling** for various README formats

### **User Experience**
- ✅ **Responsive Design** optimized for all devices
- ✅ **Interactive Components** with hover effects and animations
- ✅ **Modal Forms** for seamless API key management
- ✅ **Loading States** and comprehensive error handling
- ✅ **Empty States** with clear call-to-action buttons
- ✅ **Sidebar Navigation** with active page highlighting

## 🏗️ **Architecture Overview**

```
src/
├── app/
│   ├── api/
│   │   ├── api-keys/              # REST API endpoints for key management
│   │   └── github-summarizer/     # AI-powered GitHub analysis endpoint
│   ├── dashboards/                # Main dashboard with sidebar navigation
│   │   ├── components/            # Modular UI components
│   │   └── api-playground/        # API key validation playground
│   └── page.js                    # Landing page
├── lib/
│   ├── apiKeys.js                 # Client-side API service
│   ├── supabase.js                # Database configuration
│   └── langchain-chain.js         # AI summarization chain
```

## 🛠️ **Tech Stack**

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes with server-side rendering
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI Integration**: LangChain with OpenAI GPT-5-nano
- **Styling**: Tailwind CSS with custom component library
- **Icons**: Lucide React for consistent iconography
- **Deployment**: Vercel with automatic deployments

## 📊 **Database Schema**

The system uses a PostgreSQL database with the following structure:

```sql
api_keys table:
- id: Primary key (auto-incrementing)
- name: API key name (required)
- description: Optional description
- key: Unique API key string (starts with 'api_')
- type: Key type (dev/live/test)
- usage: Usage count for tracking
- permissions: JSON array of permissions (read, write, delete)
- created_at: Creation timestamp
- updated_at: Last update timestamp
- last_used: Last usage timestamp
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account
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
   
   # GitHub Configuration (Optional)
   GITHUB_TOKEN=your_github_personal_access_token
   
   # OpenAI Configuration (Required for AI Summarization)
   OPENAI_API_KEY=your_openai_api_key
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

### **API Key Management**
1. **Navigate to Dashboard**: Access `/dashboards` for the main interface
2. **Create Keys**: Click "Add" button to generate new API keys
3. **Manage Permissions**: Set read, write, and delete permissions
4. **Track Usage**: Monitor individual and total usage across all keys
5. **Copy Keys**: Use the copy button for secure key sharing

### **GitHub Repository Analysis** 🆕
1. **Use the AI Endpoint**: POST to `/api/github-summarizer`
2. **Provide GitHub URL**: Send `{"githubUrl": "https://github.com/owner/repo"}`
3. **Get AI Summary**: Receive structured analysis with summary and cool facts
4. **API Key Required**: Include your API key in the `apiKey` header

### **API Playground**
- **Test API Keys**: Use `/dashboards/api-playground` to validate keys
- **Real-time Validation**: Instant feedback on key validity and permissions
- **Usage Tracking**: Monitor how your API keys are being used

## 🔒 **Security Features**

- **Row Level Security (RLS)** enabled on all database tables
- **Environment Variables** for sensitive configuration management
- **Input Validation** on all API endpoints with proper error handling
- **Secure API Key Generation** with unique prefixes and validation
- **Permission-based Access Control** with granular permissions
- **API Key Authentication** required for all protected endpoints

## 🧠 **AI Integration Details**

### **LangChain Chain Architecture**
- **Modern Approach**: Uses `withStructuredOutput` for efficient processing
- **Zod Schema Validation**: Type-safe output with automatic parsing
- **Cost Optimization**: GPT-5-nano model for budget-friendly AI analysis
- **Structured Output**: Consistent JSON responses with summary and cool facts

### **GitHub Analysis Features**
- **Smart URL Parsing**: Automatically extracts owner/repo from GitHub URLs
- **README Processing**: Fetches and analyzes repository documentation
- **Fallback Support**: Handles various README formats and locations
- **Rate Limit Aware**: Respects GitHub API limits with optional authentication

## 🚧 **Development Journey & Lessons Learned**

### **Key Challenges Overcome**
- **Hydration Mismatches**: Resolved by separating server and client components
- **Permission Handling**: Fixed array type issues with JSON string parsing
- **API Key Validation**: Implemented robust header and body parsing
- **Vercel Deployment**: Resolved dependency conflicts and font issues
- **AI Integration**: Successfully integrated LangChain with modern patterns

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

### **Phase 3: Advanced Features (🔄 In Progress)**
- Enhanced error handling and validation
- Performance optimizations
- Additional AI capabilities

### **Phase 4: Enterprise Features (📋 Planned)**
- User authentication and multi-tenancy
- Advanced analytics and reporting
- API rate limiting and quotas
- Webhook integrations

## 🌟 **What Makes This Project Special**

- **AI-Powered Insights**: Intelligent analysis of GitHub repositories
- **Modern Architecture**: Built with the latest Next.js and React patterns
- **Production Ready**: Comprehensive error handling and security
- **Developer Experience**: Clean code structure and modular components
- **Cost Effective**: Optimized AI usage with GPT-5-nano
- **Real-World Tested**: Deployed and tested in production environments

---

**Built with ❤️ using Next.js 15, Supabase, Tailwind CSS, and LangChain**

*This project represents a journey from basic API management to intelligent repository analysis, showcasing modern web development practices and AI integration.*
