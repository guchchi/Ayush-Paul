export interface HomeMasteryCard {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  lessonsCount: number;
  status: "active" | "coming_soon";
  ctaLink: string;
}

export function mapCourseToHomeCard(course: any): HomeMasteryCard {
  return {
    id: course.id,
    title: course.title,
    category: course.category || "Web",
    description: course.description,
    duration: course.duration || "4–6 hrs",
    lessonsCount: course.lessonsCount || 10,
    status: course.isPublished ? "active" : "coming_soon",
    ctaLink: `/mastery/courses/${course.id}`,
  };
}
