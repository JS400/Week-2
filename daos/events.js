const Events = require('../models/events');

module.exports = {};
  
module.exports.create = async (event) => {
  const eventData = ({name: event.name, date: event.date})
  try {
  return await Events.create(eventData);
} catch (e) {
  return 'Create Error ' + e;
}
};

module.exports.getAll = async () => {
  try {
    const events = await Events.find({}).lean();
    return events;
  } catch (e) {
    return null;
  }
};


module.exports.getById = async (id) => {
  try {
    const event = await Events.findOne({ _id: id }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.updateById = async (eventId, event) => {
  const eventData = ({name: event.name, date: event.date})
  try {
    return await Events.update({ _id: eventId }, eventData);
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async (eventId) => {
  try {
    await Events.remove({ _id: eventId });
  } catch (e) {
    return null;
  }
}