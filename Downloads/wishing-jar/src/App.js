import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase - will use environment variables in Vercel
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function JarApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [jars, setJars] = useState([]);
  const [activeJar, setActiveJar] = useState(null);
  const [view, setView] = useState('landing'); // landing, auth, jar-select, jar-main
  const [authMode, setAuthMode] = useState('login'); // login or signup
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      alert(`Sign up failed: ${err.message}`);
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
    } catch (err) {
      alert(`Login failed: ${err.message}`);
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
      
      // Add creator as member
      await supabase.from('jar_members').insert([
        { jar_id: jar.id, user_id: currentUser.id }
      ]);
      
      setJars([...jars, jar]);
      setJarName('');
      setView('jar-select');
    } catch (err) {
      alert(`Jar creation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectJar = async (jar) => {
    setActiveJar(jar);
    setView('jar-main');
    // Load random question
    await loadRandomQuestion(jar.id, currentUser.id);
    // Load user's answers
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
      alert('Question added!');
    } catch (err) {
      alert(`Failed to add question: ${err.message}`);
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
      setAnswerText('');
      // Load next question
      await loadRandomQuestion(activeJar.id, currentUser.id);
      await loadUserAnswers(currentUser.id);
    } catch (err) {
      alert(`Failed to submit answer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const askBack = async () => {
    if (!currentQuestion) return;
    try {
      await supabase.from('questions').insert([
        {
          jar_id: activeJar.id,
          user_id: currentQuestion.user_id,
          text: currentQuestion.text,
          ask_back_from: currentUser.id
        }
      ]);
      alert('Question sent back!');
    } catch (err) {
      alert(`Failed to ask back: ${err.message}`);
    }
  };

  // Hydrangea SVG icon
  const HydrangeaIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
      <circle cx="8" cy="4" r="1.5" fill="#b4a7d6"/>
      <circle cx="5" cy="6" r="1.5" fill="#b4a7d6"/>
      <circle cx="11" cy="6" r="1.5" fill="#b4a7d6"/>
      <circle cx="4" cy="9" r="1.5" fill="#b4a7d6"/>
      <circle cx="12" cy="9" r="1.5" fill="#b4a7d6"/>
      <circle cx="8" cy="11" r="1.5" fill="#b4a7d6"/>
    </svg>
  );

  return (
    <div style={styles.container}>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: #1a1a2e;
          color: #f5f3f0;
          line-height: 1.6;
        }

        input, textarea, button {
          font-family: inherit;
          color: inherit;
        }

        input, textarea {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(180, 167, 214, 0.3);
          padding: 12px;
          border-radius: 8px;
          color: #f5f3f0;
          transition: all 0.2s;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #b4a7d6;
          box-shadow: 0 0 12px rgba(180, 167, 214, 0.2);
        }

        button {
          background: linear-gradient(135deg, #b4a7d6 0%, #9b8fa3 100%);
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(180, 167, 214, 0.2);
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(180, 167, 214, 0.3);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

      {view === 'landing' && (
        <div style={styles.landing}>
          <div style={styles.landingContent}>
            <h1 style={styles.title}>The Wishing Jar</h1>
            <p style={styles.subtitle}>Ask questions. Discover answers. Get to know someone.</p>
            <button onClick={() => setView('auth')} style={styles.primaryButton}>
              Begin
            </button>
          </div>
          <div style={styles.botanicalAccent}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="30" r="8" fill="#b4a7d6" opacity="0.8"/>
              <circle cx="40" cy="50" r="8" fill="#b4a7d6" opacity="0.8"/>
              <circle cx="80" cy="50" r="8" fill="#b4a7d6" opacity="0.8"/>
              <circle cx="30" cy="70" r="8" fill="#b4a7d6" opacity="0.8"/>
              <circle cx="90" cy="70" r="8" fill="#b4a7d6" opacity="0.8"/>
              <circle cx="60" cy="90" r="8" fill="#b4a7d6" opacity="0.8"/>
              <path d="M60 30 Q50 50 40 70 Q30 85 35 100" stroke="#7a8e6f" strokeWidth="2" fill="none" opacity="0.5"/>
              <path d="M60 30 Q70 50 80 70 Q90 85 85 100" stroke="#7a8e6f" strokeWidth="2" fill="none" opacity="0.5"/>
            </svg>
          </div>
        </div>
      )}

      {view === 'auth' && (
        <div style={styles.authContainer}>
          <div style={styles.authBox}>
            <h2 style={{ ...styles.heading, marginBottom: '24px' }}>
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={authMode === 'login' ? handleLogin : handleSignUp} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                    style={styles.input}
                  />
                </div>
              )}

              <button type="submit" disabled={loading} style={styles.primaryButton}>
                {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                style={styles.secondaryButton}
              >
                {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'jar-select' && (
        <div style={styles.jarSelectContainer}>
          <div style={styles.header}>
            <h2 style={styles.heading}>Your Jars</h2>
            <span style={styles.username}>
              <HydrangeaIcon /> {currentUser?.username}
            </span>
          </div>

          <div style={styles.jarsGrid}>
            {jars.map((jar) => (
              <div
                key={jar.id}
                onClick={() => selectJar(jar)}
                style={styles.jarCard}
              >
                <h3 style={styles.jarTitle}>{jar.name}</h3>
                <p style={styles.jarMeta}>Created by {jar.created_by === currentUser.id ? 'you' : 'someone'}</p>
                <button style={{ ...styles.primaryButton, width: '100%', marginTop: '12px' }}>
                  Enter
                </button>
              </div>
            ))}

            <div style={styles.createJarCard}>
              <form onSubmit={createJar} style={styles.form}>
                <h3 style={{ ...styles.jarTitle, marginBottom: '12px' }}>Create New Jar</h3>
                <input
                  type="text"
                  placeholder="Jar name..."
                  value={jarName}
                  onChange={(e) => setJarName(e.target.value)}
                  required
                  style={styles.input}
                />
                <button type="submit" disabled={loading} style={{ ...styles.primaryButton, width: '100%', marginTop: '12px' }}>
                  Create
                </button>
              </form>
            </div>
          </div>

          <button onClick={() => supabase.auth.signOut().then(() => setView('landing'))} style={styles.logout}>
            Sign Out
          </button>
        </div>
      )}

      {view === 'jar-main' && activeJar && (
        <div style={styles.jarMainContainer}>
          <div style={styles.jarHeader}>
            <button onClick={() => setView('jar-select')} style={styles.backButton}>← Back</button>
            <h2 style={styles.heading}>{activeJar.name}</h2>
            <div style={styles.navTabs}>
              {/* Tab navigation could go here */}
            </div>
          </div>

          <div style={styles.mainContent}>
            {/* Left: Questions & Answers */}
            <div style={styles.questionSection}>
              <h3 style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                <HydrangeaIcon /> Add a Question
              </h3>
              <form onSubmit={addQuestion} style={styles.form}>
                <textarea
                  placeholder="What do you want to know?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  style={{ ...styles.input, minHeight: '80px', resize: 'none' }}
                />
                <button type="submit" disabled={loading} style={{ ...styles.primaryButton, width: '100%', marginTop: '12px' }}>
                  Add Question
                </button>
              </form>

              <div style={{ ...styles.divider, margin: '32px 0' }}>
                <span style={styles.dividerText}>Your Answers</span>
              </div>

              <div style={styles.answersList}>
                {userAnswers.length === 0 ? (
                  <p style={styles.emptyState}>No answers yet. Answer a question to get started!</p>
                ) : (
                  userAnswers.map((answer, idx) => (
                    <div key={idx} style={styles.answerCard}>
                      <p style={styles.answerQuestion}>Q: {answer.questions.text}</p>
                      <p style={styles.answerText}>A: {answer.answer_text}</p>
                      <p style={styles.answerDate}>
                        {new Date(answer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Current Question */}
            <div style={styles.currentQuestionSection}>
              {currentQuestion ? (
                <div style={styles.questionBox}>
                  <div style={styles.questionHeader}>
                    <h3 style={styles.sectionTitle}>Your Turn</h3>
                    <HydrangeaIcon />
                  </div>
                  <p style={styles.questionDisplay}>{currentQuestion.text}</p>

                  <form onSubmit={submitAnswer} style={styles.form}>
                    <textarea
                      placeholder="Your answer..."
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      required
                      style={{ ...styles.input, minHeight: '100px', resize: 'none' }}
                    />
                    <button type="submit" disabled={loading} style={{ ...styles.primaryButton, width: '100%', marginTop: '12px' }}>
                      Submit Answer
                    </button>
                  </form>

                  <button onClick={askBack} style={{ ...styles.secondaryButton, width: '100%', marginTop: '12px' }}>
                    Ask it Back
                  </button>

                  <button
                    onClick={() => loadRandomQuestion(activeJar.id, currentUser.id)}
                    style={{ ...styles.skipButton, width: '100%', marginTop: '8px' }}
                  >
                    Skip
                  </button>
                </div>
              ) : (
                <div style={styles.emptyQuestionBox}>
                  <p style={styles.emptyState}>No more questions right now!</p>
                  <p style={styles.emptySubtext}>Add one or wait for others to ask.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#1a1a2e',
    color: '#f5f3f0',
  },

  // Landing
  landing: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  landingContent: {
    flex: 1,
    maxWidth: '500px',
  },
  title: {
    fontSize: '64px',
    fontWeight: 700,
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #b4a7d6, #9b8fa3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'Georgia, serif',
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '32px',
    color: '#c0b5d8',
    fontWeight: 300,
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #b4a7d6 0%, #9b8fa3 100%)',
    border: 'none',
    padding: '16px 40px',
    borderRadius: '8px',
    color: '#1a1a2e',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 600,
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(180, 167, 214, 0.2)',
  },
  botanicalAccent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Auth
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  authBox: {
    background: 'rgba(180, 167, 214, 0.08)',
    border: '1px solid rgba(180, 167, 214, 0.2)',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
    fontSize: '14px',
    fontWeight: 500,
    color: '#c0b5d8',
  },
  input: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(180, 167, 214, 0.3)',
    padding: '12px',
    borderRadius: '8px',
    color: '#f5f3f0',
    fontSize: '14px',
  },
  secondaryButton: {
    background: 'transparent',
    border: '1px solid rgba(180, 167, 214, 0.4)',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#b4a7d6',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },

  // Jar Select
  jarSelectContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(180, 167, 214, 0.2)',
  },
  username: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    color: '#c0b5d8',
  },
  heading: {
    fontSize: '40px',
    fontWeight: 700,
    fontFamily: 'Georgia, serif',
    marginBottom: '20px',
  },
  jarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  jarCard: {
    background: 'rgba(180, 167, 214, 0.08)',
    border: '1px solid rgba(180, 167, 214, 0.2)',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  jarTitle: {
    fontSize: '20px',
    fontWeight: 600,
    marginBottom: '8px',
    color: '#b4a7d6',
  },
  jarMeta: {
    fontSize: '14px',
    color: '#9b8fa3',
  },
  createJarCard: {
    background: 'rgba(122, 142, 111, 0.08)',
    border: '2px dashed rgba(122, 142, 111, 0.3)',
    borderRadius: '12px',
    padding: '24px',
  },
  logout: {
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#f5f3f0',
    cursor: 'pointer',
    fontSize: '14px',
  },

  // Jar Main
  jarMainContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px',
  },
  jarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(180, 167, 214, 0.2)',
  },
  backButton: {
    background: 'transparent',
    border: '1px solid rgba(180, 167, 214, 0.4)',
    padding: '8px 16px',
    borderRadius: '6px',
    color: '#b4a7d6',
    cursor: 'pointer',
    fontSize: '14px',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
  },
  questionSection: {
    background: 'rgba(180, 167, 214, 0.05)',
    border: '1px solid rgba(180, 167, 214, 0.15)',
    borderRadius: '12px',
    padding: '32px',
  },
  currentQuestionSection: {
    position: 'sticky',
    top: '40px',
    height: 'fit-content',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#b4a7d6',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'Georgia, serif',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#9b8fa3',
  },
  dividerText: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  answersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  answerCard: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(180, 167, 214, 0.1)',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '14px',
  },
  answerQuestion: {
    color: '#c0b5d8',
    marginBottom: '8px',
    fontWeight: 500,
  },
  answerText: {
    color: '#f5f3f0',
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  answerDate: {
    fontSize: '12px',
    color: '#7a8e6f',
  },
  questionBox: {
    background: 'linear-gradient(135deg, rgba(180, 167, 214, 0.15), rgba(155, 143, 163, 0.1))',
    border: '1px solid rgba(180, 167, 214, 0.3)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(180, 167, 214, 0.1)',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  questionDisplay: {
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: '24px',
    lineHeight: '1.6',
    color: '#f5f3f0',
    fontStyle: 'italic',
  },
  skipButton: {
    background: 'transparent',
    border: '1px solid rgba(180, 167, 214, 0.3)',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#9b8fa3',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s',
  },
  emptyQuestionBox: {
    background: 'rgba(122, 142, 111, 0.08)',
    border: '1px solid rgba(122, 142, 111, 0.2)',
    borderRadius: '12px',
    padding: '48px 32px',
    textAlign: 'center',
  },
  emptyState: {
    fontSize: '18px',
    color: '#c0b5d8',
    marginBottom: '8px',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#7a8e6f',
  },
};
