import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Star } from 'lucide-react';

const JamieAI = () => {
  // User information state
  const [userInfo, setUserInfo] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(true);
  
  // Chat state
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('untested');
  const [demoMode, setDemoMode] = useState(false); // Start with real backend
  
  // Refs
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Test connection to backend
  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: "test connection" }),
      });
      
      if (response.ok) {
        setConnectionStatus('connected');
        console.log('✅ Backend connection successful');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      setConnectionStatus('failed');
    }
  };

  // Demo mode responses
  const getDemoResponse = (message) => {
    const responses = [
      "I really appreciate you asking about this... it's been weighing on my mind a lot. My parents sacrificed so much to come here and they always talked about me becoming an engineer. But when I'm in my design classes, I just feel... alive, you know?",
      
      "It's really hard because I see the disappointment in their eyes when I even mention art. They keep saying 'art doesn't pay the bills' and 'we didn't come to America for you to struggle as an artist.' But I'm struggling now too, just in a different way.",
      
      "Sometimes I wonder if I'm being selfish. Like, maybe I should just push through engineering for them? But then I think about spending my whole life doing something that doesn't inspire me... that feels wrong too.",
      
      "You know what's funny? When I was little, my mom used to love my drawings. She'd put them on the fridge and brag to her friends. But somewhere along the way, that changed to 'drawing is just a hobby, focus on real subjects.'",
      
      "I've been looking at some art schools and design programs, and there are actually really good career prospects. UX design, industrial design, even engineering roles that are more creative. But how do I even start that conversation at home?",
      
      "The guilt is probably the hardest part. Like, they worked so hard to give me opportunities, and here I am wanting to 'throw it away' for something they see as frivolous. But I don't think they understand that I'm not throwing anything away - I'm trying to find where I actually belong.",
      
      "I've been doing some research on successful artists and designers, and many of them actually have technical backgrounds. Maybe there's a way to honor both parts of myself? I just don't know how to explain that to my parents without them thinking I'm making excuses.",
      
      "What really gets to me is when they compare me to my cousin who's doing well in computer science. They're like 'why can't you just be practical like her?' But they don't see how miserable I am in my current classes, or how excited I get when I'm working on creative projects."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getDemoScore = () => ({
    framing: Math.random() * 0.3 + 0.65,
    alternatives: Math.random() * 0.3 + 0.55,
    information: Math.random() * 0.3 + 0.60,
    values: Math.random() * 0.3 + 0.70,
    reasoning: Math.random() * 0.3 + 0.62,
    commitment: Math.random() * 0.3 + 0.58
  });

  // Scroll to bottom when new messages arrive (optimized)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);

  // Test connection on mount
  useEffect(() => {
    if (!demoMode) {
      testConnection();
    }
  }, [demoMode]);

  // User info form component
  const UserInfoModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      affiliation: '',
      notes: ''
    });

    const handleSubmit = () => {
      if (!formData.name || !formData.email) return;
      setUserInfo(formData);
      setShowUserInfoModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot className="w-8 h-8 text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to JamieAI</h2>
            <p className="text-gray-600 leading-relaxed">
              You'll be coaching Jamie, a sophomore mechanical engineering student considering switching to art/design. 
              Please provide some basic information to get started.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliation
              </label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({...formData, affiliation: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="University, Company, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Any additional context or notes..."
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.email}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Coaching Session
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Decision Quality Score visualization
  const DQScoreDisplay = ({ scores, className = "" }) => {
    const dimensions = [
      { key: 'framing', label: 'Framing', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
      { key: 'alternatives', label: 'Alternatives', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600' },
      { key: 'information', label: 'Information', color: 'bg-gradient-to-r from-amber-500 to-amber-600' },
      { key: 'values', label: 'Values', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
      { key: 'reasoning', label: 'Reasoning', color: 'bg-gradient-to-r from-red-500 to-red-600' },
      { key: 'commitment', label: 'Commitment', color: 'bg-gradient-to-r from-indigo-500 to-indigo-600' }
    ];

    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;

    return (
      <div className={`${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
            <Star className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Decision Quality Score</h3>
            <p className="text-lg font-bold text-gray-900">{avgScore.toFixed(1)}/1.0</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {dimensions.map(dim => (
            <div key={dim.key} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-gray-700">
                <span>{dim.label}</span>
                <span className="text-gray-600">{scores[dim.key]?.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                <div
                  className={`${dim.color} h-2.5 rounded-full transition-all duration-500 shadow-sm`}
                  style={{ width: `${scores[dim.key] * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Individual message component
  const ChatMessage = ({ message, isUser, dqScore, timestamp, isError, showDemoButton }) => {
    return (
      <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
        {!isUser && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-md">
            <Bot className="w-5 h-5 text-pink-600" />
          </div>
        )}
        
        <div className={`max-w-[70%] ${isUser ? 'order-2' : ''}`}>
          <div
            className={`p-5 rounded-3xl shadow-sm ${
              isUser
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto shadow-blue-200/50'
                : isError
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-white text-gray-800 shadow-gray-200/50 border border-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap">{message}</p>
            
            {showDemoButton && (
              <button
                onClick={() => setDemoMode(true)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Try Demo Mode
              </button>
            )}
          </div>
          
          {isUser && dqScore && (
            <div className="mt-4 p-5 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50 max-w-lg shadow-sm">
              <DQScoreDisplay scores={dqScore} />
            </div>
          )}
          
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        </div>
        
        {isUser && (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 order-3 shadow-md">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>
    );
  };

  // Typing indicator
  const TypingIndicator = () => (
    <div className="flex gap-3 justify-start mb-6">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center flex-shrink-0 shadow-md">
        <Bot className="w-5 h-5 text-pink-600" />
      </div>
      <div className="bg-white text-gray-800 p-5 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );

  // Send message function
  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const messageText = currentMessage.trim();
    setCurrentMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
      userInfo
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Handle demo mode
    if (demoMode) {
      setTimeout(() => {
        const dqScore = getDemoScore();
        const jamieReply = getDemoResponse(messageText);
        
        // Update user message with demo DQ score
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, dqScore }
            : msg
        ));

        // Add Jamie's demo response
        const jamieMessage = {
          id: Date.now() + 1,
          message: jamieReply,
          isUser: false,
          timestamp: new Date().toISOString(),
          sessionId: "demo-session",
          userId: "demo-user"
        };

        setMessages(prev => [...prev, jamieMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1500 + Math.random() * 1000);
      return;
    }

    try {
      console.log('Sending message to API:', messageText);
      
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Update user message with DQ score
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, dqScore: data.dq_score }
          : msg
      ));

      // Add Jamie's response
      const jamieMessage = {
        id: Date.now() + 1,
        message: data.jamie_reply,
        isUser: false,
        timestamp: data.timestamp,
        sessionId: data.session_id,
        userId: data.user_id
      };

      setMessages(prev => [...prev, jamieMessage]);
      setConnectionStatus('connected');

    } catch (error) {
      console.error('Detailed error sending message:', error);
      setConnectionStatus('failed');
      
      // Show error message and offer demo mode
      let errorText = "I'm having trouble connecting to the backend. ";
      
      if (error.message.includes('fetch')) {
        errorText += "This might be a network issue or the backend may be sleeping. ";
      } else if (error.message.includes('500')) {
        errorText += "The backend returned an error. ";
      }
      
      errorText += "Would you like to try demo mode instead?";
      
      const errorMessage = {
        id: Date.now() + 1,
        message: errorText,
        isUser: false,
        timestamp: new Date().toISOString(),
        isError: true,
        showDemoButton: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Handle message input change (optimized to prevent flashing)
  const handleMessageChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  // Handle enter key (optimized)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {showUserInfoModal && <UserInfoModal />}
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Jamie {demoMode && <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Demo</span>}
            </h1>
            <p className="text-sm text-gray-600">Mechanical Engineering Student</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Demo mode switch */}
          {demoMode ? (
            <button
              onClick={() => {
                setDemoMode(false);
                testConnection();
              }}
              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Try Real Backend
            </button>
          ) : (
            /* Connection Status */
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'failed' ? 'bg-red-500' :
                connectionStatus === 'testing' ? 'bg-yellow-500' :
                'bg-gray-400'
              }`} />
              <span className="text-gray-600">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'failed' ? 'Connection Failed' :
                 connectionStatus === 'testing' ? 'Testing...' :
                 'Not Connected'}
              </span>
              {connectionStatus === 'failed' && (
                <button
                  onClick={testConnection}
                  className="text-blue-600 hover:text-blue-700 text-xs underline"
                >
                  Test Again
                </button>
              )}
            </div>
          )}
          
          {userInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Coach: {userInfo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 chat-container"
      >
        <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Bot className="w-10 h-10 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Start Coaching Jamie {demoMode && <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full ml-2">Demo Mode</span>}
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
              Jamie is a sophomore mechanical engineering student considering switching to art/design. 
              She's worried about disappointing her immigrant parents. How would you coach her?
            </p>
            
            {!demoMode && connectionStatus === 'failed' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-4">
                <p className="text-yellow-800 text-sm mb-3">
                  ⚠️ Can't connect to the backend. This might be because:
                </p>
                <ul className="text-yellow-700 text-xs mb-3 list-disc list-inside space-y-1">
                  <li>Backend is sleeping (Render.com free tier)</li>
                  <li>Network connectivity issue</li>
                  <li>Backend configuration problem</li>
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={testConnection}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Retry Connection
                  </button>
                  <button
                    onClick={() => setDemoMode(true)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Use Demo Mode
                  </button>
                </div>
              </div>
            )}
            
            {demoMode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto mb-4">
                <p className="text-blue-800 text-sm mb-3">
                  🎭 Demo mode active - Jamie will respond with simulated conversations and DQ scores.
                </p>
                <button
                  onClick={() => {
                    setDemoMode(false);
                    testConnection();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Try Real Backend
                </button>
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            dqScore={msg.dqScore}
            timestamp={msg.timestamp}
            isError={msg.isError}
            showDemoButton={msg.showDemoButton}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-6 shadow-lg">
        <div className="flex gap-4 max-w-4xl mx-auto">
          <textarea
            value={currentMessage}
            onChange={handleMessageChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your coaching message to Jamie..."
            className="flex-1 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[52px] max-h-32 bg-white/90 shadow-sm transition-all duration-200"
            rows="1"
            disabled={isLoading}
            style={{ 
              transition: 'none',
              height: 'auto',
              minHeight: '52px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !currentMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JamieAI;
