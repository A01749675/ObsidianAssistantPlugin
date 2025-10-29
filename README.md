# 🧠 Obsidian Assistant Plugin

The **Obsidian Assistant Plugin** is an AI-powered assistant built for [Obsidian](https://obsidian.md).  
It integrates **OpenAI’s API** to provide note suggestions, improvements, and contextual feedback directly inside your vault — all within a beautifully integrated React-based interface.

This plugin is written in **TypeScript**, using the **Obsidian plugin API** and **React** for a modern, responsive UI.

---

## ✨ Features


- 🧩 **React integration** inside Obsidian via a custom view (`VIEW_TYPE_REACT`).
- 💬 **OpenAI integration** — connect your API key to ask questions or improve notes.
- 📄 **Automatic AI callout insertion** into notes (using Obsidian callout syntax).
- ⌨️ **Command palette actions** for triggering AI features and opening the React view.
- 💾 **Global React context provider** for managing chat history, responses, and prompt states.
- 🧠 **Persistent chat experience** with user/assistant roles and dynamic UI.
- ⚙️ **Settings tab** to store your API key and personal name.

---

## 🧰 Core Functionality

- **Ribbon icon:** Opens the AI Assistant React panel.
- **Command palette actions:**
  - `Ask NoteAI` — Opens the assistant panel to chat with the AI.
  - `Send selected text to NoteAI` — Sends selected text from the note as a prompt.
- **AI Response Panel:**
  - Input field for typing prompts.
  - “Ask OpenAI” button for triggering a request.
  - Display area for formatted AI responses and message history.
- **Markdown Callout Output:**
  When writing to a note, the plugin automatically formats responses into [Obsidian callouts](https://help.obsidian.md/Editing+and+formatting/Callouts):

  ```markdown
  > [!note] [How can I improve my notes?] — Oct 27, 2025, 8:05 PM
  > Hello Iker! To improve your notes in Obsidian, here are some actionable tips you can consider:
  > 
  > 1. **Organize with Folders and Tags**: Create a consistent folder structure or use tags to quickly categorize your notes.
  > 2. **Use Links and Backlinks**: Connect related notes together to build a knowledge graph.
  > 3. **Summarize Key Concepts**: Add summaries at the end of notes for faster review.
