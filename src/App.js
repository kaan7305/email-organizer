import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://www.googleapis.com/auth/gmail.send');


// --- Helper & UI Components ---

const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const LoadingSkeleton = () => (
    <div className="bg-white p-5 rounded-xl shadow-md animate-pulse">
        <div className="flex justify-between items-start">
            <div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="mt-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="mt-4 flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
    </div>
);

// --- MODALS ---

// Modal for setting classification preferences
const ClassificationKnowledgeBaseModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [classificationKB, setClassificationKB] = useState(initialData);

    useEffect(() => {
        setClassificationKB(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(classificationKB);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Personalize AI Classification</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Classification Preferences</label>
                        <p className="text-xs text-gray-500 mb-2">Teach the AI how to categorize your emails.</p>
                        <textarea
                            value={classificationKB}
                            onChange={(e) => setClassificationKB(e.target.value)}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 'Emails from Project Phoenix are very important...'"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </div>
        </div>
    );
};

// New Modal for setting reply style preferences
const ReplyKnowledgeBaseModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [replyKB, setReplyKB] = useState(initialData);

    useEffect(() => {
        setReplyKB(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(replyKB);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Knowledge Base for Replies</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reply Style Preferences</label>
                         <p className="text-xs text-gray-500 mb-2">Define your writing style for AI-generated replies.</p>
                        <textarea
                            value={replyKB}
                            onChange={(e) => setReplyKB(e.target.value)}
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., 'Always start with a friendly greeting. Keep replies concise. Sign off with Regards, [Your Name].'"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                </div>
            </div>
        </div>
    );
};


const ReplyModal = ({ isOpen, onClose, email, knowledgeBase, accessToken }) => {
    const [instruction, setInstruction] = useState('');
    const [draft, setDraft] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null); // null, 'success', or 'error'

    // Reset state when the modal opens
    useEffect(() => {
        if (isOpen) {
            setInstruction('');
            setDraft('');
            setIsGenerating(false);
            setIsSending(false);
            setSendStatus(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGenerateDraft = async () => {
        setIsGenerating(true);
        const prompt = `
            Based on the user's reply style preferences, the original email snippet, and the user's instruction, generate a reply draft.

            User Reply Style: "${knowledgeBase}"
            Original Email Snippet: "${email.summary}"
            User Instruction: "${instruction}"

            Return a valid JSON object with a single key "draft".
        `;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error.message);
            }
            const result = await response.json();
            const { draft: generatedDraft } = JSON.parse(result.choices[0].message.content);
            setDraft(generatedDraft);
        } catch (error) {
            setDraft(`Error generating draft: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSendEmail = async () => {
        if (!draft || !accessToken) return;
        setIsSending(true);
        setSendStatus(null);

        try {
            // Construct the raw email message in RFC 2822 format.
            const emailLines = [
                `To: ${email.sender}`,
                `Subject: Re: ${email.subject}`,
                `In-Reply-To: ${email.messageId}`,
                `References: ${email.messageId}`,
                'Content-Type: text/plain; charset=utf-8',
                '',
                draft
            ];
            const rawEmail = emailLines.join('\r\n');

            // Base64Url encode the email for the Gmail API.
            const base64EncodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
                .replace(/\+/g, '-')
                .replace(/\//g, '_');

            const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    raw: base64EncodedEmail
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error.message || 'Failed to send email.');
            }

            setSendStatus('success');
            setTimeout(() => {
                onClose(); // Close modal after a short delay on success
            }, 2000);

        } catch (error) {
            console.error('Error sending email:', error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Reply to {email.sender.split('<')[0].trim()}</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Instruction</label>
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g., 'Politely decline the invitation.'"
                        />
                    </div>
                    <button onClick={handleGenerateDraft} disabled={isGenerating} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50">
                        {isGenerating ? 'Generating...' : 'Generate Draft'}
                    </button>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Generated Draft</label>
                        <textarea
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full h-48 p-2 border border-gray-300 rounded-md"
                            placeholder="AI-generated draft will appear here..."
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end items-center space-x-4">
                    {sendStatus === 'error' && <p className="text-red-500 text-sm">Failed to send. Please try again.</p>}
                    {sendStatus === 'success' && <p className="text-green-500 text-sm">Email sent successfully!</p>}
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
                    <button 
                        onClick={handleSendEmail} 
                        disabled={isSending || !draft || sendStatus === 'success'}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {isSending ? 'Sending...' : sendStatus === 'success' ? 'Sent!' : sendStatus === 'error' ? 'Try Again' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}


// --- Main Application Components ---

const Header = ({ user, handleSignIn, handleSignOut }) => (
  <header className="bg-white shadow-sm sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Email Insight</h1>
        </div>
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:block">Welcome, {user.displayName.split(' ')[0]}</span>
            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full" />
            <button onClick={handleSignOut} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
              <Icon path="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" className="w-5 h-5" />
              <span className="hidden md:block">Sign Out</span>
            </button>
          </div>
        ) : (
          <button onClick={handleSignIn} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-5 h-5" />
            <span>Connect Account</span>
          </button>
        )}
      </div>
    </div>
  </header>
);

const EmailCard = ({ email, onMarkAsRead, onReply }) => {
    const categoryStyles = {
        "Very Important": "bg-red-100 text-red-800",
        "Important": "bg-yellow-100 text-yellow-800",
        "Non-Important": "bg-blue-100 text-blue-800",
        "Promotions": "bg-green-100 text-green-800",
        "Spam": "bg-gray-100 text-gray-800",
    };
    const categoryBorderStyles = {
        "Very Important": "border-red-500",
        "Important": "border-yellow-500",
        "Non-Important": "border-blue-500",
        "Promotions": "border-green-500",
        "Spam": "border-gray-500",
    }

    return (
        <div className={`bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${categoryBorderStyles[email.category] || 'border-gray-500'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-semibold text-gray-800" title={email.sender}>{email.sender.split('<')[0].trim()}</p>
                    <p className="text-sm text-gray-600">{email.subject}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${categoryStyles[email.category] || 'bg-gray-100 text-gray-800'}`}>
                    {email.category}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-gray-700 font-medium">Summary:</p>
                <p className="text-gray-600">{email.summary}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
                 <div className="flex space-x-4">
                    <button onClick={() => onReply(email)} className="flex items-center space-x-2 text-sm text-gray-500 hover:text-indigo-600 font-semibold transition-colors duration-200">
                        <Icon path="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" className="w-5 h-5"/>
                        <span>Reply</span>
                    </button>
                    <button onClick={() => onMarkAsRead(email.id)} className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-600 font-semibold transition-colors duration-200">
                        <Icon path="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" className="w-5 h-5"/>
                        <span>Mark as Read</span>
                    </button>
                </div>
                <p className="text-xs text-gray-400">{email.date}</p>
            </div>
        </div>
    );
};

const EmailDashboard = ({ accessToken, knowledgeBase, onOpenClassificationModal, onOpenReplyKBModal, onReply }) => {
    const [allEmails, setAllEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [nextPageToken, setNextPageToken] = useState(null);

    const categories = ["All", "Very Important", "Important", "Non-Important", "Promotions"];

    const fetchAndProcessEmails = useCallback(async (isInitialLoad = true, pageToken = null) => {
        if (!accessToken) return;
        
        if (isInitialLoad) setIsLoading(true);
        else setIsFetchingMore(true);
        setError(null);

        try {
            const maxResults = 10; // Reduced for faster testing
            let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=is:unread`;
            if (pageToken) url += `&pageToken=${pageToken}`;

            const listResponse = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
            if (!listResponse.ok) throw new Error(`Failed to fetch email list. Gmail API responded with ${listResponse.status}.`);
            
            const listData = await listResponse.json();
            setNextPageToken(listData.nextPageToken || null);

            if (!listData.messages || listData.messages.length === 0) {
                if (isInitialLoad) setAllEmails([]);
                return;
            }

            const emailPromises = listData.messages.map(async (message) => {
                try {
                    const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, { headers: { Authorization: `Bearer ${accessToken}` } });
                    if (!msgResponse.ok) return null;
                    const msgData = await msgResponse.json();
                    
                    const headers = msgData.payload.headers;
                    const sender = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
                    const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
                    const date = new Date(headers.find(h => h.name === 'Date')?.value).toLocaleString();
                    const messageId = headers.find(h => h.name === 'Message-ID')?.value || '';
                    const snippet = msgData.snippet;

                    const prompt = `Based on the user's preferences below and the following email snippet, provide a summary of at least four sentences and classify it into one of these categories: Very Important, Important, Non-Important, Promotions, Spam.
                    
                    User Preferences: "${knowledgeBase.classification}"
                    
                    Snippet: "${snippet}"
                    
                    Return the response as a valid JSON object.`;
                    
                    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${OPENAI_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "gpt-4o-mini",
                            messages: [{ role: "user", content: prompt }],
                            response_format: { type: "json_object" }
                        })
                    });

                    if (!openAIResponse.ok) {
                        const errorData = await openAIResponse.json();
                        throw new Error(`OpenAI API Error: ${errorData.error.message}`);
                    }
                    
                    const openAIResult = await openAIResponse.json();
                    if (!openAIResult.choices[0]?.message?.content) {
                        throw new Error("OpenAI response is missing content.");
                    }
                    const { summary, category } = JSON.parse(openAIResult.choices[0].message.content);

                    return { id: msgData.id, sender, subject, date, summary, category, messageId };
                } catch (e) {
                    console.error(`Failed to process message ${message.id}:`, e);
                    return null;
                }
            });

            const processedEmails = (await Promise.all(emailPromises)).filter(Boolean);
            
            if (isInitialLoad) setAllEmails(processedEmails);
            else setAllEmails(prev => [...prev, ...processedEmails]);

        } catch (err) {
            console.error("Error fetching or processing emails:", err);
            setError(err.message);
            setAllEmails([]);
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [accessToken, knowledgeBase.classification]);

    const handleRefresh = () => {
        setNextPageToken(null);
        fetchAndProcessEmails(true, null);
    };

    const handleLoadMore = () => {
        if (nextPageToken) {
            fetchAndProcessEmails(false, nextPageToken);
        }
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ removeLabelIds: ['UNREAD'] }),
            });
            if (!response.ok) throw new Error('Failed to mark email as read.');
            setAllEmails(prev => prev.filter(email => email.id !== messageId));
        } catch (err) {
            console.error(err);
            setError("Could not mark email as read. Please try again.");
        }
    };
    
    useEffect(() => {
        if (activeFilter === 'All') setFilteredEmails(allEmails);
        else setFilteredEmails(allEmails.filter(email => email.category === activeFilter));
    }, [activeFilter, allEmails]);

    useEffect(() => {
        if (accessToken) handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, knowledgeBase]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                 <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-semibold text-gray-700">Unread Inbox</h2>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">{allEmails.length}</span>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={onOpenClassificationModal} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                        <Icon path="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" className="w-5 h-5"/>
                        <span>Personalize AI</span>
                    </button>
                    <button onClick={onOpenReplyKBModal} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                        <Icon path="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" className="w-5 h-5"/>
                        <span>Knowledge Base</span>
                    </button>
                    <button onClick={handleRefresh} disabled={isLoading} className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon path="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.695v-2.695A8.25 8.25 0 005.68 9.348v2.695z" className={`w-5 h-5 ${isLoading || isFetchingMore ? 'animate-spin' : ''}`}/>
                        <span>{isLoading || isFetchingMore ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                 </div>
            </div>
            
            <div className="mb-6 flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${activeFilter === cat ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {error && <p className="text-center text-red-500 bg-red-100 p-4 rounded-lg font-mono text-sm">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)
                ) : !error && filteredEmails.length > 0 ? (
                    filteredEmails.map(email => (
                        <EmailCard key={email.id} email={email} onMarkAsRead={handleMarkAsRead} onReply={onReply} />
                    ))
                ) : (
                   !isLoading && !error && <div className="col-span-full text-center py-16 bg-white rounded-xl shadow">
                        <Icon path="M2.25 13.5h3.86a2.25 2.25 0 012.25 2.25v3.86a2.25 2.25 0 002.25 2.25h3.86a2.25 2.25 0 002.25-2.25v-3.86a2.25 2.25 0 012.25-2.25h3.86M2.25 13.5V6.269a2.25 2.25 0 011.125-1.949l6.437-3.678a2.25 2.25 0 012.278 0l6.437 3.678a2.25 2.25 0 011.125 1.949V13.5" className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-700">All caught up!</h3>
                        <p className="text-gray-500 mt-2">There are no unread emails to show for the "{activeFilter}" category.</p>
                   </div>
                )}
            </div>
            
            <div className="mt-8 text-center">
                {nextPageToken && !error && (
                    <button onClick={handleLoadMore} disabled={isFetchingMore} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-wait">
                        {isFetchingMore ? 'Loading More...' : 'Load More'}
                    </button>
                )}
            </div>
        </div>
    );
};

