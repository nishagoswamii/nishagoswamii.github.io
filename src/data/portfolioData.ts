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
  },
  {
    id: 2,
    title: "Celebrity Image Recognition",
    summary: "A machine learning system that classifies celebrities based on scraped images using an ensemble of models.",
    images: [
      "/Images/imageDetection.png"
    ],
    tags: ["Python", "Web Scraping", "Ensemble Learning", "Flask", "Image Classification"],
    details: {
      challenge: "There was no lightweight and accurate way to recognize celebrity images via a web interface, especially using scraped data without huge datasets.",
      solution: "Built a pipeline to scrape celebrity images via Google Images, processed them using OpenCV and NumPy, trained an ensemble of models—including XGBoost, Random Forest, LightGBM, and Logistic Regression—and deployed the classifier through a Flask-based web UI.",
      impact: [
        "Achieved reliable recognition across five popular personalities with limited dataset size (~900 images).",
        "Delivered a responsive Flask app for real-time image classification via drag-and-drop interface.",
        "Demonstrated how to combine web scraping, feature engineering, and ensemble learning into a cohesive, user-facing project."
      ]
    },
    githubUrl: "https://github.com/nishagoswamii/celebrity-classification"
  }
];
