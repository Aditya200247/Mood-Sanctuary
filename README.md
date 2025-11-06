🌿 Mood Sanctuary (Prototype)

Mood Sanctuary is a calming, interactive web app designed to help users reflect, focus, and improve emotional well-being.
It combines mood tracking, journaling, focus timer, AI assistant, and a virtual growth garden — all in one soothing interface.

This is a prototype built using React, Framer Motion, and Tailwind CSS, with optional backend support for real-time script execution.

🚀 Features
🧘 Mood Detection & Visualization

Automatically detects mood from your journal entries.

Tap the Mood Ring to manually select your emotional state.

The theme background adapts to your mood in real time.

📓 Journaling

Write and save short daily reflections.

Entries are stored in a local state (extendable to a backend).

Each entry keeps a snapshot of your mood at the time of writing.

⏳ Focus Mode (Pomodoro Timer)

Start 25- or 50-minute focus sessions.

When a session ends, your garden grows 🌱

Tracks focus streaks and engagement points.

🌼 Growth Garden

Watch your digital garden flourish as you stay consistent.

Encourages mindfulness and productivity.

💬 AI Assistant (Prototype)

A space to chat with an empathetic AI listener.

Currently mocked with placeholder messages — easily connectable to OpenAI API or custom backend.

🧩 Script Runner (Backend Prototype)

Runs a test script through http://localhost:4000/run-script and streams live console output.

Demonstrates backend–frontend integration with server-sent streaming.

🛠️ Tech Stack
Layer	Technology
Frontend	React 18, Tailwind CSS, Framer Motion
Animation	Lottie Player
Backend (optional)	Node.js / Express (for /run-script endpoint)
State Management	React Hooks
Prototype AI	Placeholder (can integrate OpenAI or local LLM)
📂 Project Structure
src/
 ├── App.jsx                # Main entry point
 ├── components/
 │    ├── ScriptRunner.jsx  # Backend streaming test
 │    ├── MoodSanctuaryUI.jsx
 │    ├── MoodRing.jsx
 │    ├── Garden.jsx
 │    └── Card.jsx
 ├── assets/
 │    └── sampleLottie.json # (optional animation file)
 ├── index.css
 └── index.js

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/<your-username>/mood-sanctuary.git
cd mood-sanctuary


Install dependencies

npm install


Run the frontend

npm run dev


(For CRA-based setup, use npm start.)

Optional: Start backend (for ScriptRunner)

cd server
node server.js


Ensure it listens at http://localhost:4000/run-script.

🧠 How It Works

Mood Analysis: Simple keyword-based detection (e.g., “happy”, “calm”, “anxious”).

Dynamic Theming: Background gradients and text colors adapt to the detected mood.

Garden Growth: Incremental score system (gardenScore) rewards journaling and focus completion.

Focus Mode: Uses a countdown timer with React hooks and side effects.

Smooth Animations: Framer Motion adds soft UI transitions for mood shifts and plant growth.

💡 Future Roadmap

 Persistent data storage (LocalStorage / Firebase / MongoDB)

 Real AI chat integration (OpenAI API or custom model)

 Sound therapy & breathing animations

 Gamified self-care streaks

 User authentication system

 Mobile-responsive PWA version

🤝 Contributing

Contributions are welcome!
See CONTRIBUTING.md
 for details.

Fork the project

Create your feature branch

git checkout -b feature/YourFeature


Commit your changes

git commit -m "Add YourFeature"


Push to your branch

git push origin feature/YourFeature


Open a Pull Request

🧾 License

This project is released under the MIT License — you’re free to use, modify, and distribute it.

✨ Author

Aditya Kumar Thakur
💻 BTech AI & ML Student | Passionate about Human-Centered AI

📬 GitHub
 • LinkedIn
