ss.rpc('book.findAll', '', function(books){
	if(books && books!='heresy'){
		console.log(books);
	}
});