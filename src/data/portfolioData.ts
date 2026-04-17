export interface Project {
  id: number;
  title: string;
  summary: string;
  images: string[];
  tags: string[];
  details: {
    challenge: string;
    solution: string;
    impact: string[];
  };
  externalLink?: {
    title: string;
    url: string;
  };
  githubUrl?: string;
}
export const projects: Project[] = [
  {
    id: 1,
    title: "HireFlowly",
    summary: "HireFlowly is an intelligent, AI-powered resume analyzer designed to streamline the evaluation and optimization of professional CVs. By leveraging advanced natural language processing, the platform automatically parses uploaded resumes to extract key skills, experiences, and formatting details. It serves as a highly valuable tool for job seekers who want to improve their Applicant Tracking System (ATS) compatibility through targeted, data-driven feedback.",
    images: [
      "/Images/hireflowly_landing_page.png",
      "/Images/hireflowly_action.png"
    ],
    tags: [ "TypeScript", "Supabase", "Vitest", "AI Semantic Matching"],
    details: {
      challenge: "Managing AI Latency & Edge Function Limits: Utilized Supabase Edge Functions to securely connect to the AI gateway while handling strict timeout limits. Ensuring Structured AI Outputs: Forcing the LLM to return consistent, strictly structured JSON data every single time, rather than unstructured text to prevent frontend crashes. Securely Handling CORS and API Keys: Configuring ALLOWED_ORIGINS for Edge Functions so the Vercel frontend can communicate securely without exposing sensitive API keys. Document Parsing on the Web: Extracting clean text from uploaded resumes (PDFs and Word documents) while handling complex layouts, multi-column formats, and invisible tables.",
      solution: "Built a secure, full-stack AI pipeline using Supabase Edge Functions with strict CORS configuration to protect API keys and manage latency. Implemented precise prompt engineering to force the LLM to return strictly structured JSON outputs. Developed a comprehensive document parsing pipeline to handle complex PDF and DOCX files. Deployed on Vercel with systematic evaluation features to grade resume bullet points for authenticity and impact.",
      impact: [
        "Secure API & CORS: Decoupled frontend using Supabase Edge Functions to protect API keys and implemented strict CORS rules.",
        "Latency Mitigation: Maintained UI responsiveness by running time-intensive AI processing on serverless edge architecture rather than the browser.",
        "Document Parsing Pipeline: Cleaned and processed raw text from complex PDF and DOCX files (handling columns and fonts) before sending it to the AI for analysis.",
        "Impact Scoring Engine: Developed an evaluation formula (X-Y-Z method) to systematically grade resume bullet points for authenticity and impact.",
        "Contextual ATS Matching: Built features to compare parsed resume data directly against specific target job descriptions to improve ATS compatibility."
      ]
    },
    externalLink: {
      title: "Try HireFlowly",
      url: "https://hire-flowly.vercel.app"
    },
    githubUrl: "https://github.com/nishagoswamii/HireFlowly"
  },
  {
    id: 2,
    title: "Drowsiness Detection System",
    summary: "A real-time computer vision system to detect driver drowsiness using YOLO and PyTorch.",
    images: [
      "/Images/DDS.png",
    ],
    tags: ["YOLO", "PyTorch", "Computer Vision", "Real-Time Detection", "AI"],
    details: {
      challenge: "Drowsy driving is a major cause of road accidents, and there was a need for an accurate, real-time detection system that could alert drivers before fatigue leads to dangerous situations.",
      solution: "Developed a YOLO-based computer vision model in PyTorch to detect signs of driver drowsiness by monitoring facial landmarks such as eye closure and yawning frequency. The system processes live video feed from a camera and triggers an audible alert when drowsiness is detected.",
      impact: [
        "Achieved over 90% detection accuracy in controlled test scenarios.",
        "Reduced reaction time to driver fatigue by providing immediate visual and audio alerts.",
        "Designed a modular architecture that can be integrated into vehicle infotainment or safety systems."
      ]
    },
    githubUrl: "https://github.com/nishagoswamii/drowsiness-detection"
  }
];
