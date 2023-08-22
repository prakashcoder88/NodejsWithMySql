const jwt = require("jsonwebtoken");
// const connection = require("../../config/Db.config");
const { key_Token,adminkey_Token, option} = process.env;




const options = {
    expiresIn: "24h",
  };
  
  async function generateJwt(id) {
    try {
      const payload = {id};
      const token = await jwt.sign(payload, key_Token, options);
      return { error: false, token };
    } catch (error) {
      return { error: true };
    }
  }


  async function admingenerateJwt(id){
    try {
      const payload = {id};
      const token = await jwt.sign(payload, adminkey_Token,  options);
      return { error: false, token };
    } catch (error) {
      return { error: true };
    }
  }
  
  module.exports =  {generateJwt,admingenerateJwt};


