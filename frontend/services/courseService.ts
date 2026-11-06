import api from './api';

export const courseService = {
  getAllCourses: async (params?: { search?: string; category?: string; level?: string; sortBy?: string }) => {
    const response = await api.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: string, courseData: any) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};
