const { randomUUID } = require('crypto');

const state = {
  users: [],
  companies: [],
  surveys: [],
  responses: [],
  sentimentLogs: [],
};

function id() {
  return randomUUID();
}

function createUser(user) {
  const record = { _id: id(), createdAt: new Date(), updatedAt: new Date(), ...user };
  state.users.push(record);
  return record;
}

function findUserByEmail(email) {
  return state.users.find((user) => user.email === email) || null;
}

function createSurvey(survey) {
  const record = { _id: id(), createdAt: new Date(), updatedAt: new Date(), ...survey };
  state.surveys.push(record);
  return record;
}

function findActiveSurvey(companyId) {
  return state.surveys.find((survey) => survey.companyId === companyId && survey.isActive) || null;
}

function findSurveyById(surveyId) {
  return state.surveys.find((survey) => survey._id === surveyId) || null;
}

function createResponse(response) {
  const record = { _id: id(), createdAt: new Date(), updatedAt: new Date(), ...response };
  state.responses.push(record);
  return record;
}

function findResponsesByDepartment(department) {
  return state.responses.filter((response) => response.department === department);
}

module.exports = {
  state,
  createUser,
  findUserByEmail,
  createSurvey,
  findActiveSurvey,
  findSurveyById,
  createResponse,
  findResponsesByDepartment,
};