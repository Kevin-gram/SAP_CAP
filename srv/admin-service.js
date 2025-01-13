const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService { init() {

  const { Books, Authors } = this.entities;

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
      name, // Ensure name is a string
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
    const { title, stock, author_ID, genre_ID, price, currency_code, additionalInfo } = req.data;

    // Validate input data
    if (!title || typeof title !== 'string') {
      return req.error(400, 'Invalid or missing "title"');
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
      stock,
      author_ID,
      genre_ID,
      price,
      currency_code,
      additionalInfo // Include the additionalInfo property
    };
    const result = await INSERT.into(Books).entries(newBook);

    // Emit NewBookCreated event
    await this.emit('NewBookCreated', { ID: newBook.ID, title: newBook.title, author: newBook.author_ID });

    return result;
  });

  // E mit BookUpdated event when a book is updated
  this.after('UPDATE', 'Books', async (data, req) => {
    const { ID, title, author_ID } = data;
    await this.emit('BookUpdated', { ID, title, author: author_ID });
  });

  // Emit BookDeleted event when a book is deleted
  this.after('DELETE', 'Books', async (data, req) => {
    const { ID, title, author_ID } = data;
    await this.emit('BookDeleted', { ID, title, author: author_ID });
  });

  // Handle the NewBookCreated event
  this.on('NewBookCreated', (msg) => {
    console.log('New Book Created:', msg);
  });

  // Handle the BookUpdated event
  this.on('BookUpdated', (msg) => {
    console.log('Book Updated:', msg);
  });

  // Handle the BookDeleted event
  this.on('BookDeleted', (msg) => {
    console.log('Book Deleted:', msg);
  });

  return super.init();
}};