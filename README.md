📧 Email Insight

Email-organizer is an AI-powered application that revolutionizes the way you manage your inbox by summarizing and categorizing your unread Gmail messages, and assisting you in crafting replies.

✨ Overview
In today's fast-paced world, an overflowing email inbox can be a significant source of stress and lost productivity. Sifting through countless messages to find what's important is time-consuming and inefficient.

Email-organizer leverages the power of cutting-edge Large Language Models (LLMs) to intelligently process your unread emails, transforming your inbox into a streamlined, actionable dashboard. This application empowers you to:

Get the Gist Instantly: Receive concise, AI-generated summaries of lengthy emails, allowing you to grasp the core content at a glance.

Intelligent Prioritization: Automatically classify emails into customizable categories like "Very Important," "Important," "Non-Important," "Promotions," and "Spam," ensuring you focus on what truly matters.

Effortless Replies: Generate smart, context-aware reply drafts based on your specific instructions and personalized writing style, saving you valuable time.

Spend less time sifting through emails and more time focusing on your priorities with Email Insight.

🚀 Features
Seamless Gmail Integration: Securely connects with your Google account using OAuth 2.0 to fetch and manage unread emails.

AI-Powered Summarization: Utilizes the OpenAI API (GPT-4o-mini) to generate brief, accurate, and actionable summaries of email content.

Customizable Email Classification: Define your own rules and preferences to train the AI on how to categorize your emails, adapting to your unique workflow.

AI-Assisted Reply Generation: Craft professional and personalized email replies with intelligent AI assistance, ensuring your communication aligns with your desired tone and style.

One-Click Actions: Easily mark processed emails as read directly from the dashboard to keep your inbox tidy.

Intuitive User Interface: A clean, modern, and responsive design built with React and Tailwind CSS for optimal viewing and usability across all devices.

🛠️ Technologies Used
Frontend:

React - A JavaScript library for building user interfaces.

Tailwind CSS - A utility-first CSS framework for rapid UI development.

Backend/APIs:

Google Gmail API - For accessing and managing Gmail messages.

OpenAI API (GPT-4o-mini) - For AI-powered summarization and reply generation.

Firebase Authentication - For secure user authentication via Google Sign-In.

Firebase Firestore - A NoSQL cloud database for storing user-specific knowledge bases (classification and reply preferences).

⚙️ Getting Started
Follow these steps to set up and run the Email Insight application locally on your machine.

Prerequisites
Before you begin, ensure you have the following software installed:

Node.js: Download and install Node.js (LTS version recommended)

npm: (Node Package Manager, comes with Node.js) or Yarn

1. Clone the Repository
First, clone the project repository to your local machine:

git clone https://github.com/YOUR_USERNAME/email-summarizer-app.git
cd email-summarizer-app

(Replace YOUR_USERNAME with your actual GitHub username)

2. Install Dependencies
Navigate into the project directory and install the necessary npm packages:

npm install
# or if you use Yarn
# yarn install

3. Environment Variables Setup (Crucial!)
To connect to Firebase and OpenAI, you need to set up environment variables. This is vital for security, especially when sharing your code publicly.

Create a new file named .env in the root of your project directory (the same level as package.json). Add the following variables to it, replacing the placeholder values with your actual keys:

REACT_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
REACT_APP_OPENAI_API_KEY=YOUR_OPENAI_API_KEY

How to obtain your keys:

Firebase Configuration:

Go to the Firebase Console.

Select your project (or create a new one).

Click on "Project settings" (the gear icon next to "Project overview").

Under the "General" tab, scroll down to "Your apps" and select the web app. You'll find your firebaseConfig object there. Copy the values for apiKey, authDomain, projectId, storageBucket, messagingSenderId, and appId.

OpenAI API Key:

Go to the OpenAI API dashboard.

Click on "Create new secret key."

Copy the generated key.

Important: Ensure your .env file is included in your .gitignore to prevent accidentally committing your sensitive keys to version control.

4. Run the Application
Once the dependencies are installed and environment variables are set, you can start the development server:

npm start
# or if you use Yarn
# yarn start

The application will compile and automatically open in your default web browser, usually at http://localhost:3000.

💡 Usage
Here's a guide on how to interact with the Email Insight application:

1. Connect Your Google Account
Upon launching the app, you'll be greeted by a welcoming screen. Click the "Connect Your Google Account" button to initiate the authentication process. You will be redirected to Google to sign in and grant the necessary Gmail permissions.

Caption: The initial screen prompting users to connect their Google account for secure access.

2. View Summarized Emails
Once successfully connected, the main dashboard will load, displaying your unread emails. Each email card presents a concise AI-generated summary and its categorized importance.

Caption: The main dashboard showcasing summarized and categorized unread emails, with filter options at the top.

3. Personalize AI Classification
To tailor the AI's email classification to your specific needs, click the "Personalize AI" button. A modal will appear where you can provide detailed instructions and examples to guide the AI's categorization logic.

Caption: The modal interface for customizing AI email classification preferences.

4. Define Reply Knowledge Base
To ensure AI-generated replies match your personal or professional writing style, click the "Knowledge Base" button. Here, you can define your preferred tone, common phrases, and sign-offs.

Caption: The modal for defining your preferred reply writing style and knowledge base.

5. Reply to Emails with AI Assistance
For any email, click the "Reply" button located on its card. A reply modal will open, allowing you to provide a brief instruction for your reply. The AI will then generate a draft based on your instruction and your defined reply knowledge base. You can review, edit, and send the draft directly from the app.

Caption: A demonstration of generating an AI-assisted reply within the modal, showing instruction input and draft output.

6. Mark as Read
To keep your inbox clean and focused, simply click the "Mark as Read" button on any email card. This will archive the email in Gmail and remove it from your unread list on the dashboard.

🤝 Contributing
We welcome contributions to the Email Insight project! If you have ideas for new features, bug fixes, or improvements, please feel free to contribute.

Fork the repository: Start by forking this repository to your GitHub account.

Create a new branch:

git checkout -b feature/your-feature-name

Make your changes: Implement your desired features or fixes.

Commit your changes:

git commit -m "feat: Add a concise commit message describing your changes"

Push to your branch:

git push origin feature/your-feature-name

Open a Pull Request: Go to the original repository on GitHub and open a pull request from your forked branch. Provide a clear description of your changes.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

📧 Contact
If you have any questions, feedback, or just want to connect, feel free to reach out:

Your Name/GitHub Profile: https://github.com/kaan7305

Project Link: https://github.com/YOUR_USERNAME/email-organizer

🙏 Acknowledgements
Inspired by the constant battle against email overload.

Special thanks to the open-source community and the teams behind React, Tailwind CSS, Firebase, and OpenAI for providing incredible tools that make projects like this possible.
