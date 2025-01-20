const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService {
  init() {
    const { Books, Authors, Orders, OrderItems } = this.entities;

    // Implement the createAuthor action with validation
    this.on('createAuthor', async (req) => {
      const { name, dateOfBirth, placeOfBirth, dateOfDeath, placeOfDeath } = req.data;

      // Validate input data
      if (!name || typeof name !== 'string') {
        return req.error(400, 'Invalid or missing "name"');
      }
      if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
        return req.error(400, 'Invalid "dateOfBirth"');
      }
      if (dateOfDeath && isNaN(Date.parse(dateOfDeath))) {
        return req.error(400, 'Invalid "dateOfDeath"');
      }

      const newAuthor = {
        ID: Math.floor(Math.random() * 1000000), // Ensure ID is an integer
        name,
        dateOfBirth,
        placeOfBirth,
        dateOfDeath,
        placeOfDeath
      };
      const result = await INSERT.into(Authors).entries(newAuthor);
      return result;
    });

    // Implement the createBook action with validation
    this.on('createBook', async (req) => {
      const { title, descr, stock, author_ID, genre_ID, price, currency_code, additionalInfo } = req.data;

      // Validate input data
      if (!title || typeof title !== 'string') {
        return req.error(400, 'Invalid or missing "title"');
      }
      if (!descr || typeof descr !== 'string') {
        return req.error(400, 'Invalid or missing "descr"');
      }
      if (stock == null || typeof stock !== 'number' || stock < 0) {
        return req.error(400, 'Invalid or missing "stock"');
      }
      if (!author_ID) {
        return req.error(400, 'Invalid or missing "author_ID"');
      }
      if (!genre_ID) {
        return req.error(400, 'Invalid or missing "genre_ID"');
      }
      if (price == null || typeof price !== 'number' || price < 0) {
        return req.error(400, 'Invalid or missing "price"');
      }
      if (!currency_code) {
        return req.error(400, 'Invalid or missing "currency_code"');
      }

      const newBook = {
        ID: Math.floor(Math.random() * 1000000), // Ensure ID is an integer
        title,
        descr,
        stock,
        author_ID,
        genre_ID,
        price,
        currency_code,
        additionalInfo
      };
      const result = await INSERT.into(Books).entries(newBook);

      // Emit NewBookCreated event
      await this.emit('NewBookCreated', { ID: newBook.ID, title: newBook.title, descr: newBook.descr, author: newBook.author_ID });

      return result;
    });

    // Implement the submitOrder action
    this.on('submitOrder', async (req) => {
      const { items } = req.data;

      // Create a new order
      const order = await INSERT.into(Orders).entries({ orderDate: new Date() });

      // Validate and process each item in the order
      for (const item of items) {
        let { book:id, quantity } = item;
        let book = await SELECT.one.from (Books, id, b => b.stock);

        // Validate input data
        if (!book) return req.error (404, `Book #${id} doesn't exist`);
        if (quantity < 1) return req.error (400, `quantity has to be 1 or more`);
        if (!book.stock || quantity > book.stock) return req.error (409, `${quantity} exceeds stock for book #${id}`);

        // Reduce stock in database
        await UPDATE (Books, id) .with ({ stock: book.stock -= quantity });

        // Create order item
        await INSERT.into(OrderItems).entries({ book_ID: id, quantity, order_ID: order.ID });
      }

      // Emit event for each item in the order
      for (const item of items) {
        let { book, quantity } = item;
        await this.emit('OrderedBook', { book, quantity, buyer: req.user.id });
      }

      // Return the updated stock for the first item as an example
      let firstItem = items[0];
      let updatedBook = await SELECT.one.from (Books, firstItem.book, b => b.stock);
      return updatedBook;
    });

    // Emit NewBookCreated event when a new book is created
    this.after('CREATE', 'Books', async (data, req) => {
      const { ID, title, author } = data;
      await this.emit('NewBookCreated', { ID, title, author });
    });

    // Handle the NewBookCreated event
    this.on('NewBookCreated', (msg) => {
      console.log('New Book Created:', msg);
    });

    // Emit BookUpdated event when a book is updated
    this.after('UPDATE', 'Books', async (data, req) => {
      const { ID, title, author } = data;
      await this.emit('BookUpdated', { ID, title, author });
    });

    this.on('BookUpdated', (msg) => {
      console.log("A book with these details was updated:", msg);
    });

    // Emit BookDeleted event when a book is deleted
    this.after('DELETE', 'Books', async (data, req) => {
      const { ID, title, author } = data;
      await this.emit('BookDeleted', { ID, title, author });
    });

    this.on('BookDeleted', (msg) => {
      console.log("A book with these details was deleted:", msg);
    });

    // Handle READ requests for Books with specific fields
    this.on('READ', 'Books', async (req) => {
      const { ID, title, author_ID } = req.query.SELECT.columns;
      if (ID && title && author_ID) {
        return SELECT.from(Books).columns('ID', 'title', 'author.name as author');
      }
      return SELECT.from(Books);
    });

    // Delegate requests to the underlying generic service
    return super.init();
  }
};