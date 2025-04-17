const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 
// define the Schema (the structure of the User)
const UserSchema = new Schema({
  FirstName: String,
  LastName: String,
  Email: String,
  Age: Number,
  Country: String,
  Gender: String,
  Telephone: Number,
 
 
});
 
 
// Create a model based on that schema
const User = mongoose.model("User", UserSchema);
 
 
// export the model
module.exports = User;