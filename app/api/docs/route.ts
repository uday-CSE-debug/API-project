import { NextResponse } from 'next/server';

export async function GET() {
  const swaggerSpec = {
    openapi: '3.0.0',
    info: {
      title: 'LearnHub Online Learning Platform API Documentation',
      version: '1.0.0',
      description: 'Production REST API for Course Enrollment, Lessons, Quizzes, Assignments, Progress, and Administration.',
      contact: {
        name: 'LearnHub Support',
        email: 'admin@learnhub.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Authentication', description: 'Register, Login, Logout, Current User Profile' },
      { name: 'Courses', description: 'Course management, details, search & filtering' },
      { name: 'Enrollments', description: 'Course enrollment and student course list' },
      { name: 'Lessons', description: 'Course lesson creation, listing, and progress tracking' },
      { name: 'Quizzes', description: 'Quiz creation, attempt submission, and results' },
      { name: 'Assignments', description: 'Assignment management and student submissions' },
      { name: 'Progress', description: 'Student course completion percentage and scores' },
      { name: 'Users', description: 'Admin user management and activation status' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Alex Johnson' },
                    email: { type: 'string', example: 'alex@example.com' },
                    password: { type: 'string', example: 'password123' },
                    role: { type: 'string', example: 'STUDENT', enum: ['STUDENT', 'INSTRUCTOR', 'ADMIN'] },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'User registered successfully' },
            '400': { description: 'Validation error or duplicate email' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'User Login & JWT token retrieval',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: { type: 'string', example: 'student@learnhub.com' },
                    password: { type: 'string', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Login successful' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'User Logout',
          responses: { '200': { description: 'Logged out successfully' } },
        },
      },
      '/api/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current authenticated user profile',
          responses: { '200': { description: 'User profile data' } },
        },
      },
      '/api/courses': {
        get: {
          tags: ['Courses'],
          summary: 'Get list of published courses with filters',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'level', in: 'query', schema: { type: 'string' } },
            { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['newest', 'popularity', 'priceLow', 'priceHigh'] } },
          ],
          responses: { '200': { description: 'Course list' } },
        },
        post: {
          tags: ['Courses'],
          summary: 'Create a new course (Instructor/Admin)',
          responses: { '201': { description: 'Course created' } },
        },
      },
      '/api/courses/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get course details by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Course details' }, '404': { description: 'Course not found' } },
        },
      },
      '/api/enrollments': {
        post: {
          tags: ['Enrollments'],
          summary: 'Enroll student into a course',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { courseId: { type: 'string' } },
                },
              },
            },
          },
          responses: { '201': { description: 'Successfully enrolled in the course!' } },
        },
      },
      '/api/progress': {
        get: {
          tags: ['Progress'],
          summary: 'Get student course progress metrics',
          responses: { '200': { description: 'Progress metrics calculated' } },
        },
      },
    },
  };

  return NextResponse.json(swaggerSpec);
}
