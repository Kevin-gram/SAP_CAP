using { sap.capire.bookshop as my } from '../db/schema';

extend entity my.Books {
  additionalInfo : String(255);
}

extend entity my.Authors {
  socialMediaProfile : String(255);
  awards : String(255);
}

extend entity my.Genres {
  description : String(255);
}

extend entity my.Orders {
  specialInstructions : String(255);
}

extend entity my.OrderItems {
  discount : Decimal(5,2);
}