import api from './api';

export const enrollmentService = {
  enrollCourse: async (courseId: string) => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },

  getStudentEnrollments: async (studentId: string) => {
    const response = await api.get(`/enrollments/student/${studentId}`);
    return response.data;
  },

  getCourseEnrollments: async (courseId: string) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },

  cancelEnrollment: async (id: string) => {
    const response = await api.delete(`/enrollments/${id}`);
    return response.data;
  },
};
