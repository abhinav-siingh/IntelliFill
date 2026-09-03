# ⚡ IntelliFill

### AI-Powered Intelligent Web Form Detection & Auto-Filling System

IntelliFill is an AI-powered Chrome Extension that intelligently detects web form fields and automatically fills them using the user's saved profile information.

Instead of manually entering the same information on different websites, IntelliFill identifies the purpose of each form field, maps it to the appropriate profile data, and fills the form after user confirmation.

---

## 🚀 Features

- 🔍 Intelligent Web Form Detection
- ⚡ Rule-Based Field Classification
- 🤖 Google Gemini AI Fallback
- 👤 Complete User Profile Management
- 📝 Automatic Form Filling
- 🔽 Dropdown / Select Field Support
- 🌐 Dynamic Form Detection
- 🔐 User Permission Before Autofill
- 📄 Resume Support
- 💾 Local Profile Caching
- ⚡ AI Request Limiting
- 🧠 AI Response Caching
- 🔑 Gemini API Configuration
- 🗄️ Backend Profile Persistence
- 🔐 User Authentication
- 📊 Profile Completion Tracking

---

# 🔄 IntelliFill Workflow

```text
User
  ↓
Profile Setup
  ↓
Save Profile
  ↓
Open Website
  ↓
Detect Form Fields
  ↓
Extract Field Metadata
  ↓
Rule Engine
  ↓
Is Field Recognized?
  ├── YES
  │    ↓
  │  Map Profile Data
  │
  └── NO
       ↓
     Gemini AI
       ↓
   Field Classification
       ↓
   Map Profile Data
       ↓
Permission / Confirmation
       ↓
Autofill
       ↓
Completed Form
