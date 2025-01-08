const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService { init() {

  const { Books } = this.entities;

  /**
   * Generate IDs for new Books drafts
   */
  this.before('NEW', Books.drafts, async (req) => {
    if (req.data.ID) return;
    const { ID: id1 } = await SELECT.one.from(Books).columns('max(ID) as ID');
    const { ID: id2 } = await SELECT.one.from(Books.drafts).columns('max(ID) as ID');
    req.data.ID = Math.max(id1 || 0, id2 || 0) + 1;
  });

  const { Authors } = cds.entities('sap.capire.bookshop');

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

  return super.init();
}};