using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

@cds.persistence.extensible
entity Books : managed {
  key ID : Integer;
  @mandatory title  : localized String(111);
  descr  : localized String(1111);
  @mandatory author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
  image : LargeBinary @Core.MediaType : 'image/png';
}

@cds.persistence.extensible
entity Authors : managed {
  key ID : Integer;
  @mandatory name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
@cds.persistence.extensible
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}

@cds.persistence.extensible
entity Orders : managed {
  key ID : Integer;
  orderDate : Date;
  items : Composition of many OrderItems on items.order = $self;
}

@cds.persistence.extensible
entity OrderItems : managed {
  key ID : Integer;
  book : Association to Books;
  quantity : Integer;
  order : Association to Orders;
}