import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Toast Component
const Toast = ({ message, type = 'success', onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colors = {
    success: '#B4A1C4',
    error: '#8A6B8F',
    info: '#B4A1C4',
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      display: 'flex',
      alignItems: 'center',
      padding: '14px 20px',
      borderRadius: '8px',
      borderLeft: `1px solid ${colors[type]}`,
      background: `rgba(180, 161, 196, 0.15)`,
      minWidth: '280px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(8px)',
      animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 10000,
    }}>
      <span style={{
        fontSize: '18px',
        color: colors[type],
        marginRight: '12px',
        fontFamily: 'Georgia, serif',
      }}>
        ✦
      </span>
      <span style={{
        flex: 1,
        color: colors[type],
        fontSize: '14px',
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}>
        {message}
      </span>
    </div>
  );
};

// Wisteria Vine Edge Component - Left Side
const WisteriaVineLeft = () => (
  <svg
    width="120"
    height="100%"
    viewBox="0 0 120 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      zIndex: 1,
    }}
    preserveAspectRatio="none"
  >
    {/* Main vine */}
    <path d="M80 0 Q70 100 60 200 Q65 300 55 400 Q70 500 50 600 Q75 700 60 800 Q65 900 70 1000"
          stroke="#613775" strokeWidth="1.5" opacity="0.4" />

    {/* Flowers along vine */}
    {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880].map((y, i) => (
      <g key={`left-${i}`}>
        <circle cx="80" cy={y} r="10" fill="#613775" opacity={0.4 + (i % 3) * 0.2} filter="url(#glow)" />
        <circle cx="55" cy={y + 30} r="8" fill="#8B6B9F" opacity={0.3 + (i % 2) * 0.1} filter="url(#glow)" />
        <circle cx="100" cy={y + 40} r="7" fill="#7A5F87" opacity={0.35 + (i % 3) * 0.15} filter="url(#glow)" />
        <circle cx="40" cy={y + 60} r="8" fill="#9B7FB1" opacity={0.3 + (i % 2) * 0.15} filter="url(#glow)" />
      </g>
    ))}

    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Wisteria Vine Edge Component - Right Side
const WisteriaVineRight = () => (
  <svg
    width="120"
    height="100%"
    viewBox="0 0 120 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'fixed',
      right: 0,
      top: 0,
      pointerEvents: 'none',
      zIndex: 1,
    }}
    preserveAspectRatio="none"
  >
    {/* Main vine */}
    <path d="M40 0 Q50 100 60 200 Q55 300 65 400 Q50 500 70 600 Q45 700 60 800 Q55 900 50 1000"
          stroke="#613775" strokeWidth="1.5" opacity="0.4" />

    {/* Flowers along vine */}
    {[0, 80, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880].map((y, i) => (
      <g key={`right-${i}`}>
        <circle cx="40" cy={y} r="10" fill="#613775" opacity={0.4 + (i % 3) * 0.2} filter="url(#glow)" />
        <circle cx="65" cy={y + 30} r="8" fill="#8B6B9F" opacity={0.3 + (i % 2) * 0.1} filter="url(#glow)" />
        <circle cx="20" cy={y + 40} r="7" fill="#7A5F87" opacity={0.35 + (i % 3) * 0.15} filter="url(#glow)" />
        <circle cx="80" cy={y + 60} r="8" fill="#9B7FB1" opacity={0.3 + (i % 2) * 0.15} filter="url(#glow)" />
      </g>
    ))}

    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
  </svg>
);

// Fog Overlay Component
const FogOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(ellipse at 50% 30%, rgba(142, 147, 166, 0.08) 0%, rgba(49, 25, 64, 0.15) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  }} />
);

