const { Router } = require("express");
const router = Router();

const EventDAO = require('../daos/events');

router.post("/:id/events", async (req, res, next) => {
  if (!req.body.name) {
    res.sendStatus(400);
  } else {
  const event = await EventDAO.create(req.body);
  res.json(event);
  }
});

router.get("/:id/events", async (req, res, next) => {
  const events = await EventDAO.getAll();
  if (events) {
    res.json(events);
  } else {
    res.sendStatus(404);
  }
});

router.get("/:id/events/:id", async (req, res, next) => {
  const event = await EventDAO.getById(req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.sendStatus(404);
  }
});

router.put("/:id/events/:id", async (req, res, next) => {
  const eventId = req.params.id;
  const data = req.body;

  if (!data || JSON.stringify(data) === "{}") {
    res.status(400).send('Event is required"');
  } else {
    const updatedEvent =  await EventDAO.updateById(eventId, data);
    res.json(updatedEvent);
  }
});

router.delete("/:id/events/:id", async (req, res, next) => {
  const eventId = req.params.id;
  try {
    await EventDAO.deleteById(eventId);
    res.sendStatus(200);
    } catch(e) {
      res.status(500).send(e.message);
    }
});

module.exports = router;