# The Wishing Jar 🌿💜

A whimsical, witchy question-and-answer app designed to help you get to know someone. Add questions to a shared jar, pull random ones from others, answer them, and build a beautiful collection of responses over time.

Built with React, Supabase, and Vercel. Designed with wisteria purple, hydrangeas, and Victorian oceanside vibes.

---

## How It Works

### The Flow
1. **Sign up** with email and username
2. **Create a jar** (or join someone else's)
3. **Add questions** you want to ask
4. **Pull random questions** from others
5. **Answer questions** and see past responses
6. **Ask it back** to send a question to the person who asked you

### The Data Model

```
Users (Profiles)
  ↓
  ├→ Jars (shared spaces)
  │   ├→ Questions (asked by users)
  │   │   └→ Answers (responses from all users)
  │   └→ Jar Members (who has access)
```

**Why this structure?**
- Jars are independent, so you can have different conversation spaces
- Jar Members control access (privacy)
- Questions track who asked them (so you don't answer your own)
- Answers track who responded and when

---

## Architecture Overview

### Frontend (React)
- **Single component** (`App.jsx`) managing all state
- **5 views:** Landing → Auth → Jar Select → Jar Main
- **Supabase client** initialized at the top (handles auth + database calls)
- **Inline styles** for simplicity (no CSS file needed)

**Why single component?** 
For a 2-person app, this is simpler than building a complex component tree. When you scale, you'd break it into smaller components.

### Backend (Supabase)
- **PostgreSQL database** (runs the actual data)
- **Auth system** (handles login/signup)
- **Policies (RLS)** (ensures users can only see jars they're in)
- **Functions** (the `get_random_question` function picks random questions excluding the user's own)

**Why Supabase?**
- Free tier is generous (500MB storage, auth included)
- Real-time capability if we add notifications later
- PostgreSQL = powerful queries
- Managed for you (no server setup)

### Hosting (Vercel)
- Watches your GitHub repo
- Auto-deploys when you push code
- Environment variables injected securely
- Free tier includes custom domains

**The deployment flow:**
```
Code pushed to GitHub 
  ↓
Vercel detects changes
  ↓
Vercel runs: npm install, npm build
  ↓
App deployed to vercel.app domain
  ↓
Live at https://your-domain.vercel.app
```

---

## Key Features Explained

### Random Question Selection
The `get_random_question` function does the heavy lifting:

```sql
SELECT questions FROM jar
WHERE user_id != current_user (don't show my own)
AND NOT ANSWERED BY current_user (skip ones I've already answered)
ORDER BY RANDOM()
LIMIT 1
```

This runs **on the database**, not in JavaScript—faster and more secure.

### "Ask it Back"
When you answer a question, there's a button to send it back to the original asker. This creates a turn-based conversation.

Data:
- Question record has `ask_back_from` field
- Points to the user who answered it
- When loaded, it treats it like a new question for that user

### User Answers View
Shows **every answer you've ever given** with:
- The original question
- Your response
- Date answered

This becomes a personal log of the conversation over time—the "intimate" part of the app.

---

## Design Decisions

### Why These Colors?
- **Wisteria purple (#b4a7d6):** Specific to her preferences, distinctive, not a default "purple"
- **Deep charcoal (#1a1a2e):** Dark mode reduces eye strain, feels intimate/mysterious
- **Hydrangeas:** Custom SVG patterns break up the interface (not random decoration—they mark sections)
- **Sage green (#7a8e6f):** Secondary accent, Victorian herbalism vibe

### Why This Layout?
- **Left: Questions + Past Answers** — Shows the conversation history
- **Right: Current Question (sticky)** — Always visible, encourages answering right now
- **Card-based design** — Each answer is a discrete thought, readable at a glance

### Why Serif Headers + Sans Body?
- **Georgia (serif)** for headers: Elegant, Victorian, intentional
- **Inter (sans)** for body: Clean, modern, readable at small sizes
- Hierarchy through **weight** (bold headers) + **size**, not decoration

---

## The Witchy Aesthetic

If you're wondering why certain design choices were made:

1. **Hydrangea flowers** appear as section markers → ties the visual to the content (not random deco)
2. **Glowing buttons on hover** → feels magical, interactive
3. **Subtle shadows & rounded corners** → softness (witchy = mysterious but warm, not harsh)
4. **Dark background with light text** → séance parlor vibes, intimate feeling
5. **"Wishing Jar" name + botanical accents** → reminds you this is about intimacy, not efficiency

---

## How to Customize

### Change Colors
Edit the `styles` object at the bottom of `App.jsx`:

```javascript
// Before
const purplePrimary = '#b4a7d6';

// After (try a different shade)
const purplePrimary = '#c2b5e8';
```

All CSS variables reference this, so one change updates everything.

### Add More Sections
E.g., "Currently Thinking" (show what your partner is working on):
1. Add a database query: `SELECT user_id, question_id, updated_at FROM active_answers`
2. Add a UI section showing "She's currently thinking about: What's your biggest fear?"
3. Wire up real-time updates via Supabase subscriptions

### Change Fonts
Replace `Georgia` and `Inter` in the style strings:

```javascript
// Change Georgia to something else
fontFamily: 'Playfair Display, serif'  // More elegant
fontFamily: 'Crimson Text, serif'       // Classic book style
```

---

## Troubleshooting

### "I see a blank page"
- Check browser console (F12 → Console tab)
- Look for error messages starting with "Error:"
- Common: Missing environment variables or Supabase not responding

### "Questions keep repeating"
- The app fetches a new question after each answer
- If you're seeing the same question twice, you might have two windows open
- Refresh the page

### "My friend can't see the jar"
- Manually add them to `jar_members` in Supabase
- Make sure `jar_id` and `user_id` are correct UUIDs (copy directly from the tables)

### "Styling looks broken on mobile"
- The app is built for desktop/tablet (2-column layout)
- To make it mobile-friendly, change `mainContent` grid:
  ```javascript
  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr'
  ```

---

## The Next Conversation

Once it's running, think about:

1. **Sharing jars** — Right now, you manually add jar members in Supabase. Add a "Copy invite link" feature.
2. **Answering together** — Show both of your answers to the same question side-by-side.
3. **Favorites** — Mark answers you loved and review them later.
4. **Insights** — "You've been asked 47 questions. Your favorite color question has 3 answers."

---

## Resources

- [Supabase docs](https://supabase.com/docs)
- [React docs](https://react.dev)
- [Vercel deployment docs](https://vercel.com/docs)

---

## Notes on the Code

This is intentionally **simple and readable**, not optimized. It's designed for you to:
1. **Understand every line** (no magic)
2. **Customize easily** (all in one file)
3. **Scale later** (if needed)

When the app grows:
- Break `App.jsx` into components (Landing, Auth, JarSelect, etc.)
- Move styles to a CSS file (or CSS-in-JS library)
- Add error boundaries and loading states
- Use React hooks better (currently using basic useState)

For now: it works, it's yours, and it's beautiful. 🌿💜

---

Made with care for getting to know someone special.