// Main App Component
export default function JarApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [jars, setJars] = useState([]);
  const [activeJar, setActiveJar] = useState(null);
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Auth forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Jar interactions
  const [jarName, setJarName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [activeTab, setActiveTab] = useState('questions');
  const [tagBack, setTagBack] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const user = data.session.user;
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        setCurrentUser({ id: user.id, email: user.email, username: profile?.username });
        setView('jar-select');
        loadJars(user.id);
      }
    };
    checkAuth();
  }, []);

  // Auth handlers
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      await supabase.from('profiles').insert([
        { id: data.user.id, username, email }
      ]);
      setCurrentUser({ id: data.user.id, email, username });
      setView('jar-select');
      setEmail('');
      setPassword('');
      setUsername('');
      showToast('Welcome to the Vault.', 'success');
    } catch (err) {
      showToast(`Sign up failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', data.user.id)
        .single();
      setCurrentUser({ id: data.user.id, email: data.user.email, username: profile?.username });
      setView('jar-select');
      setEmail('');
      setPassword('');
      showToast('Sanctuary found.', 'success');
    } catch (err) {
      showToast(`Login failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadJars = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('jar_members')
        .select('jar_id, jars(id, name, created_by)')
        .eq('user_id', userId);
      if (error) throw error;
      setJars(data.map(jm => jm.jars));
    } catch (err) {
      console.error('Failed to load jars:', err);
    }
  };

  const createJar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: jar, error } = await supabase
        .from('jars')
        .insert([{ name: jarName, created_by: currentUser.id }])
        .select()
        .single();
      if (error) throw error;

      await supabase.from('jar_members').insert([
        { jar_id: jar.id, user_id: currentUser.id }
      ]);

      setJars([...jars, jar]);
      setJarName('');
      showToast(`Vessel created: ${jarName}`, 'success');
    } catch (err) {
      showToast(`Jar creation failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectJar = async (jar) => {
    setActiveJar(jar);
    setView('jar-main');
    setActiveTab('questions');
    await loadRandomQuestion(jar.id, currentUser.id);
    await loadUserAnswers(currentUser.id);
  };

  const loadRandomQuestion = async (jarId, userId) => {
    try {
      const { data, error } = await supabase
        .rpc('get_random_question', { jar_id: jarId, exclude_user_id: userId });
      if (error) throw error;
      setCurrentQuestion(data);
    } catch (err) {
      console.error('Failed to load question:', err);
      setCurrentQuestion(null);
    }
  };

  const loadUserAnswers = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('answers')
        .select('question_id, questions(text), answer_text, created_at')
        .eq('user_id', userId);
      if (error) throw error;
      setUserAnswers(data || []);
    } catch (err) {
      console.error('Failed to load answers:', err);
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('questions').insert([
        { jar_id: activeJar.id, user_id: currentUser.id, text: questionText }
      ]);
      setQuestionText('');
      showToast('Question cast into the mist.', 'success');
    } catch (err) {
      showToast(`Failed to add question: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from('answers').insert([
        {
          question_id: currentQuestion.id,
          user_id: currentUser.id,
          answer_text: answerText,
        }
      ]);

      // If Tag Back is checked, ask the question back to the original author
      if (tagBack && currentQuestion) {
        await supabase.from('questions').insert([
          {
            jar_id: activeJar.id,
            user_id: currentQuestion.user_id,
            text: currentQuestion.text,
            ask_back_from: currentUser.id
          }
        ]);
      }

      setAnswerText('');
      setTagBack(false);
      await loadRandomQuestion(activeJar.id, currentUser.id);
      await loadUserAnswers(currentUser.id);
      showToast('Truth whispered into the night.', 'success');
    } catch (err) {
      showToast(`Failed to submit answer: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: 'Cormorant Garamond', Georgia, serif;
          background: linear-gradient(135deg, #0a0a12 0%, #1a1428 50%, #0f0f18 100%);
          color: #E8EAEE;
          line-height: 1.6;
        }

        input, textarea, button {
          font-family: 'Cormorant Garamond', Georgia, serif;
          color: inherit;
        }

        input, textarea {
          background: rgba(26, 27, 36, 0.8);
          border: 1px solid rgba(97, 55, 117, 0.4);
          padding: 14px 16px;
          border-radius: 12px;
          color: #E8EAEE;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(8px);
        }

        input:focus, textarea:focus {
          outline: none;
          background: rgba(97, 55, 117, 0.12);
          border-color: #B4A1C4;
          box-shadow: 0 0 24px rgba(97, 55, 117, 0.4), inset 0 0 12px rgba(97, 55, 117, 0.1);
        }

        button {
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(400px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      <FogOverlay />
      <WisteriaVineLeft />
      <WisteriaVineRight />

      {view === 'landing' && (
        <div style={styles.landing} className="fade-in">
          <div style={styles.landingContent}>
            <h1 style={styles.title}>I'M CURIOUS...</h1>
            <button onClick={() => setView('auth')} style={styles.heroButton}>
              Enter the Collective Vault
            </button>
          </div>
        </div>
      )}

      {view === 'auth' && (
        <div style={styles.authContainer}>
          <div style={styles.authBox}>
            <h2 style={{ ...styles.heading, marginBottom: '32px', textAlign: 'center', fontSize: '32px' }}>
              {authMode === 'login' ? 'Return' : 'Begin'}
            </h2>

            <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                />
              </div>

              {authMode === 'signup' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Your name"
                    style={styles.input}
                  />
                </div>
              )}

              <button type="submit" disabled={loading} style={styles.primaryButton}>
                {loading ? 'Loading...' : authMode === 'login' ? 'Enter' : 'Begin'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                style={styles.toggleButton}
              >
                {authMode === 'login' ? 'Create an account' : 'Already have one?'}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'jar-select' && (
        <div style={styles.jarSelectContainer}>
          <div style={styles.jarHeader}>
            <h2 style={styles.heading}>Your Vaults</h2>
            <span style={styles.username}>{currentUser?.username}</span>
          </div>

          <div style={styles.jarsGrid}>
            {jars.map((jar) => (
              <div
                key={jar.id}
                onClick={() => selectJar(jar)}
                style={styles.jarCard}
              >
                <h3 style={styles.jarTitle}>{jar.name}</h3>
                <p style={styles.jarMeta}>Created by {jar.created_by === currentUser.id ? 'you' : 'another'}</p>
              </div>
            ))}

            <div style={styles.createJarCard}>
              <form onSubmit={createJar} style={styles.form}>
                <h3 style={{ ...styles.jarTitle, marginBottom: '16px' }}>+ Create Vault</h3>
                <input
                  type="text"
                  placeholder="Name your vault..."
                  value={jarName}
                  onChange={(e) => setJarName(e.target.value)}
                  required
                  style={{ ...styles.input, marginBottom: '12px' }}
                />
                <button type="submit" disabled={loading} style={{ ...styles.primaryButton, width: '100%' }}>
                  Create
                </button>
              </form>
            </div>
          </div>

          <button onClick={() => supabase.auth.signOut().then(() => setView('landing'))} style={styles.logout}>
            Return to Sanctuary
          </button>
        </div>
      )}

      {view === 'jar-main' && activeJar && (
        <div style={styles.jarMainContainer}>
          <div style={styles.jarMainHeader}>
            <button onClick={() => setView('jar-select')} style={styles.backButton}>← Back</button>
            <h2 style={styles.heading}>I'M CURIOUS...</h2>
          </div>

          {/* Current Question - Drawing from the Mist */}
          <div style={styles.mainQuestionSection}>
            {currentQuestion ? (
              <>
                <button
                  onClick={() => loadRandomQuestion(activeJar.id, currentUser.id)}
                  style={styles.drawButton}
                >
                  ⋮ Draw A Question ⋮
                </button>

                <div style={styles.questionBoxContainer}>
                  <p style={styles.questionText}>{currentQuestion.text}</p>

                  <form onSubmit={submitAnswer} style={styles.form}>
                    <textarea
                      placeholder="Add a question to the vault..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      required
                      style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#8A8E9E', fontSize: '13px' }}>
                      <input
                        type="checkbox"
                        id="tagback-checkbox"
                        checked={tagBack}
                        onChange={(e) => setTagBack(e.target.checked)}
                        style={{ cursor: 'pointer' }}
                      />
                      <label htmlFor="tagback-checkbox" style={{ cursor: 'pointer', margin: 0 }}>Tag Back?</label>
                    </div>
                    <div style={styles.buttonRow}>
                      <button type="submit" disabled={loading} style={{ ...styles.primaryButton, flex: 1 }}>
                        Submit Answer
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div style={styles.emptyQuestionBox}>
                <p style={styles.emptyState}>No more questions in the mist...</p>
                <button
                  onClick={() => loadRandomQuestion(activeJar.id, currentUser.id)}
                  style={styles.drawButton}
                >
                  ⋮ Draw A Question ⋮
                </button>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div style={styles.tabNav}>
            <button
              onClick={() => setActiveTab('questions')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'questions' ? styles.tabButtonActive : {}),
              }}
            >
              ADD QUESTION
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              style={{
                ...styles.tabButton,
                ...(activeTab === 'memories' ? styles.tabButtonActive : {}),
              }}
            >
              Past Answers
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'questions' && (
            <div style={styles.tabContent}>
              <form onSubmit={addQuestion} style={styles.form}>
                <textarea
                  placeholder="Who are you really..?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                />
                <button type="submit" disabled={loading} style={{ ...styles.primaryButton, width: '100%' }}>
                  Cast into Mist
                </button>
              </form>
            </div>
          )}

          {activeTab === 'memories' && (
            <div style={styles.tabContent}>
              <div style={styles.answersList}>
                {userAnswers.length === 0 ? (
                  <p style={styles.emptyState}>No memories yet. Answer a question to start.</p>
                ) : (
                  userAnswers.map((answer, idx) => (
                    <div key={idx} style={styles.answerCard}>
                      <p style={styles.answerQuestion}>Q: {answer.questions.text}</p>
                      <p style={styles.answerText}>{answer.answer_text}</p>
                      <p style={styles.answerDate}>
                        {new Date(answer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a12 0%, #1a1428 50%, #0f0f18 100%)',
    color: '#E8EAEE',
    position: 'relative',
    overflow: 'hidden',
  },

  // Landing
  landing: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    zIndex: 2,
  },
  landingContent: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  title: {
    fontSize: '64px',
    fontWeight: 300,
    marginBottom: '16px',
    letterSpacing: '4px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    color: '#E8EAEE',
  },
  subtitle: {
    display: 'none',
  },
  landingDescription: {
    display: 'none',
  },
  heroButton: {
    background: 'rgba(97, 55, 117, 0.2)',
    border: '1px solid rgba(180, 161, 196, 0.5)',
    padding: '14px 40px',
    borderRadius: '24px',
    color: '#B4A1C4',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '0.5px',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 0 30px rgba(97, 55, 117, 0.2)',
  },

  // Auth
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    zIndex: 2,
  },
  authBox: {
    background: 'rgba(26, 27, 36, 0.7)',
    border: '1px solid rgba(97, 55, 117, 0.3)',
    borderRadius: '20px',
    padding: '48px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 8px 48px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(97, 55, 117, 0.08)',
    backdropFilter: 'blur(16px)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#8A8E9E',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  input: {
    background: 'rgba(26, 27, 36, 0.8)',
    border: '1px solid rgba(97, 55, 117, 0.4)',
    padding: '14px 16px',
    borderRadius: '12px',
    color: '#E8EAEE',
    fontSize: '14px',
  },
  primaryButton: {
    background: 'rgba(97, 55, 117, 0.2)',
    border: '1px solid rgba(180, 161, 196, 0.4)',
    padding: '12px 28px',
    borderRadius: '24px',
    color: '#B4A1C4',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    backdropFilter: 'blur(8px)',
  },
  secondaryButton: {
    background: 'transparent',
    border: '1px solid rgba(97, 55, 117, 0.3)',
    padding: '12px 28px',
    borderRadius: '24px',
    color: '#8A8E9E',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  toggleButton: {
    background: 'transparent',
    border: 'none',
    padding: '8px 16px',
    color: '#8A8E9E',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    transition: 'color 0.3s',
  },

  // Jar Select
  jarSelectContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
    position: 'relative',
    zIndex: 2,
  },
  jarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
    paddingBottom: '24px',
    borderBottom: '1px solid rgba(97, 55, 117, 0.2)',
  },
  username: {
    fontSize: '14px',
    color: '#8A8E9E',
    fontWeight: 300,
  },
  heading: {
    fontSize: '48px',
    fontWeight: 300,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '1px',
    color: '#E8EAEE',
  },
  jarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  jarCard: {
    background: 'rgba(97, 55, 117, 0.08)',
    border: '1px solid rgba(97, 55, 117, 0.2)',
    borderRadius: '16px',
    padding: '28px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(8px)',
  },
  jarTitle: {
    fontSize: '18px',
    fontWeight: 400,
    marginBottom: '8px',
    color: '#B4A1C4',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },
  jarMeta: {
    fontSize: '13px',
    color: '#8A8E9E',
  },
  createJarCard: {
    background: 'rgba(97, 55, 117, 0.08)',
    border: '1px dashed rgba(97, 55, 117, 0.3)',
    borderRadius: '16px',
    padding: '28px',
    backdropFilter: 'blur(8px)',
  },
  logout: {
    background: 'transparent',
    border: '1px solid rgba(97, 55, 117, 0.2)',
    padding: '12px 24px',
    borderRadius: '20px',
    color: '#8A8E9E',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
  },

  // Jar Main
  jarMainContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    position: 'relative',
    zIndex: 2,
  },
  jarMainHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '48px',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid rgba(97, 55, 117, 0.3)',
    padding: '10px 16px',
    borderRadius: '8px',
    color: '#8A8E9E',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    transition: 'all 0.3s',
  },
  mainQuestionSection: {
    marginBottom: '40px',
  },
  drawButton: {
    width: '100%',
    background: 'rgba(97, 55, 117, 0.2)',
    border: '1px solid rgba(180, 161, 196, 0.4)',
    padding: '16px',
    borderRadius: '24px',
    color: '#B4A1C4',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 400,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '1px',
    backdropFilter: 'blur(8px)',
    marginBottom: '24px',
    boxShadow: '0 0 30px rgba(97, 55, 117, 0.15)',
  },
  questionBoxContainer: {
    background: 'rgba(26, 27, 36, 0.6)',
    border: '1px solid rgba(97, 55, 117, 0.25)',
    borderRadius: '16px',
    padding: '32px',
    backdropFilter: 'blur(12px)',
  },
  questionText: {
    fontSize: '18px',
    fontWeight: 300,
    marginBottom: '28px',
    lineHeight: '1.8',
    color: '#E8EAEE',
    fontStyle: 'italic',
    letterSpacing: '0.3px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  emptyQuestionBox: {
    background: 'rgba(26, 27, 36, 0.5)',
    border: '1px solid rgba(97, 55, 117, 0.2)',
    borderRadius: '16px',
    padding: '48px 32px',
    textAlign: 'center',
    backdropFilter: 'blur(8px)',
  },
  emptyState: {
    fontSize: '16px',
    color: '#B4A1C4',
    marginBottom: '24px',
    fontWeight: 300,
  },
  tabNav: {
    display: 'flex',
    borderBottom: '1px solid rgba(97, 55, 117, 0.2)',
    marginBottom: '24px',
    gap: '0',
  },
  tabButton: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '16px',
    color: '#8A8E9E',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 400,
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s',
  },
  tabButtonActive: {
    color: '#B4A1C4',
    borderBottomColor: '#B4A1C4',
  },
  tabContent: {
    animation: 'fadeIn 0.3s ease-out',
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  answerCard: {
    background: 'rgba(97, 55, 117, 0.08)',
    border: '1px solid rgba(97, 55, 117, 0.15)',
    borderRadius: '12px',
    padding: '16px',
    fontSize: '14px',
  },
  answerQuestion: {
    color: '#B4A1C4',
    marginBottom: '8px',
    fontWeight: 400,
    fontSize: '13px',
  },
  answerText: {
    color: '#E8EAEE',
    lineHeight: '1.6',
    marginBottom: '8px',
    fontWeight: 300,
  },
  answerDate: {
    fontSize: '12px',
    color: '#8A8E9E',
  },
};