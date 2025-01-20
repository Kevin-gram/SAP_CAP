using { sap.capire.bookshop as my } from '../db/schema';

service AdminService {
  @requires: 'Admin'
  entity Books as projection on my.Books;

  @requires: 'Admin'
  entity Authors as projection on my.Authors;

  @requires: 'Admin'
  entity Genres as projection on my.Genres;

  @requires: 'Admin'
  entity Orders as projection on my.Orders;

  @requires: 'Admin'
  entity OrderItems as projection on my.OrderItems;

  @requires: 'Admin'
  action createAuthor(
    name: String(111),
    dateOfBirth: Date,
    placeOfBirth: String,
    dateOfDeath: Date,
    placeOfDeath: String
  ) returns Authors;

  @requires: 'Admin'
  action createBook(
    title: String(111),
    descr: String(1111),
    stock: Integer,
    author_ID: Integer,
    genre_ID: Integer,
    price: Decimal(10,2),
    currency_code: String(3),
    additionalInfo: String(255)
  ) returns Books;

  @requires: 'Client'
  action submitOrder (
    items : array of OrderItem
  ) returns { stock: Integer };

  event NewBookCreated : {
    ID: Integer;
    title: String;
    descr: String;
    author: String;
  };

  event BookUpdated : {
    ID: Integer;
    title: String;
    descr: String;
    author: String;
  };

  event BookDeleted : {
    ID: Integer;
    title: String;
    descr: String;
    author: String;
  };

  event OrderedBook : { book: Books:ID; quantity: Integer; buyer: String };
}

type OrderItem {
  book_ID: Integer;
  quantity: Integer;
}