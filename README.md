# timetable_auto_generator
The exam-timetable-generator is a React (Next.js) frontend project that allows users to upload a .docx file, specify invigilators and venues, and generate an exam timetable via a backend API.

# 📅 Exam Timetable Generator

A web application that helps generate exam timetables by uploading a `.docx` file, selecting invigilators and venues, and submitting the data to a backend API for processing.

Built with **Next.js 13+**, **React**, **TypeScript**, **Tailwind CSS**, and powered by **pnpm** for package management.

---

## ✨ Features

- 🗂 Upload `.docx` files with exam details
- 👩‍🏫 Add a list of invigilators and venues
- 🧠 Submit data to backend API for timetable generation
- 🌗 Theme support (light/dark mode)
- 📱 Responsive design for mobile and desktop
- ⚙️ Environment variable support via `.env.local`

---

## 🧱 Project Structure

```
exam-timetable-generator/
│
├── app/                      # App directory (Next.js routing)
│   ├── api/generate-timetable/route.ts  # API endpoint (backend handler)
│   ├── layout.tsx            # App layout
│   └── page.tsx              # Home page
│
├── components/               # Reusable components
│   ├── timetable-generator.tsx
│   └── ui/file-upload.tsx
│
├── hooks/                    # Custom React hooks
│
├── lib/                      # Utility functions
│
├── public/                   # Static files
│
├── styles/                   # Global styles (TailwindCSS)
│
├── .env.local                # Environment variables (not committed)
├── package.json              # Project metadata and scripts
├── pnpm-lock.yaml            # Dependency lockfile for pnpm
└── tailwind.config.ts        # TailwindCSS configuration
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) installed globally:

```bash
npm install -g pnpm
```

---

### 📥 Installation

```bash
git clone https://github.com/DereckGeorge/timetable_auto_generator.git
cd timetable_auto_generator
pnpm install
```

---

### ⚙️ Environment Variables

Create a `.env.local` file at the root of your project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/process
```

Replace the URL with your actual backend endpoint.

---

### ▶️ Running the App

```bash
pnpm dev
```

Then open your browser at [http://localhost:3000](http://localhost:3000).

---

## 🔧 Available Scripts

| Script        | Description                  |
|---------------|------------------------------|
| `pnpm dev`    | Start the development server |
| `pnpm build`  | Build for production         |
| `pnpm start`  | Start a production server    |
| `pnpm lint`   | Lint your code (if set up)   |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'feat: add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request 🚀

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Dereck Tano**

---
