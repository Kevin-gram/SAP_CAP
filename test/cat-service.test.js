const { expect } = require('chai');
const sinon = require('sinon');
const cds = require('@sap/cds');
const AdminService = require('../srv/cat-service'); // Correct path to your service

describe('AdminService - createAuthor (Mock test)', function() {
  let adminService;
  let insertSpy;

  beforeEach(() => {
    // Create a spy for the INSERT method to mock the database insert
    insertSpy = sinon.spy();

    // Mock cds.entities before initializing the service
    sinon.stub(cds, 'entities').value({
      Authors: {
        insert: insertSpy, // Mock the insert method
      },
    });

    // Initialize the AdminService class
    adminService = new AdminService();
  });

  it('should call insert method for createAuthor with valid data', async function() {
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

    // Simulate the createAuthor action by triggering it manually
    await adminService['createAuthor'](req);

    // Assert that the INSERT method was called once
    expect(insertSpy.calledOnce).to.be.true;

    // Assert that the correct parameters were passed to the INSERT method
    const newAuthor = insertSpy.getCall(0).args[0];
    expect(newAuthor).to.have.property('name', 'John Doe');
    expect(newAuthor).to.have.property('dateOfBirth', '1980-01-01');
    expect(newAuthor).to.have.property('placeOfBirth', 'New York');
    expect(newAuthor).to.have.property('dateOfDeath', null);
    expect(newAuthor).to.have.property('placeOfDeath', null);
  });

  afterEach(() => {
    sinon.restore(); // Restore the original state of the sinon spies
  });
});
