export interface StudioCollaborationArea {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: "active" | "coming_soon";
  ctaLink: string;
}

export const COLLABORATION_AREAS: StudioCollaborationArea[] = [
  {
    id: "website-development",
    title: "Website Development",
    description:
      "Build high-performance, conversion-optimized Next.js web applications tailored to your product pipeline.",
    status: "active",
    ctaLink: "/collaborate",
  },
  {
    id: "ai-agent-integration",
    title: "AI Agent Integration",
    description:
      "Integrate autonomous LLM agent systems, custom prompts, and intelligent interfaces directly into your code.",
    status: "active",
    ctaLink: "/collaborate",
  },
  {
    id: "api-automation",
    title: "API Automation",
    description:
      "Connect software layers, configure webhook triggers, and automate Make.com scenarios that run without downtime.",
    status: "active",
    ctaLink: "/collaborate",
  },
  {
    id: "digital-systems",
    title: "Digital Systems",
    description:
      "Deploy secure database schemas, operational checklists, and custom business pipelines.",
    status: "active",
    ctaLink: "/collaborate",
  },
  {
    id: "content-platforms",
    title: "Content Platforms",
    description:
      "Launch modular markdown chronicle logs, SEO blogs, and searchable documentation repositories.",
    status: "active",
    ctaLink: "/collaborate",
  },
  {
    id: "technical-projects",
    title: "Technical Projects",
    description:
      "Establish technical roadmaps, audit codebase health, and refine workspace prompt rules.",
    status: "active",
    ctaLink: "/collaborate",
  },
];
