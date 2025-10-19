import { useState, useRef, useEffect } from 'react';
import './App.css';
import { generateContent } from './constants';

function App() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]); // current chat
  const [history, setHistory] = useState([]); // all previous chats
  const [loading, setLoading] = useState(false);
  const responsesEndRef = useRef(null);

  const scrollToBottom = () => {
    responsesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => scrollToBottom(), [responses]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    // Add user question to current chat
    setResponses(prev => [...prev, { sender: 'user', text: question }]);
    setQuestion('');
    setLoading(true);

    try {
      const data = await generateContent(question);

      const aiAnswer = data?.candidates?.length > 0
        ? data.candidates[0].content.parts[0].text
        : 'No response from AI.';

      // Add AI answer to current chat
      setResponses(prev => [...prev, { sender: 'ai', text: aiAnswer }]);

      // Save full Q&A to history
      setHistory(prev => [
        { question: question, answer: aiAnswer },
        ...prev // latest first
      ]);

    } catch {
      setResponses(prev => [...prev, { sender: 'ai', text: 'Error fetching response.' }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) askQuestion();
  };

  return (
    <div className="app-container">
      {/* Input */}
      <div className="input-bar">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
        />
        <button onClick={askQuestion} disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </div>

      {/* Current Chat Responses */}
      <div className="responses-container">
        {responses.map((res, idx) => (
          <div key={idx} className={`response ${res.sender}`}>
            {res.text}
          </div>
        ))}

        {loading && (
          <div className="response ai">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}
        <div ref={responsesEndRef} />
      </div>

      {/* History Section */}
      <div className="history-container">
        <h3>Chat History</h3>
        {history.length === 0 && <p>No chats yet.</p>}
        {history.map((item, idx) => (
          <div key={idx} className="history-item">
            <strong>Q:</strong> {item.question} <br />
            <strong>A:</strong> {item.answer}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


