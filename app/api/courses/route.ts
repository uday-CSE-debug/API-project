import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, apiResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const level = searchParams.get('level') || '';
    const instructorId = searchParams.get('instructorId') || '';
    const sortBy = searchParams.get('sortBy') || 'newest'; // newest, popularity, priceLow, priceHigh

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (level && level !== 'All') {
      where.level = level;
    }

    if (instructorId) {
      where.instructorId = instructorId;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popularity') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'priceLow') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'priceHigh') {
      orderBy = { price: 'desc' };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true, bio: true },
        },
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      ...course,
      studentCount: course._count.enrollments,
      lessonCount: course._count.lessons,
    }));

    return apiResponse(true, 'Courses retrieved successfully', formattedCourses, 200);
  } catch (error: any) {
    console.error('Fetch courses error:', error);
    return apiResponse(false, error.message || 'Error fetching courses', null, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN')) {
      return apiResponse(false, 'Forbidden: Only instructors and admins can create courses', null, 403);
    }

    const body = await req.json();
    const { title, description, category, level, duration, price = 0, thumbnail } = body;

    if (!title || !description || !category || !level || !duration) {
      return apiResponse(false, 'Required fields missing', null, 400);
    }

    const defaultThumbnail = thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level,
        duration,
        price: parseFloat(price.toString()) || 0,
        thumbnail: defaultThumbnail,
        instructorId: user.id,
        status: 'PUBLISHED',
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    return apiResponse(true, 'Course created successfully', course, 201);
  } catch (error: any) {
    console.error('Create course error:', error);
    return apiResponse(false, error.message || 'Error creating course', null, 500);
  }
}
