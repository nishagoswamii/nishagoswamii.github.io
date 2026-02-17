export type Job = {
  title: string;
  company: string;
  dates: string;
  description: string[];
  linkedInUrl?: string;
};

export const jobs: Job[] = [

  {
    title: "ML Intern",
    company: "Reliance JIO Infocomm Limited",
    dates: "07/2025 - 10/2025",
    description: [
      "Applying my skills to real world problems & drinking some machine coffee."
    ],
    linkedInUrl: "https://www.linkedin.com/posts/nishagoswamii_hi-friends-im-happy-to-announce-that-my-activity-7400962544753979392-TzuK?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEKLpOQB8c-S0cS2ovislejsAnQjzoLB3pY"
  }
];