using { sap.capire.bookshop as my } from '../db/schema';

service AdminService {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  entity Genres as projection on my.Genres;

  action createAuthor(
    name: String(111),
    dateOfBirth: Date,
    placeOfBirth: String,
    dateOfDeath: Date,
    placeOfDeath: String
  ) returns Authors;

  action createBook(
    title: String(111),
    stock: Integer,
    author_ID: Integer,
    genre_ID: Integer,
    price: Decimal(10,2),
    currency_code: String(3),
    additionalInfo: String(255) 
  ) returns Books;
}