  
const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/calendars", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB)

  describe("GET /:id/events/:id", () => {
    let calendar1
    beforeEach(async () => {
    calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
    });

    it("should return 404 if no matching id", async () => {
      const res = await request(server).get("/calendars/" + calendar1._id +"/events/id1");
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /:id/events/:id after multiple POST /', () => {
    let calendar1, calendar2;
    let event1, event2;

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
      calendar2 = (await request(server).post("/calendars").send({ name: 'calendar2' })).body;
      event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send({ name: 'event1', date: '2005-06-06T07:52:58.000Z' })).body;
      event2 = (await request(server).post("/calendars/" + calendar2._id + "/events").send({ name: 'event2', date: '2005-06-06T07:52:58.000Z' })).body;
    });

    it('should return event1 using its id', async () => {
      const res = await request(server).get("/calendars/" + calendar1._id + "/events/" + event1._id);
      expect(res.statusCode).toEqual(200);    
      const storedEvent = res.body;
      expect(storedEvent).toMatchObject({ 
        name: 'event1', 
        _id: event1._id, 
        date: '2005-06-06T07:52:58.000Z'
      });
    });
  
    it('should return event2 using its id', async () => {
      const res = await request(server).get("/calendars/" + calendar2._id + "/events/" + event2._id);
      expect(res.statusCode).toEqual(200);    
      const storedEvent = res.body;
      expect(storedEvent).toMatchObject({ 
        name: 'event2', 
        _id: event2._id,
        date: '2005-06-06T07:52:58.000Z'
      });
    });
  });

  describe('POST /:id/events/:id', () => {
    let calendar1

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
    });
    it('should return a 400 without a provided name', async () => {
      const res = await request(server).post("/calendars/" + calendar1._id + "/events").send({});
      expect(res.statusCode).toEqual(400);    
    });
  });

  describe('GET /:id/events after multiple POST /:id/events', () => {
    let calendar1
    let event1, event2

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
      event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send({ name: 'event1', date: '2005-06-06T07:52:58.000Z' })).body;
      event2 = (await request(server).post("/calendars/" + calendar1._id + "/events").send({ name: 'event2', date: '2005-06-06T07:52:58.000Z' })).body;
    });

    it('should return all events', async () => {
      const res = await request(server).get("/calendars/" + calendar1._id + "/events");
      expect(res.statusCode).toEqual(200);    
      const storedEvents = res.body;
      expect(storedEvents).toMatchObject([event1, event2]);
    });
  });

  describe('PUT /:id/events/:id after POST /:id/events', () => {
    let calendar1;
    let event1;

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
      event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send({ name: 'event1', date: '2005-06-06T07:52:58.000Z' })).body;
    });

    it('should store and return calendar1 with new name', async () => {
      const res = await request(server)
        .put("/calendars/" + calendar1._id + "/events/" + event1._id)
        .send({ name: 'new name', date: '2005-06-06T07:52:58.000Z' });
      expect(res.statusCode).toEqual(200);    

      const storedCalendar = (await request(server).get("/calendars/" + calendar1._id + "/events/" + event1._id)).body;
      expect(storedCalendar).toMatchObject({ 
        name: 'new name', 
        _id: event1._id,
        date: '2005-06-06T07:52:58.000Z'
      });
    });
  });

  describe('DELETE /:id/events/:id after POST /:id/events', () => {
    let calendar1;
    let event1;

    beforeEach(async () => {
      calendar1 = (await request(server).post("/calendars").send({ name: 'calendar1' })).body;
      event1 = (await request(server).post("/calendars/" + calendar1._id + "/events").send({ name: 'event1', date: '2005-06-06T07:52:58.000Z' })).body;
    });

    it('should delete and not return event1 on next GET', async () => {
      const res = await request(server).delete("/calendars/" + calendar1._id + "/events/" + event1._id);
      expect(res.statusCode).toEqual(200);    
      const storedCalendarResponse = (await request(server).get("/calendars/" + calendar1._id + "'/events/" + event1._id));
      expect(storedCalendarResponse.status).toEqual(404);
    });
  });
});