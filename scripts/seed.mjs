import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LearnHub database...');

  // Clean existing data
  await prisma.lessonProgress.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  // Users
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@learnhub.com',
      password: defaultPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      bio: 'Platform administrator keeping learning smooth and secure.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
  });

  const instructor = await prisma.user.create({
    data: {
      name: 'Prof. Sarah Jenkins',
      email: 'instructor@learnhub.com',
      password: defaultPasswordHash,
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      bio: 'Senior Software Architect & CS Educator with 10+ years of industry experience.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'student@learnhub.com',
      password: defaultPasswordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      bio: 'Computer Science student passionate about fullstack web development and AI.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
  });

  console.log('Users created: Admin, Instructor, Student');

  // Courses
  const coursesData = [
    {
      title: 'Full Stack Web Development with React & Next.js',
      description: 'Master modern full-stack web development using Next.js App Router, React, Tailwind CSS, TypeScript, and Node.js APIs. Build scalable, high-performance web applications from scratch.',
      category: 'Web Development',
      level: 'Intermediate',
      duration: '40 Hours',
      price: 89.99,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      lessons: [
        { title: 'Introduction to Modern Web Architecture', description: 'Understand client vs server components, SSR, and API design.', videoUrl: 'https://www.youtube.com/embed/Sklc_poXAJc', duration: '25 mins', orderNumber: 1 },
        { title: 'Building Components with Tailwind CSS', description: 'Design responsive layouts and UI primitives.', videoUrl: 'https://www.youtube.com/embed/dFgzHOX84xQ', duration: '35 mins', orderNumber: 2 },
        { title: 'State Management and React Hooks', description: 'Use useState, useEffect, and custom hooks effectively.', videoUrl: 'https://www.youtube.com/embed/00lxm_doFYw', duration: '40 mins', orderNumber: 3 },
        { title: 'Connecting REST APIs and Database', description: 'Perform full CRUD operations with Prisma ORM and API routes.', videoUrl: 'https://www.youtube.com/embed/zL0aTqV0jWw', duration: '50 mins', orderNumber: 4 },
      ],
    },
    {
      title: 'Java Programming & Spring Boot Enterprise Masterclass',
      description: 'Comprehensive course covering core Java 17+, Object-Oriented Programming, Spring Boot REST APIs, Spring Security with JWT, JPA Hibernate, and MySQL integration.',
      category: 'Java',
      level: 'Beginner',
      duration: '45 Hours',
      price: 79.99,
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      lessons: [
        { title: 'Java Syntax & Core OOP Principles', description: 'Classes, Objects, Polymorphism, Inheritance, and Interfaces.', videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34', duration: '30 mins', orderNumber: 1 },
        { title: 'Spring Boot Application Architecture', description: 'Controllers, Services, Repositories, and Dependency Injection.', videoUrl: 'https://www.youtube.com/embed/9SGDpanrc8U', duration: '45 mins', orderNumber: 2 },
        { title: 'Database Persistence with Spring Data JPA', description: 'Entities, Repositories, Custom Queries, and Relationships.', videoUrl: 'https://www.youtube.com/embed/HerC_ErmZ0w', duration: '50 mins', orderNumber: 3 },
      ],
    },
    {
      title: 'Python Programming from Zero to Hero',
      description: 'Learn Python programming from scratch. Cover variables, loops, functions, OOP, data analysis, and script automation with real-world hands-on exercises.',
      category: 'Python',
      level: 'Beginner',
      duration: '30 Hours',
      price: 49.99,
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      lessons: [
        { title: 'Python Basics & Control Flow', description: 'Learn conditional statements, loops, and data types.', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: '20 mins', orderNumber: 1 },
        { title: 'Functions, Modules & Package Management', description: 'Writing modular code and using pip.', videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw', duration: '35 mins', orderNumber: 2 },
      ],
    },
    {
      title: 'Data Science & Machine Learning with Python',
      description: 'Practical guide to Data Science, Pandas, NumPy, Matplotlib, Scikit-Learn, Supervised & Unsupervised Machine Learning algorithms, and model evaluation.',
      category: 'Machine Learning',
      level: 'Advanced',
      duration: '50 Hours',
      price: 99.99,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      lessons: [
        { title: 'Data Cleaning & Preprocessing with Pandas', description: 'Handling missing values, data transformation, and EDA.', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '40 mins', orderNumber: 1 },
        { title: 'Supervised Learning: Regression & Classification', description: 'Linear regression, Decision Trees, and Random Forests.', videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg', duration: '60 mins', orderNumber: 2 },
      ],
    },
    {
      title: 'Database Management Systems & SQL Mastery',
      description: 'Master relational database design, Normalization (1NF to 3NF), complex SQL queries, JOINs, Indexing, Transactions, and MySQL optimization.',
      category: 'Database',
      level: 'Intermediate',
      duration: '25 Hours',
      price: 59.99,
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      lessons: [
        { title: 'Relational Model & SQL Fundamentals', description: 'SELECT, WHERE, GROUP BY, and Aggregations.', videoUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', duration: '30 mins', orderNumber: 1 },
        { title: 'Advanced JOINs & Indexing Strategies', description: 'INNER, LEFT, RIGHT JOINs, B-Trees, and Query Optimization.', videoUrl: 'https://www.youtube.com/embed/9yeOJ0ZMUYw', duration: '45 mins', orderNumber: 2 },
      ],
    },
    {
      title: 'Cloud Computing & DevOps Architecture (AWS & Docker)',
      description: 'Learn Cloud Architecture, AWS Services (EC2, S3, RDS, Lambda), Containerization with Docker, Kubernetes, and CI/CD pipelines.',
      category: 'Cloud Computing',
      level: 'Advanced',
      duration: '35 Hours',
      price: 89.99,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      lessons: [
        { title: 'Cloud Infrastructure Fundamentals', description: 'VPC, EC2 instances, Security Groups, and IAM roles.', videoUrl: 'https://www.youtube.com/embed/3hLmDS179YE', duration: '35 mins', orderNumber: 1 },
        { title: 'Containerization with Docker & Compose', description: 'Writing Dockerfiles, building images, and multi-container orchestration.', videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo', duration: '45 mins', orderNumber: 2 },
      ],
    },
    {
      title: 'Cyber Security Essentials & Ethical Hacking',
      description: 'Understand web security vulnerabilities (OWASP Top 10), penetration testing, cryptography, network packet analysis, and secure code practices.',
      category: 'Cyber Security',
      level: 'Intermediate',
      duration: '32 Hours',
      price: 69.99,
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      lessons: [
        { title: 'OWASP Top 10 Web Vulnerabilities', description: 'SQL Injection, XSS, CSRF, and Authentication Bypasses.', videoUrl: 'https://www.youtube.com/embed/2nA3-o3-X6Q', duration: '40 mins', orderNumber: 1 },
      ],
    },
    {
      title: 'Data Science & Statistical Analysis for Business',
      description: 'Applied statistical analysis, hypothesis testing, predictive modeling, and data visualization using Python and Tableau for decision making.',
      category: 'Data Science',
      level: 'Intermediate',
      duration: '28 Hours',
      price: 64.99,
      thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      lessons: [
        { title: 'Descriptive & Inferential Statistics', description: 'Mean, Median, Variance, Standard Deviation, and Z-scores.', videoUrl: 'https://www.youtube.com/embed/Vfo5le26667', duration: '30 mins', orderNumber: 1 },
      ],
    },
  ];

  let firstCourseId = '';

  for (const c of coursesData) {
    const createdCourse = await prisma.course.create({
      data: {
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level,
        duration: c.duration,
        price: c.price,
        thumbnail: c.thumbnail,
        rating: c.rating,
        status: 'PUBLISHED',
        instructorId: instructor.id,
        lessons: {
          create: c.lessons,
        },
      },
      include: {
        lessons: true,
      },
    });

    if (!firstCourseId) {
      firstCourseId = createdCourse.id;
    }
  }

  console.log('Courses & Lessons created successfully!');

  // Create Quiz for first course
  const quiz = await prisma.quiz.create({
    data: {
      courseId: firstCourseId,
      title: 'Full Stack Next.js Assessment Quiz',
      description: 'Test your understanding of React Server Components, Client Hooks, and REST API Integration.',
      totalMarks: 30,
      duration: 15,
      questions: {
        create: [
          {
            question: 'Which component type is the default in Next.js App Router?',
            optionA: 'Client Component',
            optionB: 'Server Component',
            optionC: 'Class Component',
            optionD: 'Higher Order Component',
            correctAnswer: 'B',
            marks: 10,
          },
          {
            question: 'What directive must be added at the top of a file to make it a React Client Component?',
            optionA: '"use client"',
            optionB: '"use server"',
            optionC: '"use react"',
            optionD: '"use frontend"',
            correctAnswer: 'A',
            marks: 10,
          },
          {
            question: 'Which HTTP method is used to create new data in REST API standards?',
            optionA: 'GET',
            optionB: 'PUT',
            optionC: 'POST',
            optionD: 'DELETE',
            correctAnswer: 'C',
            marks: 10,
          },
        ],
      },
    },
  });

  // Create Assignment for first course
  const assignment = await prisma.assignment.create({
    data: {
      courseId: firstCourseId,
      title: 'Build a Next.js REST API Endpoint',
      description: 'Implement a complete Route Handler in Next.js that validates JWT headers, interacts with Prisma ORM, and returns a standard JSON response.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      maximumMarks: 100,
    },
  });

  // Enroll Student in first course
  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: student.id,
      courseId: firstCourseId,
      status: 'ACTIVE',
    },
  });

  // Get first lesson of first course to add sample lesson progress
  const firstCourseLessons = await prisma.lesson.findMany({
    where: { courseId: firstCourseId },
  });

  if (firstCourseLessons.length > 0) {
    await prisma.lessonProgress.create({
      data: {
        studentId: student.id,
        lessonId: firstCourseLessons[0].id,
        completed: true,
      },
    });
  }

  // Add a sample quiz attempt for student
  await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      studentId: student.id,
      score: 30,
      totalMarks: 30,
      percentage: 100,
      passed: true,
    },
  });

  // Add a sample assignment submission
  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.id,
      submissionText: 'Here is my GitHub Repository link containing the Next.js REST API implementation: https://github.com/alex/nextjs-api-demo',
      fileUrl: 'https://github.com/alex/nextjs-api-demo',
      status: 'GRADED',
      marksObtained: 95,
      feedback: 'Excellent work on clean modular route handlers and JWT security implementation!',
    },
  });

  console.log('Sample Enrollments, Quizzes, Assignments, and Progress created successfully!');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
