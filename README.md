# TalentAI Dashboard

## Overview  
TalentAI Dashboard is the **frontend web platform** for the TalentAI recruitment system. Built with **React, Vite, and TypeScript**, styled using **TailwindCSS** and **shadcn/ui**, it provides a clean, modern interface for both **applicants** and **recruiters** to interact with our AI-powered matching API.

The dashboard connects directly to the [TalentAI Flask API](https://github.com/Edward-Twe/TalentAPI) to deliver real-time job matching, application tracking, and candidate shortlisting.

---

## Features  

### Applicant Dashboard  
- Upload resumes for real-time ingestion into the matching engine  
- Receive AI-ranked, personalised job recommendations  
- Track application history and statuses  

### Recruiter Dashboard  
- Post job openings  
- View AI-ranked candidate shortlists with skill insights  
- Filter applicants based on skills and metadata  

### Shared Platform Features  
- Fully responsive design  
- Modern UI components with **shadcn/ui**  
- Connected to Flask API endpoints: `/match`, `/resume`, `/index`, `/stats`  

---

## Tech Stack  
- **React** + **Vite** + **TypeScript** – Frontend framework & tooling  
- **TailwindCSS** + **shadcn/ui** – UI styling and component library  
- **Flask API** – Backend AI matching engine ([GitHub Repository](https://github.com/Edward-Twe/TalentAPI))  
- **Axios / Fetch API** – HTTP requests to backend  
- **Bun / npm** – Package management  

---

## Setup Instructions  

### Prerequisites  
- Node.js (v18+) or Bun  
- Flask API running locally or remotely ([setup guide here](https://github.com/Edward-Twe/TalentAPI))  

### Installation  
```bash
# Clone the repository
git clone https://github.com/martinaophred/talent-ai.git
cd talent-ai

# Install dependencies (choose one)
npm install
# or
bun install
