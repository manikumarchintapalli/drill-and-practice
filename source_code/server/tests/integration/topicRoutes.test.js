import request from 'supertest';
import slugify from 'slugify';
import app from '../../index.js';
import Topic from '../../models/Topic.js';
import Course from '../../models/Course.js';
import User from '../../models/userSchema.js';

let adminToken;
let course;

beforeEach(async () => {
  await Topic.deleteMany({});
  await Course.deleteMany({});
  await User.deleteMany({});

  course = await Course.create({
    name: 'Test Course ' + Date.now(),
    description: 'Course for testing',
  });

  await User.create({
    email: 'admin@example.com',
    password: 'password123',
    username: 'AdminUser',
    phoneNo: '9999999999',
    dob: '1990-01-01',
    role: 'admin',
  });

  const res = await request(app).post('/api/admin/sign-in').send({
    email: 'admin@example.com',
    password: 'password123',
  });

  adminToken = res.text;
});

describe(' Topic Routes', () => {
  test('should create a new topic with valid data', async () => {
    const topicData = {
      name: 'Variables',
      course: course._id.toString(),
    };

    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(topicData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('slug', slugify(topicData.name, { lower: true }));
  });

  test(' should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('should return 409 for duplicate topic under same course', async () => {
    const topicData = {
      name: 'Variables',
      course: course._id.toString(),
    };

    await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(topicData);

    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(topicData);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  test('should fetch all topics', async () => {
    await Topic.create({
      name: 'Functions',
      slug: slugify('Functions', { lower: true }),
      course: course._id,
    });

    const res = await request(app).get('/api/topics');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should fetch topics filtered by course', async () => {
    await Topic.create({
      name: 'Loops',
      slug: slugify('Loops', { lower: true }),
      course: course._id,
    });

    const res = await request(app).get('/api/topics').query({ courseId: course._id.toString() });
    expect(res.status).toBe(200);
    expect(res.body.every(t => t.course._id === course._id.toString())).toBe(true);
  });

  test('should fetch all topics without courseId filter', async () => {
    await Topic.create({
      name: 'Basics',
      slug: slugify('Basics', { lower: true }),
      course: course._id,
    });
  
    const res = await request(app).get('/api/topics');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('should handle server error while creating topic', async () => {
    const originalSave = Topic.prototype.save;
    Topic.prototype.save = () => { throw new Error("Simulated DB crash"); };
  
    const res = await request(app)
      .post('/api/topics')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Error Topic', course: course._id });
  
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Failed to create topic');
  
    Topic.prototype.save = originalSave; // restore
  });
});
