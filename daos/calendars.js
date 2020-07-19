const Calendars = require('../models/calendars');

module.exports = {};
  
module.exports.create = async (name) => {
  try {
  return await Calendars.create({ name });
} catch (e) {
  return null;
}
};

module.exports.getAll = async () => {
  try {
    const calendars = await Calendars.find({}).lean();
    return calendars;
  } catch (e) {
    return null;
  }
};


module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.updateById = async (calendarId, calendar) => {
  try {
    return await Calendars.update({ _id: calendarId }, calendar);
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async (calendarId) => {
  try {
    await Calendars.remove({ _id: calendarId });
  } catch (e) {
    return null;
  }
}