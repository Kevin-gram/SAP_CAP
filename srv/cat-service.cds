using { sap.capire.bookshop as my } from '../db/schema';

service CatalogService {
  /** For display in details pages */
  entity Books as projection on my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  entity Orders as projection on my.Orders;
  entity OrderItems as projection on my.OrderItems;

  // Type definition for order items
  type OrderItem {
    book     : Books:ID @mandatory;
    quantity : Integer @mandatory;
  }

  action submitOrder (
    items : array of OrderItem
  ) returns { stock: Integer };

  event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };
  event NewBookCreated :{
    ID: Integer;
    title:String;
    author: String;
  }
}