const mongoose= require("mongoose");
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;


//user schema
const userSchema = mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true}
});

//application schema
const pageSchema = mongoose.Schema({
	title: {type: String, required: true},
	summary: {type: String, required: true},
	sections: [{
		title: String,
		text: String
	}]
});



userSchema.methods.serialize = function() {
	return {
    	username: this.username || ''
  	};
};

pageSchema.methods.serialize = function() {
	return {
		id: this._id,
		title: this.title,
		summary: this.summary,
		searchQueries: this.searchQueries,
		sections: this.sections
	}
}




userSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
};


const User = mongoose.model('User', userSchema);
const Page = mongoose.model('Page', pageSchema);


module.exports = {User, Page};