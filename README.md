# ⚡ IntelliFill

### AI-Powered Intelligent Web Form Detection & Autofill System

IntelliFill is a Chrome Extension that intelligently detects web form fields, identifies their purpose, maps them with the user's saved profile, and automatically fills the form after user confirmation.

It uses a **Rule Engine as the primary classifier** and **Google Gemini AI as a fallback** for unknown fields.

---

## 🚀 Key Features

- 👤 Smart User Profile Management
- 🔍 Automatic Web Form Field Detection
- 🧠 Rule-Based Field Classification
- 🤖 Gemini AI Fallback for Unknown Fields
- 🗺️ Intelligent Profile-to-Field Mapping
- ⚡ Automatic Form Autofill
- 🔽 Dropdown / Select Field Autofill
- 🔄 Dynamic Form Detection using MutationObserver
- 🛡️ User Confirmation Before Autofill
- 📄 Resume Support
- 🔐 Secure Backend with Authentication
- 💾 MySQL Database Integration

---

## 🔄 Workflow

```text
                    ┌─────────────────┐
                    │     Website     │
                    │    Web Form     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Field Detector │
                    │   + Metadata    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Rule Engine   │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
             Match Found          Unknown Field
                  │                     │
                  │                     ▼
                  │             ┌──────────────┐
                  │             │  Gemini AI   │
                  │             │   Fallback   │
                  │             └──────┬───────┘
                  │                    │
                  └──────────┬─────────┘
                             ▼
                    ┌─────────────────┐
                    │      Mapper     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Preview /       │
                    │ User Confirmation│
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Autofill    │
                    └─────────────────┘
```

---

## 🏗️ System Architecture

```text
┌──────────────────────┐
│   Chrome Extension   │
│                      │
│ HTML / CSS / JS      │
│ Chrome Extension API │
└──────────┬───────────┘
           │ REST API
           ▼
┌──────────────────────┐
│    Spring Boot       │
│      Backend         │
│                      │
│ REST APIs             │
│ Authentication        │
│ Profile Management    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        MySQL         │
│      Database        │
└──────────────────────┘

              │
              │ AI Fallback
              ▼
       ┌──────────────┐
       │ Google Gemini│
       │     AI       │
       └──────────────┘
```

---

## 🧠 How It Works

### 1. Detect
IntelliFill scans the webpage and detects input fields, labels, placeholders, IDs, names, and dropdown options.

### 2. Classify
The Rule Engine first identifies the field type.

Example:

```text
"Email Address"    → EMAIL
"Mobile Number"    → PHONE
"Father Name"      → FATHER_NAME
"Date of Birth"    → DOB
```

### 3. AI Fallback
If the Rule Engine cannot confidently identify a field, Gemini AI is used for classification.

### 4. Map
The identified field is mapped with the corresponding user profile data.

### 5. Confirm
The user reviews and confirms the autofill operation.

### 6. Autofill
IntelliFill fills the detected fields automatically.

---

## 💻 Technology Stack

**Frontend**
- HTML5
- CSS3
- JavaScript
- Chrome Extension Manifest V3
- Chrome Extension APIs
- MutationObserver

**Backend**
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- Maven

**Database**
- MySQL

**AI**
- Google Gemini API



## ⚡ Advantages

- Reduces repetitive form filling
- Faster than manual data entry
- Rule Engine reduces unnecessary AI requests
- AI handles unfamiliar field labels
- Supports dropdown fields
- Supports dynamically loaded forms
- User remains in control before autofill
- Extensible and modular architecture

---

## 🔮 Future Scope

- Improved AI field classification
- Advanced resume data extraction
- Multiple user profiles
- Cloud profile synchronization
- Better custom dropdown support
- Cross-browser support
- Improved privacy and encryption
- Intelligent learning of new field patterns

---

## 👨‍💻 Developer

**Abhinav Singh**

GitHub:  
https://github.com/abhinav-siingh/IntelliFill

---

## ⭐ Project

**IntelliFill — Detect. Understand. Map. Autofill.**
