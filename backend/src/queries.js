const uuid = require("uuid");
const db = require("../db");
const Helper = require("./Helper");
const create = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter all required fields" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  // console.log(req)
  const hashPassword = Helper.hashPassword(req.body.password);
  const createQuery = `INSERT INTO admin(admin_id,username,email,password) VALUES($1,$2,$3,$4) returning *`;
  const values = [uuid.v4(), req.body.username, req.body.email, hashPassword];
  try {
    const { rows } = await db.query(createQuery, values);
    const token = Helper.generateToken(rows[0].email);
    // console.log("This is token ",token)
    return res.status(201).send({ message: "Account.Create", token: token });
  } catch (err) {
    if (err.routine === "_bt_check_unique") {
      return res
        .status(400)
        .send({ message: "Email address is already taken" });
    }
    return res.status(400).send(err);
  }
};
const adminLogin = async (req, res) => {
  console.log(req)
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  if (!Helper.isValidEmail(req.body.email)) {
    return res
      .status(400)
      .send({ message: "Please enter a valid email address" });
  }
  const query = "SELECT * FROM admin where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ error: "The credentials you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ error: "The credentials you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].email);
    return res.status(200).send({ message:"Auth.verified",token:token });
  }catch(error){
    return res.status(400).send(error);
  }
};

module.exports = { create,adminLogin };
