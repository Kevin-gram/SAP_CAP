const { expect } = require('chai');
const sinon = require('sinon');
const cds = require('@sap/cds');
const AdminService = require('../path_to_your_AdminService'); // Replace with the correct path to your AdminService

describe('AdminService - createAuthor', function() {
  let adminService;
  let insertSpy;

  beforeEach(() => {
    // Create a spy for the INSERT method to mock the database insert
    insertSpy = sinon.spy();

    // Mocking the cds entities
    cds.entities = {
      Authors: {
        // Mock the insert method
        insert: insertSpy,
      },
    };

    // Initialize the AdminService class
    adminService = new AdminService();
    adminService.init();
  });

  it('should successfully create an author when valid data is provided', async function() {
    // Prepare mock request data for createAuthor action
    const req = {
      data: {
        name: 'John Doe',
        dateOfBirth: '1980-01-01',
        placeOfBirth: 'New York',
        dateOfDeath: null,
        placeOfDeath: null,
      },
      error: sinon.stub(),
    };

    // Simulate the createAuthor action
    await adminService['createAuthor'](req);

    // Assert that the INSERT method was called
    expect(insertSpy.calledOnce).to.be.true;

    // Assert that the correct parameters were passed to the INSERT method
    const newAuthor = insertSpy.getCall(0).args[0];
    expect(newAuthor).to.have.property('name', 'John Doe');
    expect(newAuthor).to.have.property('dateOfBirth', '1980-01-01');
    expect(newAuthor).to.have.property('placeOfBirth', 'New York');
    expect(newAuthor).to.have.property('dateOfDeath', null);
    expect(newAuthor).to.have.property('placeOfDeath', null);
  });

  it('should return an error if the name is missing or invalid', async function() {
    // Prepare an invalid request with missing name
    const req = {
      data: {
        name: '',
        dateOfBirth: '1980-01-01',
        placeOfBirth: 'New York',
      },
      error: sinon.stub(),
    };

    // Simulate the createAuthor action
    await adminService['createAuthor'](req);

    // Assert that an error was returned
    expect(req.error.calledOnce).to.be.true;
    expect(req.error.args[0][0]).to.equal(400);
    expect(req.error.args[0][1]).to.equal('Invalid or missing "name"');
  });

  afterEach(() => {
    sinon.restore(); // Restore the original state of the sinon spies
  });
});
