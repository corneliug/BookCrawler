var Author = require(__dirname + "/../models/author.js");

module.exports = {
    /**
     * 	Finds an author by id.
     *
     * */
    findById : function(id) {
        Author.findById(id, function(err, author) {
            if (err != null) {
                return author;
            } else {
                return 'heresy';
            }
        });
    },

    /**
     *  Finds an author by its name in the db.
     *
     * */
    findByName: function(name, callback){
        Author.findByName(name, function(err, author){
            if(author==null){
                return callback('heresy');
            } else {
                return callback(author);
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
                return authors;
            } else {
                return 'heresy';
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
    },

    filter: function(author, book){
        Author.findByName(author.name, function(err, existentAuthor){
            var authorUpdates;

            if (existentAuthor != null && !err) {
                if (existentAuthor.books != null && existentAuthor.books.length != 0) {
                    for (var k = 0; k < existentAuthor.books.length; k++) {

                        if (existentAuthor.books[k].title != null && book.title != null) {
                            var titleRegex1 = new RegExp(existentAuthor.books[k].title);
                            var titleRegex2 = new RegExp(book.title);

                            var title1 = existentAuthor.books[k].title;
                            var title2 = book.title;

                            if (!title1.match(titleRegex2) && !title2.match(titleRegex1)) {
                                existentAuthor.books.push(book);
                                authorUpdates = true;
                            }
                        }
                    }
                } else {
                    authorUpdates = true;
                    existentAuthor.books.push(book);
                }

                if(authorUpdates){
                    edit(existentAuthor);
                }
            } else {
                author.save();
            }
        });
    }

  };

/**
 * 	Updates the details of an author.
 *
 * */
var edit = function(author) {
    Author.edit(author.id, author.name, author.books, function(err, author) {
        if (err != null) {
            return author;
        } else {
            return 'heresy';
        }
    });
}

exports.edit = edit;
