import { IGraphRepository } from '../repositories/interface';
import { GraphQueryApi } from '../services/query';
import { GraphCache } from '../services/cache';

export interface LessonViewModel {
  nodeId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  durationMinutes: number;
  estimatedReadingTime: number;
  bodyMarkdown?: string;
  nextLessonSlug?: string;
  prerequisiteLessonSlug?: string;
  canonicalUrl: string;
  seoTitle: string;
}

export interface CourseDetailViewModel {
  nodeId: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationHours: number;
  instructor: string;
  category: string;
  tags: string[];
  thumbnailUrl: string;
  lessons: LessonViewModel[];
  totalLessonsCount: number;
  canonicalUrl: string;
  seoTitle: string;
}

export interface MasteryViewModel {
  title: string;
  description: string;
  courses: CourseDetailViewModel[];
  totalCoursesCount: number;
}

export class MasteryProjection {
  private repository: IGraphRepository;
  private queryApi: GraphQueryApi;
  private cache: GraphCache;

  constructor(repository: IGraphRepository) {
    this.repository = repository;
    this.queryApi = new GraphQueryApi(repository);
    this.cache = GraphCache.getInstance();
  }

  async getMasteryViewModel(locale: 'en' = 'en'): Promise<MasteryViewModel> {
    const cacheKey = `mastery_viewmodel_${locale}`;
    const cached = this.cache.getProjection<MasteryViewModel>(cacheKey);
    if (cached) return cached;

    const allNodes = await this.repository.getAllNodes();
    const courseNodes = allNodes.filter(n => n.nodeType === 'COURSE');

    const courses: CourseDetailViewModel[] = await Promise.all(
      courseNodes.map(courseNode => this.getCourseDetailViewModel(courseNode.slug[locale] || courseNode.slug.en, locale))
    );

    const result: MasteryViewModel = {
      title: 'Engineering & Business Mastery Systems',
      description: 'Comprehensive video and text courses on fullstack AI agent development, client acquisition, and software architecture.',
      courses: courses.filter((c): c is CourseDetailViewModel => Boolean(c)),
      totalCoursesCount: courses.length
    };

    this.cache.setProjection(cacheKey, result);
    return result;
  }

  async getCourseDetailViewModel(courseSlug: string, locale: 'en' = 'en'): Promise<CourseDetailViewModel | null> {
    const cacheKey = `course_detail_viewmodel_${courseSlug}_${locale}`;
    const cached = this.cache.getProjection<CourseDetailViewModel>(cacheKey);
    if (cached) return cached;

    const courseNode = await this.repository.getNodeBySlug(courseSlug, locale);
    if (!courseNode || courseNode.nodeType !== 'COURSE') return null;

    const childNodes = await this.queryApi.getChildren(courseNode.nodeId);
    const validLessons = childNodes
      .filter(n => n.nodeType === 'LESSON')
      .sort((a, b) => Number(a.properties.order || 0) - Number(b.properties.order || 0));

    const lessons: LessonViewModel[] = await Promise.all(
      validLessons.map(async lessonNode => {
        const nextLessons = await this.queryApi.getRelated(lessonNode.nodeId, 'NEXT_LESSON');
        const nextNode = nextLessons[0] || null;

        const prereqs = await this.queryApi.getRelated(lessonNode.nodeId, 'REQUIRES');
        const prereqNode = prereqs[0] || null;

        const contentNodes = await this.queryApi.getRelated(lessonNode.nodeId, 'HAS_CONTENT');
        const contentNode = contentNodes[0] || null;

        const lessonSlug = lessonNode.slug[locale] || lessonNode.slug.en;
        return {
          nodeId: lessonNode.nodeId,
          title: lessonNode.title[locale] || lessonNode.title.en,
          slug: lessonSlug,
          description: lessonNode.description?.[locale] || lessonNode.description?.en || '',
          order: Number(lessonNode.properties.order || 1),
          durationMinutes: Number(lessonNode.properties.durationMinutes || 30),
          estimatedReadingTime: Number(lessonNode.properties.estimatedReadingTime || 10),
          bodyMarkdown: (contentNode?.properties.bodyMarkdown as string) || undefined,
          nextLessonSlug: nextNode?.slug[locale] || nextNode?.slug.en,
          prerequisiteLessonSlug: prereqNode?.slug[locale] || prereqNode?.slug.en,
          canonicalUrl: `https://ayushpaul.in/mastery/lessons/${lessonSlug}`,
          seoTitle: `${lessonNode.title[locale] || lessonNode.title.en} | Mastery | Ayush Paul`
        };
      })
    );

    const cSlug = courseNode.slug[locale] || courseNode.slug.en;
    const result: CourseDetailViewModel = {
      nodeId: courseNode.nodeId,
      title: courseNode.title[locale] || courseNode.title.en,
      slug: cSlug,
      description: courseNode.description?.[locale] || courseNode.description?.en || '',
      difficulty: (courseNode.properties.difficulty as string) || 'Intermediate',
      durationHours: Number(courseNode.properties.durationHours || 10),
      instructor: (courseNode.properties.instructor as string) || 'Ayush Paul',
      category: (courseNode.properties.category as string) || 'Engineering',
      tags: (courseNode.properties.tags as string[]) || [],
      thumbnailUrl: (courseNode.properties.thumbnailUrl as string) || '/images/course-placeholder.jpg',
      lessons,
      totalLessonsCount: lessons.length,
      canonicalUrl: `https://ayushpaul.in/mastery/courses/${cSlug}`,
      seoTitle: `${courseNode.title[locale] || courseNode.title.en} | Mastery Course | Ayush Paul`
    };

    this.cache.setProjection(cacheKey, result);
    return result;
  }
}
