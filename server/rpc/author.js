var Author = require(__dirname + "/../models/author.js");

exports.actions = function(req, res, ss) {

  req.use('session');
  
  return {
      /**
       * 	Finds an author by id.
       *
       * */
      findById : function(id) {
          Author.findById(id, function(err, author) {
              if (err != null) {
                  return res(author);
              } else {
                  return res('heresy');
              }
          });
      },

      /**
       *  Finds an author by its name in the db.
       *
       * */
      findByName: function(name){
          Author.findByName(name, function(err, author){
              if(author==null){
                  return res('heresy');
              } else {
                  return res(author);
              }
          });
      },

      /**
       *	Retrieves all authors from the database.
       *
       * */
      findAll : function() {
          Author.findAll(function(err, authors) {
              if (err != null) {
                  return res(authors);
              } else {
                  return res('heresy');
              }
          });
      },

      /**
       * 	Updates the details of an author.
       *
       * */
      update : function(author) {
          Author.edit(author.id, author.name, author.books, function(err, author) {
              if (err != null) {
                  return res(author);
              } else {
                  return res('heresy');
              }
          });
      },

      /**
       * 	Removes an author from the db.
       *
       * */
      remove : function(id) {
          Author.remove(id, function() {
          });
      }

  };

};
