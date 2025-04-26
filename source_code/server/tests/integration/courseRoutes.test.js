// tests/integration/courseRoutes.test.js
import request from 'supertest';
import app from '../../index.js';
import Course from '../../models/Course.js';

describe('Course Routes', () => {
  beforeEach(async () => {
    await Course.deleteMany({});
  });

  describe('GET /api/courses', () => {
    test('should return an empty list when no courses are available', async () => {
      const response = await request(app).get('/api/courses');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return a list of courses', async () => {
      await Course.create([
        { name: 'Math 101', description: 'Intro to Math' },
        { name: 'Science 101', description: 'Intro to Science' },
      ]);

      const response = await request(app).get('/api/courses');
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('POST /api/courses', () => {
    test('should create a new course', async () => {
      const newCourse = {
        name: 'Unique Course ' + Date.now(),
        description: 'Test course',
      };
      const response = await request(app).post('/api/courses').send(newCourse);
      expect(response.statusCode).toBe(201);
      expect(response.body.name).toBe(newCourse.name);
    });

    test('should not allow duplicate course names', async () => {
      const newCourse = {
        name: 'Duplicate Course',
        description: 'Test duplicate',
      };
      await Course.create(newCourse);
      const response = await request(app).post('/api/courses').send(newCourse);
      expect(response.statusCode).toBe(409);
      expect(response.body.error).toBe('Course already exists');
    });
  });
});



