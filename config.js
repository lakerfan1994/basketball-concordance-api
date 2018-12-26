exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000/";
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-bbapp-data';
exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/bbapp-data";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || "lakerstoogood" ;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';