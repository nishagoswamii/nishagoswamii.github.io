export type Job = {
  title: string;
  company: string;
  dates: string;
  description: string[];
  linkedInUrl?: string;
};

export const jobs: Job[] = [
  {
    title: "GTM Automation Engineer",
    company: "VideoSDK",
    dates: "06/2026 - Present",
    description: [
      "Building intelligent automations across GTM workflows — from lead ops to outreach and beyond!"
    ],
    linkedInUrl: "https://www.linkedin.com/posts/nishagoswamii_im-happy-to-share-that-im-starting-a-new-activity-7465375073336463360-FDri?utm_source=share&utm_medium=member_android&rcm=ACoAAEKLpOQB8c-S0cS2ovislejsAnQjzoLB3pY"
  },
  {
    title: "ML Intern",
    company: "Reliance JIO Infocomm Limited",
    dates: "07/2025 - 10/2025",
    description: [
      "Applying my skills to real world problems & drinking some machine coffee!"
    ],
    linkedInUrl: "https://www.linkedin.com/posts/nishagoswamii_hi-friends-im-happy-to-announce-that-my-activity-7400962544753979392-TzuK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEKLpOQB8c-S0cS2ovislejsAnQjzoLB3pY"
  }
];