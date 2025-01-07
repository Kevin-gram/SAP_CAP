const cds = require('@sap/cds');
const { expect } = require('chai');
const { Books, Orders, OrderItems } = cds.entities('sap.capire.bookshop');

describe('CatalogService', () => {
  let srv;

  before(async () => {
    srv = await cds.connect.to('CatalogService');
  });

  it('should add discount for overstocked books', async () => {
    const book = { ID: 1, title: 'Test Book', stock: 120 };
    await srv.emit('CREATE', 'Books', book);
    const result = await srv.run(SELECT.one.from(Books).where({ ID: 1 }));
    expect(result.title).to.include('11% discount!');
  });

  it('should handle deep insert for orders', async () => {
    const items = [{ book: 1, quantity: 2 }];
    const req = { data: { items }, user: { id: 'test-user' } };
    const result = await srv.emit('submitOrder', req);
    expect(result.stock).to.be.lessThan(120);
  });

  it('should emit NewBookCreated event when a new book is created', async () => {
    const book = { ID: 2, title: 'New Book', author: 'Author' };
    await srv.emit('CREATE', 'Books', book);
    // Add assertions to verify the event was emitted
  });

  it('should emit BookUpdated event when a book is updated', async () => {
    const book = { ID: 1, title: 'Updated Book', author: 'Author' };
    await srv.emit('UPDATE', 'Books', book);
    // Add assertions to verify the event was emitted
  });

  it('should emit BookDeleted event when a book is deleted', async () => {
    const book = { ID: 1, title: 'Deleted Book', author: 'Author' };
    await srv.emit('DELETE', 'Books', book);
    // Add assertions to verify the event was emitted
  });

  it('should handle READ requests for Books with specific fields', async () => {
    const req = { query: { SELECT: { columns: ['ID', 'title', 'author_ID'] } } };
    const result = await srv.emit('READ', 'Books', req);
    expect(result).to.be.an('array');
    expect(result[0]).to.have.all.keys('ID', 'title', 'author');
  });
});