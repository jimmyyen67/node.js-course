const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Post = require('../models/Post');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Post.deleteMany();
});

describe('Post Model Test', () => {
  it('create & save post successfully', async () => {
    const validPost = new Post({
      title: 'Test Title',
      body: 'Test Body'
    });
    const savedPost = await validPost.save();
    
    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe('Test Title');
    expect(savedPost.body).toBe('Test Body');
    expect(savedPost.createdAt).toBeDefined();
    expect(savedPost.updatedAt).toBeDefined();
  });

  it('create post without required field should fail', async () => {
    const postWithoutRequiredField = new Post({ title: 'Test Title' });
    let err;
    try {
      await postWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.body).toBeDefined();
  });

  it('create post with invalid field type should fail', async () => {
    const postWithInvalidField = new Post({
      title: 'Test Title',
      body: 'Test Body',
      createdAt: 'invalid date'
    });
    let err;
    try {
      await postWithInvalidField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.createdAt).toBeDefined();
  });
});