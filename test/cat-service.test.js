const cds = require('@sap/cds');
const { expect } = require('chai');

describe('CatalogService', () => {
  let srv;
  let Books, Orders, OrderItems;

  before(async () => {
    // Initialize the cds module and load the entities
    const model = await cds.load('*');
    cds.model = model;
    Books = cds.model.definitions['sap.capire.bookshop.Books'];
    Orders = cds.model.definitions['sap.capire.bookshop.Orders'];
    OrderItems = cds.model.definitions['sap.capire.bookshop.OrderItems'];

    // Connect to the CatalogService
    srv = await cds.test('CatalogService');
  });

  describe('Books Service', () => {
    it('should add discount for overstocked books', async () => {
      const book = { ID: 1, title: 'Test Book', stock: 120 };
      await srv.run(INSERT.into(Books).entries(book));
      const result = await srv.run(SELECT.one.from(Books).where({ ID: 1 }));
      expect(result.title).to.include('11% discount!');
    });

    it('should emit NewBookCreated event when a new book is created', async () => {
      const book = { ID: 2, title: 'New Book', author: 'Author' };
      await srv.run(INSERT.into(Books).entries(book));
      // Add assertions to verify the event was emitted
    });

    it('should emit BookUpdated event when a book is updated', async () => {
      const book = { ID: 1, title: 'Updated Book', author: 'Author' };
      await srv.run(UPDATE(Books).set(book).where({ ID: 1 }));
      // Add assertions to verify the event was emitted
    });

    it('should emit BookDeleted event when a book is deleted', async () => {
      const book = { ID: 1, title: 'Deleted Book', author: 'Author' };
      await srv.run(DELETE.from(Books).where({ ID: 1 }));
      // Add assertions to verify the event was emitted
    });

    it('should handle READ requests for Books with specific fields', async () => {
      const req = { query: { SELECT: { columns: ['ID', 'title', 'author_ID'] } } };
      const result = await srv.run(SELECT.from(Books).columns('ID', 'title', 'author.name as author'));
      expect(result).to.be.an('array');
      expect(result[0]).to.have.all.keys('ID', 'title', 'author');
    });
  });

  describe('Orders Service', () => {
    it('should handle deep insert for orders', async () => {
      const items = [{ book: 1, quantity: 2 }];
      const req = { data: { items }, user: { id: 'test-user' } };
      const result = await srv.run(INSERT.into(Orders).entries({ orderDate: new Date() }));
      expect(result).to.be.an('object');
    });
  });
});