export interface FieldDefinition {
  name: string;
  label: string;
  type: "string" | "text" | "number" | "boolean" | "select" | "array" | "blocks" | "seo" | "date" | "nested";
  required?: boolean;
  readOnly?: boolean;
  hiddenInList?: boolean;
  hiddenInForm?: boolean;
  placeholder?: string;
  options?: { label: string; value: any }[]; // For select type
  subType?: "string" | "number" | "object"; // For array items
  nestedFields?: FieldDefinition[]; // For nested schemas
  defaultValue?: any;
}

export interface CollectionSchema {
  collectionName: string;
  displayName: string;
  pluralName: string;
  iconName: string; // Map to Lucide icon string
  primaryField: string; // The identifying field in the list, e.g., "title", "email"
  defaultSortField: string;
  defaultSortOrder: "asc" | "desc";
  fields: FieldDefinition[];
  childCollections?: string[]; // E.g., ["modules"] for courses
  parentField?: string; // E.g., "courseId" for modules
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
}

export const CMS_SCHEMAS: Record<string, CollectionSchema> = {
  blogPosts: {
    collectionName: "blogPosts",
    displayName: "Blog Post",
    pluralName: "Blog Posts",
    iconName: "FileText",
    primaryField: "title",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: "title", label: "Title", type: "string", required: true, placeholder: "Enter post title..." },
      { name: "slug", label: "Slug", type: "string", required: true, placeholder: "url-friendly-slug" },
      { name: "description", label: "Excerpt / Summary", type: "text", required: true, placeholder: "Short summary for grids..." },
      {
        name: "category",
        label: "Category / Pillar",
        type: "select",
        required: true,
        defaultValue: "Artificial Intelligence",
        options: [
          { label: "Artificial Intelligence", value: "Artificial Intelligence" },
          { label: "Robotics", value: "Robotics" },
          { label: "Crypto & Web3", value: "Crypto & Web3" },
          { label: "Startups & Venture", value: "Startups & Venture" },
          { label: "Entrepreneurship", value: "Entrepreneurship" },
          { label: "Software Engineering", value: "Software Engineering" },
          { label: "Productivity & Workflow", value: "Productivity & Workflow" },
          { label: "Future Tech", value: "Future Tech" },
          { label: "Cybersecurity", value: "Cybersecurity" },
          { label: "Data Science", value: "Data Science" },
        ],
      },
      { name: "tags", label: "Tags", type: "array", subType: "string", placeholder: "Press Enter or comma to add tags..." },
      { name: "blocks", label: "Narrative Content (Blocks)", type: "blocks", required: true, hiddenInList: true },
      { name: "seo", label: "SEO Config", type: "seo", required: true, hiddenInList: true },
      { name: "published", label: "Is Published", type: "boolean", defaultValue: false },
    ],
  },
  products: {
    collectionName: "products",
    displayName: "System Blueprint",
    pluralName: "System Blueprints",
    iconName: "Layers",
    primaryField: "title",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: "title", label: "Title", type: "string", required: true, placeholder: "Enter blueprint name..." },
      { name: "slug", label: "Slug", type: "string", required: true, placeholder: "slug-path-name" },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "thumbnail", label: "Thumbnail Image URL", type: "string", required: true, placeholder: "https://images.unsplash.com/..." },
      {
        name: "category",
        label: "Category",
        type: "select",
        required: true,
        defaultValue: "ai",
        options: [
          { label: "AI Workflows", value: "ai" },
          { label: "Website Systems", value: "web" },
          { label: "SEO Systems", value: "seo" },
          { label: "Automation Playbooks", value: "automation" },
        ],
      },
      {
        name: "type",
        label: "Licensing Type",
        type: "select",
        required: true,
        defaultValue: "free",
        options: [
          { label: "Free Direct Download", value: "free" },
          { label: "Paid Stripe Integration", value: "paid" },
        ],
      },
      { name: "stripePriceId", label: "Stripe Price ID", type: "string", placeholder: "price_1..." },
      { name: "basePrice", label: "Base Price ($)", type: "number", defaultValue: 0 },
      { name: "salePrice", label: "Sale Price ($)", type: "number", defaultValue: 0 },
      { name: "downloadFileURL", label: "Download Asset URL", type: "string", placeholder: "https://firebasestorage.googleapis.com/..." },
      { name: "features", label: "Blueprint Features (comma-separated string)", type: "string", placeholder: "Feature 1, Feature 2..." },
      { name: "isPublished", label: "Is Published", type: "boolean", defaultValue: false },
      { name: "isFeatured", label: "Featured in Catalog", type: "boolean", defaultValue: false },
    ],
  },
  courses: {
    collectionName: "courses",
    displayName: "Academy Course",
    pluralName: "Academy Courses",
    iconName: "BookOpen",
    primaryField: "title",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    childCollections: ["modules"],
    fields: [
      { name: "title", label: "Course Title", type: "string", required: true },
      { name: "slug", label: "Slug", type: "string", required: true },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "thumbnail", label: "Thumbnail URL", type: "string", required: true },
      { name: "instructor", label: "Instructor Name", type: "string", defaultValue: "Ayush Paul" },
      {
        name: "difficulty",
        label: "Difficulty Level",
        type: "select",
        required: true,
        defaultValue: "Beginner",
        options: [
          { label: "Beginner", value: "Beginner" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "Advanced", value: "Advanced" },
        ],
      },
      { name: "category", label: "Category Pillar", type: "string", defaultValue: "Development" },
      { name: "isPublished", label: "Is Published", type: "boolean", defaultValue: false },
    ],
  },
  modules: {
    collectionName: "modules",
    displayName: "Course Module",
    pluralName: "Course Modules",
    iconName: "FolderOpen",
    primaryField: "title",
    defaultSortField: "order",
    defaultSortOrder: "asc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    parentField: "courseId",
    fields: [
      { name: "courseId", label: "Course ID", type: "string", required: true, readOnly: true, hiddenInForm: true },
      { name: "title", label: "Module Title", type: "string", required: true },
      { name: "order", label: "Display Order", type: "number", defaultValue: 1 },
      { name: "isPublished", label: "Is Published", type: "boolean", defaultValue: true },
    ],
  },
  lessons: {
    collectionName: "lessons",
    displayName: "Module Lesson",
    pluralName: "Module Lessons",
    iconName: "PlayCircle",
    primaryField: "title",
    defaultSortField: "order",
    defaultSortOrder: "asc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    parentField: "moduleId",
    fields: [
      { name: "courseId", label: "Course ID", type: "string", required: true, readOnly: true, hiddenInForm: true },
      { name: "moduleId", label: "Module ID", type: "string", required: true, readOnly: true, hiddenInForm: true },
      { name: "title", label: "Lesson Title", type: "string", required: true },
      { name: "description", label: "Lesson Description", type: "text", required: true },
      { name: "videoUrl", label: "HTML5 Video URL", type: "string", required: true, placeholder: "e.g., https://vimeo.com/... or storage url" },
      { name: "isFree", label: "Free Preview", type: "boolean", defaultValue: false },
      { name: "order", label: "Display Order", type: "number", defaultValue: 1 },
      { name: "resourcesText", label: "Markdown Lesson Resources", type: "text", placeholder: "Support links, files..." },
      { name: "isPublished", label: "Is Published", type: "boolean", defaultValue: true },
    ],
  },
  users: {
    collectionName: "users",
    displayName: "User Profile",
    pluralName: "User Profiles",
    iconName: "Users",
    primaryField: "displayName",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: false,
    allowEdit: true,
    allowDelete: false,
    fields: [
      { name: "uid", label: "Firebase User UID", type: "string", readOnly: true },
      { name: "displayName", label: "Display Name", type: "string", required: true },
      { name: "email", label: "Email Address", type: "string", required: true, readOnly: true },
      { name: "photoURL", label: "Profile Photo URL", type: "string", placeholder: "https://..." },
      {
        name: "role",
        label: "System Access Role",
        type: "select",
        required: true,
        defaultValue: "customer",
        options: [
          { label: "Founder / Administrator", value: "founder" },
          { label: "Verified Customer", value: "customer" },
        ],
      },
      { name: "createdAt", label: "Identity Registered", type: "date", readOnly: true },
    ],
  },
  purchases: {
    collectionName: "purchases",
    displayName: "Order Transaction",
    pluralName: "Order Ledger",
    iconName: "BarChart3",
    primaryField: "stripeSessionId",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    fields: [
      { name: "stripeSessionId", label: "Stripe Checkout Session ID", type: "string", readOnly: true },
      { name: "userId", label: "Buyer User UID", type: "string", readOnly: true },
      { name: "productId", label: "Purchased Product ID", type: "string", readOnly: true },
      { name: "amountTotal", label: "Amount Total (Cents)", type: "number", readOnly: true },
      { name: "currency", label: "Currency Code", type: "string", readOnly: true },
      { name: "status", label: "Order Status", type: "string", readOnly: true },
      { name: "createdAt", label: "Purchase Timestamp", type: "date", readOnly: true },
    ],
  },
  subscribers: {
    collectionName: "subscribers",
    displayName: "Newsletter Member",
    pluralName: "Newsletter Subscribers",
    iconName: "Mail",
    primaryField: "email",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: false,
    allowDelete: true,
    fields: [
      { name: "email", label: "Subscriber Email Address", type: "string", required: true, placeholder: "user@domain.com" },
      { name: "createdAt", label: "Subscription Date", type: "date", readOnly: true },
    ],
  },
  projects: {
    collectionName: "projects",
    displayName: "Project",
    pluralName: "Projects",
    iconName: "Folder",
    primaryField: "title",
    defaultSortField: "createdAt",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: "title", label: "Project Title", type: "string", required: true, placeholder: "My Project Name..." },
      { name: "slug", label: "Slug", type: "string", required: true, placeholder: "slug-name" },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "thumbnail", label: "Thumbnail URL", type: "string", required: true, placeholder: "https://..." },
      { name: "category", label: "Category", type: "string", required: true, placeholder: "e.g., Robot, Web..." },
      { name: "status", label: "Status", type: "string", defaultValue: "Active" },
      { name: "link", label: "Live Demo Link", type: "string", placeholder: "https://..." },
      { name: "github", label: "GitHub Repo Link", type: "string", placeholder: "https://github.com/..." },
      { name: "technologies", label: "Technologies (comma-separated)", type: "string", placeholder: "React, Typescript..." },
      { name: "isPublished", label: "Is Published", type: "boolean", defaultValue: true },
    ],
  },
  updates: {
    collectionName: "updates",
    displayName: "Momentum Log",
    pluralName: "Momentum Logs",
    iconName: "Clock",
    primaryField: "title",
    defaultSortField: "date",
    defaultSortOrder: "desc",
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    fields: [
      { name: "title", label: "Log Title", type: "string", required: true, placeholder: "Today's Focus..." },
      { name: "text", label: "Update Content", type: "text", required: true },
      { name: "date", label: "Display Date (YYYY-MM-DD)", type: "string", required: true },
      { name: "relatedProject", label: "Related Project Name", type: "string", placeholder: "Optional project link" },
      { name: "statusTag", label: "Status Tag", type: "string", defaultValue: "Building", placeholder: "Building, Milestone..." },
    ],
  },
};
