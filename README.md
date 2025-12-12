# AI Startup Idea Validator

A full-stack web application that helps entrepreneurs validate their startup ideas using AI-powered analysis. Submit your startup concept and receive comprehensive insights including market analysis, competitor assessment, technology recommendations, and profitability scoring.

## 🚀 Features

- **Idea Submission** - Submit startup ideas with title and detailed description
- **AI-Powered Analysis** - Get comprehensive analysis powered by GPT including:
  - Problem identification
  - Target customer profiling
  - Market opportunity assessment
  - Competitor analysis (3 key competitors with differentiation)
  - Recommended tech stack (4-6 technologies)
  - Risk level assessment (Low/Medium/High)
  - Profitability score (0-100)
  - Strategic justification
- **Ideas Dashboard** - View all submitted ideas with status indicators
- **Real-time Updates** - Live updates when AI analysis completes
- **Edit & Delete** - Modify ideas or remove them with PIN protection
- **Secure Deletion** - 6-digit PIN verification required for deletions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database
- **Edge Functions** - Serverless API endpoints (Deno runtime)
- **Real-time Subscriptions** - Live data updates

### AI Integration
- **OpenAI GPT** - AI analysis via gateway API
- **Structured JSON Output** - Consistent analysis format

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AIReport.tsx     # AI analysis display
│   │   ├── EditIdeaDialog.tsx
│   │   ├── Header.tsx
│   │   ├── IdeaCard.tsx
│   │   ├── IdeaForm.tsx
│   │   ├── NavLink.tsx
│   │   └── PinDialog.tsx
│   ├── pages/
│   │   ├── Index.tsx        # Home page with submission form
│   │   ├── IdeasDashboard.tsx
│   │   ├── IdeaDetails.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   └── integrations/        # Supabase client
├── supabase/
│   ├── functions/
│   │   └── analyze-idea/    # AI analysis edge function
│   └── migrations/          # Database schema
└── public/                  # Static assets
```

## 🗄️ Database Schema

### Ideas Table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Idea title |
| description | TEXT | Detailed description |
| status | TEXT | pending/analyzing/completed |
| ai_report | JSONB | AI analysis results |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🔧 Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ai-startup-validator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start development server
```bash
npm run dev
```

## 🎯 How It Works

1. **Submit an Idea** - Enter your startup title and description on the home page
2. **AI Analysis** - The system sends your idea to GPT for comprehensive analysis
3. **View Results** - Navigate to the dashboard to see all ideas and their analysis status
4. **Explore Details** - Click on any idea to view the full AI-generated report
5. **Manage Ideas** - Edit idea details or delete with PIN verification (764581)

## 🔒 Security Features

- PIN-protected deletion (6-digit verification)
- Row Level Security (RLS) on database tables
- Secure API key handling via environment variables

## 📊 AI Analysis Output Format

```json
{
  "problem": "Problem statement the startup solves",
  "customer": "Target customer profile",
  "market": "Market opportunity analysis",
  "competitor": [
    "Competitor 1 - differentiation",
    "Competitor 2 - differentiation",
    "Competitor 3 - differentiation"
  ],
  "tech_stack": ["React", "Node.js", "PostgreSQL", "AWS"],
  "risk_level": "Medium",
  "profitability_score": 75,
  "justification": "Strategic reasoning for the assessment"
}
```

## 🚀 Deployment

The application can be deployed to any static hosting platform:

- Build: `npm run build`
- Output: `dist/` directory
- Edge functions deploy automatically with Supabase

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
