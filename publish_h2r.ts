import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local" });

const serviceAccountPath = "./service-account.json";
if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

import { getFirestore } from "firebase-admin/firestore";

const dbId = process.env.VITE_FIREBASE_FIRESTORE_DB_ID || "(default)";
const db = getFirestore(admin.app(), dbId);

async function publishContent() {
  const projectData = {
    title: "H2R — Home Automation & Rescue Robot",
    slug: "h2r-home-automation-rescue-robot",
    category: "Robotics / IoT",
    status: "Completed",
    featured: true,
    vision: "Building an Intelligent Robot for Healthcare, Safety, and Emergency Response",
    impact: "Multifunctional platform supporting hospital operations and detecting hazardous gases.",
    image: "/assets/blog-h2r/h2r-robot-overview.jpg",
    tech: ["Arduino", "Sensors", "IoT", "Bluetooth", "Wi-Fi"],
    metrics: { "Award": "Silver Medal", "Level": "National", "Competition": "WRO" },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    description: "H2R was not designed as just another competition robot. The goal was to build a system capable of solving real-world problems where human response time matters the most — hospitals, homes, and hazardous environments.",
    strategy: "Instead of building separate machines, I focused on creating one multifunctional robotic platform capable of adapting to different environments (Home, Hospital, Rescue).",
    process: "The robot operates using microcontroller-based processing to interpret sensor data and execute decision logic. Gas sensors provide environmental monitoring, while wireless communication modules allow real-time interaction.",
    link: "/blog/h2r-home-automation-rescue-robot"
  };

  const blogData = {
    title: "Building H2R: The Multifunctional Home Automation & Rescue Robot",
    slug: "h2r-home-automation-rescue-robot",
    category: "Robotics",
    tags: ["Robotics Innovation", "Home Automation Robot", "Rescue Robot Project", "Ayush Robotics Project"],
    description: "Discover the development journey of H2R, a multifunctional home automation and rescue robot designed by Ayush for healthcare and emergency response.",
    coverImage: "/assets/blog-h2r/h2r-robot-overview.png",
    published: true,
    featured: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    seoTitle: "H2R Robot: Home Automation & Rescue Robotics Innovation",
    blocks: [
      {
        id: "intro",
        type: "text",
        content: `<h2>Introduction</h2><p>My journey into robotics truly began with a project called H2R — Home Automation & Rescue Robot.</p><p>H2R was not designed as just another competition robot. The goal was to build a system capable of solving real-world problems where human response time matters the most — hospitals, homes, and hazardous environments.</p><p>This project became my first national-level robotics innovation and laid the foundation of my engineering thinking: technology should actively protect and assist human life.</p>`
      },
      {
        id: "idea",
        type: "text",
        content: `<h2>The Idea Behind H2R</h2><p>Modern environments face two major challenges: Emergency situations often go unnoticed until it becomes too late, and healthcare systems struggle with repetitive operational workload.</p><p>Gas leaks, delayed medical assistance, and inefficient patient handling are problems that demand intelligent automation. I wanted to design a robotic system that could act as a smart home automation assistant, a hospital support robot, and a rescue and safety monitoring unit.</p><p>Instead of building separate machines, I focused on creating one multifunctional robotic platform capable of adapting to different environments. That vision became H2R.</p>`
      },
      {
        id: "img1",
        type: "image",
        content: `<img src="/assets/blog-h2r/h2r-robot-development.jpg" alt="Ayush Robotics Project: Development of H2R home automation robot" loading="lazy" />`
      },
      {
        id: "home-auto",
        type: "text",
        content: `<h2>Home Automation System</h2><p>The home automation module was designed to demonstrate how smart environments can respond instantly through automation.</p><p>The robot can control appliances wirelessly using both Wi-Fi and Bluetooth communication modes. This dual connectivity ensures functionality even when internet access is unavailable. Through mobile control, users can manage devices remotely, creating a safer and smarter living environment. The automation logic allows systems to respond efficiently during emergency situations without requiring direct human intervention.</p>`
      },
      {
        id: "hospital",
        type: "text",
        content: `<h2>Hospital Assistance System</h2><p>One of the strongest motivations behind H2R was improving hospital workflow efficiency. Hospitals often require staff to perform repetitive but critical tasks such as medicine delivery and patient coordination. To address this, I developed a hospital assistance module capable of supporting medical operations.</p><p>The robot includes a medicine dispensing mechanism designed to deliver medication according to medical instructions. An integrated alert system helps ensure timely administration, reducing the chances of missed doses. Additionally, the system can assist in monitoring hospital bed availability, helping medical teams make faster decisions during urgent patient transfers.</p><p>The objective was not to replace healthcare workers but to support them, allowing professionals to focus more on patient care.</p>`
      },
      {
        id: "rescue",
        type: "text",
        content: `<h2>Rescue and Safety System</h2><p>Safety engineering became the most technically intensive part of H2R. The robot integrates multiple environmental sensors capable of detecting harmful gases and unsafe atmospheric conditions. These sensors continuously monitor surroundings and evaluate risk levels.</p><p>If dangerous gases are detected, the system immediately generates alerts and indicates the threat, enabling faster emergency response. This transforms the robot into an early-warning safety system suitable for industrial areas, disaster zones, or confined environments where human entry may be risky.</p>`
      },
      {
        id: "tech",
        type: "text",
        content: `<h2>Engineering and Technologies Used</h2><p>Developing H2R required combining electronics, embedded programming, and mechanical design into one unified system.</p><p>The robot operates using microcontroller-based processing to interpret sensor data and execute decision logic. Gas sensors provide environmental monitoring, while DC motors and motor drivers enable controlled mobility across different terrains. Wireless communication modules allow real-time interaction and remote operation. A custom-built chassis houses all electronic layers, ensuring stability and modular expansion.</p><p>The development process involved continuous prototyping, circuit testing, debugging, and integration of hardware with intelligent control algorithms.</p>`
      },
      {
        id: "img2",
        type: "image",
        content: `<img src="/assets/blog-h2r/h2r-poster-presentation.jpg" alt="Ayush presenting H2R Rescue Robot Project at National Level" loading="lazy" />`
      },
      {
        id: "journey",
        type: "text",
        content: `<h2>Development Journey</h2><p>Building H2R was a deeply practical learning experience. I began by studying real-world healthcare and safety problems before moving into system design. The project required designing circuits, assembling mechanical structures, programming automation logic, and repeatedly testing system reliability.</p><p>One of the biggest challenges was integrating multiple operational modes into a single robot without compromising performance. Through experimentation and iterative improvements, I successfully transformed a concept into a working multifunctional robotic system.</p>`
      },
      {
        id: "competition",
        type: "text",
        content: `<h2>Competition Experience and Achievement</h2><p>H2R was presented at the World Robot Olympiad, one of the world's leading robotics innovation platforms. Representing Team PERFECTTO from Rajkiya Pratibha Vikas Vidyalaya Yamuna Vihar, we competed in the Future Innovators category, which focuses on solving real-world problems using robotics.</p><p>Competing at the national level among highly innovative teams was an unforgettable experience, and our project was awarded the Silver Medal at National Level. This achievement marked a major milestone in my robotics journey.</p>`
      },
      {
        id: "conclusion",
        type: "text",
        content: `<h2>Vision for the Future & Conclusion</h2><p>The idea behind H2R extends beyond a single prototype. I envision autonomous robotic assistants becoming essential infrastructure in smart cities, hospitals, and industrial safety systems. Robots capable of monitoring environments, assisting professionals, and responding instantly to danger can significantly improve public safety and healthcare efficiency.</p><p>Building H2R changed how I see technology. Robotics is not only about machines or coding — it is about responsibility. When engineered thoughtfully, autonomous systems can protect lives, assist communities, and enhance human capability.</p><p>This project strengthened my commitment to continue building intelligent systems that serve society and solve real-world challenges.</p><hr /><p><strong>Author: Ayush | Robotics Innovator | Electronics Engineer | Student Researcher</strong></p>`
      }
    ]
  };

  try {
    await db.collection("projects").doc(projectData.slug).set(projectData);
    console.log("Project published successfully!");
    
    await db.collection("blogPosts").doc(blogData.slug).set(blogData);
    console.log("Blog post published successfully!");
  } catch (error) {
    console.error("Error publishing:", error);
  }
}

publishContent();
