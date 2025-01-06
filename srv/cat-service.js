const cds = require('@sap/cds');

module.exports = class CatalogService extends cds.ApplicationService { init() {

  const { Books, Orders, OrderItems } = cds.entities('sap.capire.bookshop');

  // Add some discount for overstocked books
  this.after('each', 'Books', book => {
    if (book.stock > 111) book.title += ` -- 11% discount!`;
  });

  // Handle deep insert for orders
  this.on('submitOrder', async req => {
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
this.after('UPDATE','Books' ,async (data,req)=>{
  const {ID,title,author}=data;
  await this.emit('BookUpdated', {ID,title,author})
})
 this.on('BookUpdated',(msg)=>{
  console.log("a book with these details was updated :", msg);
 })
this.after('DELETE','Books' ,async (data,req)=>{
  const {ID,title,author}=data;
  await this.emit('BookDeleted', {ID,title,author})
})
this.on('BookDeleted',(msg)=>{
  console.log("a book with these details was deleted :", msg);
 })
  // Delegate requests to the underlying generic service
  return super.init();
}};