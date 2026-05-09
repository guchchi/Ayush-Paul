export interface DomainWorld {
  id: string;
  title: string;
  tagline: string;
  themeColor: string;
  image: string;
  videoUrl?: string;
  description: string;
  stats: { label: string; value: string }[];
}

export const DOMAIN_WORLDS: DomainWorld[] = [
  {
    id: "ai-systems",
    title: "AI Systems",
    tagline: "Architecting Intelligence",
    themeColor: "#00C2FF", // Cyan
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
    description: "Developing robust language model architectures, custom agents, and automation pipelines designed to scale.",
    stats: [
      { label: "Models Deployed", value: "15+" },
      { label: "Queries/Day", value: "500k+" },
      { label: "Efficiency Gain", value: "300%" }
    ]
  },
  {
    id: "robotics",
    title: "Robotics World",
    tagline: "Machines That Think",
    themeColor: "#FF3366", // Red-Pink
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2000&auto=format&fit=crop",
    description: "Engineering autonomous hardware systems powered by ROS, computer vision, and embedded intelligence.",
    stats: [
      { label: "Systems Built", value: "8+" },
      { label: "Sensor Fusion", value: "Active" },
      { label: "Autonomy Level", value: "L4" }
    ]
  },
  {
    id: "electronics",
    title: "Electronics Lab",
    tagline: "Silicon & Signals",
    themeColor: "#00FF66", // Green
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
    description: "Designing custom PCBs, IoT ecosystems, and low-latency hardware interfaces for critical applications.",
    stats: [
      { label: "Custom PCBs", value: "12+" },
      { label: "IoT Devices", value: "50+" },
      { label: "Uptime", value: "99.9%" }
    ]
  },
  {
    id: "founder",
    title: "Founder & Biz",
    tagline: "Building Ecosystems",
    themeColor: "#FFB800", // Yellow/Gold
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?q=80&w=2000&auto=format&fit=crop",
    description: "Transforming deep technology into scalable products and viable ventures.",
    stats: [
      { label: "Ventures", value: "3" },
      { label: "Users Reached", value: "10k+" },
      { label: "Growth", value: "Exponential" }
    ]
  },
  {
    id: "creative",
    title: "Creative Studio",
    tagline: "Cinematic Experiences",
    themeColor: "#7B61FF", // Purple
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    description: "Designing high-fidelity user interfaces, immersive 3D graphics, and motion-driven web applications.",
    stats: [
      { label: "Web Apps", value: "20+" },
      { label: "Design Systems", value: "5" },
      { label: "Awards", value: "2" }
    ]
  },
  {
    id: "innovation",
    title: "Innovation Lab",
    tagline: "Bleeding Edge Research",
    themeColor: "#FF003C", // Red
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop",
    description: "National-level projects combining chemistry, physics, and computer science to solve real-world problems.",
    stats: [
      { label: "National Level", value: "Winner" },
      { label: "Patents", value: "Pending" },
      { label: "Impact", value: "High" }
    ]
  }
];