const LoginPrompt = ({ handleSignIn }) => (
    <div className="text-center py-20 max-w-2xl mx-auto">
        <Icon path="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gray-800 mb-3">Focus on What Matters</h2>
        <p className="text-gray-600 mb-8 text-lg">Email Insight uses AI to summarize and categorize your unread emails, so you can clear your inbox faster. Connect your Google account to get started.</p>
        <button onClick={handleSignIn} className="flex items-center mx-auto space-x-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-lg shadow-lg hover:shadow-xl">
            <Icon path="M12 4.5v15m7.5-7.5h-15" className="w-6 h-6" />
            <span>Connect Your Google Account</span>
        </button>
    </div>
)


export default function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [knowledgeBase, setKnowledgeBase] = useState({ classification: "", reply: "" });
  const [isClassificationKBModalOpen, setIsClassificationKBModalOpen] = useState(false);
  const [isReplyKBModalOpen, setIsReplyKBModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "knowledgeBases", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setKnowledgeBase(docSnap.data());
        } else {
          setKnowledgeBase({ classification: "", reply: "" });
        }
      } else {
        setUser(null);
        setAccessToken(null);
        setKnowledgeBase({ classification: "", reply: "" });
      }
      setAuthError(null);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveClassificationKB = async (classificationData) => {
    if (!user) return;
    const docRef = doc(db, "knowledgeBases", user.uid);
    const newData = { ...knowledgeBase, classification: classificationData };
    try {
      await setDoc(docRef, newData);
      setKnowledgeBase(newData);
    } catch (error) {
      console.error("Error saving classification knowledge base:", error);
    }
  };
  
  const handleSaveReplyKB = async (replyData) => {
    if (!user) return;
    const docRef = doc(db, "knowledgeBases", user.uid);
    const newData = { ...knowledgeBase, reply: replyData };
    try {
      await setDoc(docRef, newData);
      setKnowledgeBase(newData);
    } catch (error) {
      console.error("Error saving reply knowledge base:", error);
    }
  };

  const handleOpenReplyModal = (email) => {
    setSelectedEmail(email);
    setIsReplyModalOpen(true);
  };

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) throw new Error("Could not get credential from result.");
      const token = credential.accessToken;
      setAccessToken(token);
    } catch (error) {
      console.error("Authentication Error:", error);
      setAuthError(error.message);
      setAccessToken(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign Out Error:", error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} />
      <main>
        {authError && <p className="text-red-500 text-center mt-4 bg-red-100 p-3 rounded-md">{authError}</p>}
        {user ? (
            <>
                <EmailDashboard 
                    accessToken={accessToken} 
                    knowledgeBase={knowledgeBase}
                    onOpenClassificationModal={() => setIsClassificationKBModalOpen(true)}
                    onOpenReplyKBModal={() => setIsReplyKBModalOpen(true)}
                    onReply={handleOpenReplyModal}
                />
                <ClassificationKnowledgeBaseModal 
                    isOpen={isClassificationKBModalOpen}
                    onClose={() => setIsClassificationKBModalOpen(false)}
                    onSave={handleSaveClassificationKB}
                    initialData={knowledgeBase.classification}
                />
                <ReplyKnowledgeBaseModal 
                    isOpen={isReplyKBModalOpen}
                    onClose={() => setIsReplyKBModalOpen(false)}
                    onSave={handleSaveReplyKB}
                    initialData={knowledgeBase.reply}
                />
                {selectedEmail && (
                    <ReplyModal
                        isOpen={isReplyModalOpen}
                        onClose={() => setIsReplyModalOpen(false)}
                        email={selectedEmail}
                        knowledgeBase={knowledgeBase.reply}
                        accessToken={accessToken}
                    />
                )}
            </>
        ) : (
            <LoginPrompt handleSignIn={handleSignIn} />
        )}
      </main>
    </div>
  );
}
