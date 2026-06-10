import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '../../types';
import { getPublishedProducts } from '../../lib/product-utils';
import { getDynamicBlogs, type BlogPost } from '../../lib/blog-utils';
import { formatCurrency } from '../../lib/format';

interface Props {
  currentProduct: Product;
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  ctaLink: string;
}

export const BlueprintRelatedContent = ({ currentProduct }: Props) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const allProducts = await getPublishedProducts();
        const filtered = allProducts
          .filter(p => p.id !== currentProduct.id && p.isPublished && p.status !== 'COMING_SOON')
          .slice(0, 3);
        setRelatedProducts(filtered);

        const allBlogs = await getDynamicBlogs();
        setBlogs(allBlogs.slice(0, 2));

        try {
          const { collection, getDocs, query, where } = await import('firebase/firestore');
          const { db } = await import('../../firebase');
          const q = query(collection(db, 'courses'), where('isPublished', '==', true));
          const snap = await getDocs(q);
          const courseList = snap.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.title || '',
              description: d.description || '',
              category: d.category || 'General',
              duration: d.duration || '4–6 hrs',
              ctaLink: `/mastery/courses/${doc.id}`,
            };
          }).slice(0, 2);
          setCourses(courseList);
        } catch {
          setCourses([]);
        }
      } catch {
        setRelatedProducts([]);
        setBlogs([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [currentProduct.id]);

  if (loading) return null;
  if (relatedProducts.length === 0 && courses.length === 0 && blogs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#c2c6d6]/15 overflow-hidden bg-white">
      <div className="px-5 py-4 border-b border-[#c2c6d6]/10">
        <h3 className="text-[13px] font-semibold text-[#0b1c30]">You May Also Like</h3>
      </div>

      <div className="divide-y divide-[#c2c6d6]/10">
        {/* Blueprints */}
        {relatedProducts.map((prod) => (
          <Link
            key={prod.id}
            to={`/blueprints/${prod.slug}`}
            className="group flex gap-3 px-5 py-3.5 hover:bg-[#f8f9ff] transition-colors"
          >
            <img
              src={prod.thumbnail}
              alt={prod.title}
              className="w-14 h-11 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0b1c30] truncate group-hover:text-[#0058be] transition-colors">
                {prod.title}
              </p>
              <p className="text-[11px] text-[#424754]/40 mt-0.5">
                {formatCurrency(prod.salePrice || prod.basePrice)}
              </p>
            </div>
            <ArrowUpRight size={12} className="text-[#424754]/20 group-hover:text-[#0058be] shrink-0 mt-1 transition-colors" />
          </Link>
        ))}

        {/* Courses */}
        {courses.map((course) => (
          <Link
            key={course.id}
            to={course.ctaLink}
            className="group flex gap-3 px-5 py-3.5 hover:bg-[#f8f9ff] transition-colors"
          >
            <div className="w-14 h-11 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-center shrink-0">
              <span className="text-[8px] font-semibold text-[#0058be] uppercase tracking-wide">{course.category}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0b1c30] truncate group-hover:text-[#0058be] transition-colors">
                {course.title}
              </p>
              <p className="text-[11px] text-[#424754]/40 mt-0.5">{course.duration}</p>
            </div>
            <ArrowUpRight size={12} className="text-[#424754]/20 group-hover:text-[#0058be] shrink-0 mt-1 transition-colors" />
          </Link>
        ))}

        {/* Blogs */}
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.slug}`}
            className="group flex gap-3 px-5 py-3.5 hover:bg-[#f8f9ff] transition-colors"
          >
            {blog.coverImage ? (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-14 h-11 rounded-lg object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-11 rounded-lg bg-[#f0f1f3] flex items-center justify-center shrink-0">
                <span className="text-[8px] font-semibold text-[#424754]/30 uppercase tracking-wide">Blog</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#0b1c30] truncate group-hover:text-[#0058be] transition-colors">
                {blog.title}
              </p>
              <p className="text-[11px] text-[#424754]/40 mt-0.5">{blog.category}</p>
            </div>
            <ArrowUpRight size={12} className="text-[#424754]/20 group-hover:text-[#0058be] shrink-0 mt-1 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};
