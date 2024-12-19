using { sap.capire.bookshop as my } from '../db/schema';

service AdminService {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  entity Genres as projection on my.Genres;
} 
annotate AdminService.Books with @odata.draft.enabled;
