# 📧 Email Organizer

**Email Organizer** is an AI powered application that helps the way you manage your inbox by summarizing and categorizing your unread Gmail messages, and helping you in crafting replies.

## ✨ Overview
In today's fast-paced world, an overflowing email inbox can be a significant source of stress and lost productivity.
- **Email Insight** leverages the power of cutting-edge Large Language Models (LLMs) to intelligently process your unread emails.
- **Get the Gist Instantly:** Receive concise, AI-generated summaries of lengthy emails, allowing you to grasp the core content at a glance.
- **Intelligent Prioritization:** Automatically classify emails into customizable categories like *Very Important*, *Important*, *Non-Important*, *Promotions*, and *Spam*, ensuring you focus on what truly matters.
- **Effortless Replies:** Generate smart, context-aware reply drafts based on your specific instructions and personalized writing style, saving you valuable time.

---

## 🚀 Features
- **Seamless Gmail Integration:** Securely connects with your Google account using OAuth 2.0 to fetch and manage unread emails.
- **AI-Powered Summarization:** Utilizes the OpenAI API (GPT-4o-mini) to generate brief, accurate, and actionable summaries of email content.
- **Customizable Email Classification:** Define your own rules and preferences to train the AI on how to categorize your emails, adapting to your unique workflow.
- **AI-Assisted Reply Generation:** Craft professional and personalized email replies with intelligent AI assistance, ensuring your communication aligns with your desired tone and style.
- **One-Click Actions:** Easily mark processed emails as read directly from the dashboard to keep your inbox tidy.
- **Intuitive User Interface:** A clean, modern, and responsive design built with React and Tailwind CSS for optimal viewing and usability across all devices.

---

## 🛠️ Technologies Used
**Frontend:**
- React - A JavaScript library for building user interfaces.
- Tailwind CSS - A utility-first CSS framework for rapid UI development.

**Backend/APIs:**
- Google Gmail API - For accessing and managing Gmail messages.
- OpenAI API (GPT-4o-mini) - For AI-powered summarization and reply generation.
- Firebase Authentication - For secure user authentication via Google Sign-In.
- Firebase Firestore - A NoSQL cloud database for storing user-specific knowledge bases.

---

## ⚙️ Getting Started
Follow these steps to set up and run the **Email Insight** application locally.

### Prerequisites
- Node.js (LTS version recommended): [Download Here](https://nodejs.org)
- npm (comes with Node.js) or Yarn

---

### 1. Clone the Repository
```bash
git clone https://github.com/kaan7305/email-organizer.git
cd email-summarizer-app
```

(Replace `kaan7305` with your actual GitHub username)

---

### 2. Install Dependencies
```bash
npm install
# or if you use yarn
yarn install
```

---

### 3. Environment Variables Setup (Crucial!)
Create a `.env` file in the root of your project:
```
REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
REACT_APP_OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

---

### 4. Run the Application
```bash
npm start
# or
yarn start
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 💡 Usage
1. **Connect Your Google Account** - Authenticate via Google OAuth.
2. **View Summarized Emails** - AI summaries and categorized emails.
3. **Personalize AI Classification** - Customize how AI categorizes your emails.
4. **Define Reply Knowledge Base** - Set your tone, common phrases, and sign-offs.
5. **Reply with AI Assistance** - Generate and edit replies before sending.
6. **Mark as Read** - Keep your inbox clean.

---

## 🤝 Contributing
We welcome contributions!  
1. Fork the repository.  
2. Create a new branch:  
   ```bash
   git checkout -b feature/your-feature-name
   ```  
3. Commit and push changes.  
4. Open a Pull Request.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact
- **GitHub:** (https://github.com/kaan7305)
- **Project Link:** (https://github.com/kaan7305/email-organizer)

---

## 🙏 Acknowledgements
- React, Tailwind CSS, Firebase, and OpenAI for amazing tools.
- Inspired by the constant battle against email overload.
