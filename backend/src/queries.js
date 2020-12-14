const uuid = require("uuid");
const db = require("../db");
const Helper = require("./Helper");
const createAdmin = async (req, res) => {
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
  console.log(req);
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
        .send({ message: "The credentials you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].email);
    return res.status(200).send({ message: "Auth.verified", token: token });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const createEmployee = async (req, res) => {
  const query = `INSERT INTO Employee(
    paid_leave_taken,
    encashed_leave_this_month,
    encashed_leave_till_date,
    e_id,
    doj,
    name,
    dob,
    age,
    years_of_service,
    address,
    city,
    state,
    pincode,
    email,
    password,
    org_name,
    dept_id,
    grade_id)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) 
    returning *`;
  const hashPassword = Helper.hashPassword(req.body.password);
  const values = [
    req.body.paid_leave_taken,
    req.body.encashed_leave_this_month,
    req.body.encashed_leave_till_date,
    uuid.v4(),
    req.body.doj,
    req.body.name,
    req.body.dob,
    req.body.age,
    req.body.years_of_service,
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.pincode,
    req.body.email,
    hashPassword,
    req.body.org_name,
    req.body.dept_id,
    req.body.grade_id,
  ];
  try {
    const { rows } = await db.query(query, values);
    // const token = Helper.generateToken(rows[0].e_id);
    // console.log("This is token ",token)
    console.log(rows);
    return res.status(201).send({ message: "User.Added" });
  } catch (err) {
    if (err.routine === "_bt_check_unique") {
      return res
        .status(400)
        .send({ message: "Email address is already taken" });
    }
    return res.status(400).send({ error: err });
  }
};
const deleteEmployee = async (req, res) => {
  const query = `DELETE FROM Employee WHERE e_id = $1`;
  try {
    const { rows } = await db.query(query, [req.body.e_id]);
    return res.status(200).send({ message: "User.Deleted" });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
const getAllEmployees = async (req, res) => {
  const query = `SELECT * from employee`;
  try {
    const { rows } = await db.query(query);
    // console.log(rows);
    return res.status(200).send({ message: "All Employees", data: rows });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
const employeeLogin = async (req, res) => {
  console.log(req);
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
  const query = "SELECT * FROM employee where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    console.log(rows);
    if (!rows[0]) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    if (!Helper.comparePassword(rows[0].password, req.body.password)) {
      return res
        .status(400)
        .send({ message: "The credentials you provided is incorrect" });
    }
    const token = Helper.generateToken(rows[0].email);
    return res.status(200).send({ message: "Auth.verified", token: token });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const getEmployeeProfile = async (req, res) => {
  console.log(req);
  const query = "SELECT * FROM employee where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    console.log(rows);
    return res.status(200).send({ message: "Employee Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const generateReports = async (req, res) => {
  console.log(req);
  const query = "SELECT * FROM employee natural join payroll where email = $1";
  try {
    const { rows } = await db.query(query, [req.body.email]);
    console.log(rows);
    return res.status(200).send({ message: "Report Data", data: rows });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
};
const updateEmployeedata = async (req, res) => {
  const queryGet = "SELECT * FROM employee where email=$1";
  const { data } = await db.query(queryGet, [req.body.email]);
  const updateQuery = `UPDATE employee set 
  paid_leave_taken=?,
  encashed_leave_this_month=?,
  encashed_leave_till_date=?,
  e_id=?,
  doj=?,
  name=?,
  dob=?,
  age=?,
  years_of_service=?,
  address=?,
  city=?,
  state=?,
  pincode=?,
  email=?,
  org_name=?,
  dept_id=?,
  grade_id=?`;
  const values = [
    (paid_leave_taken =
      req.body.paid_leave_taken !== undefined
        ? req.body.paid_leave_taken
        : data.paid_leave_taken),
    (encashed_leave_this_month =
      req.body.encashed_leave_this_month !== undefined
        ? req.body.encashed_leave_this_month
        : data.encashed_leave_this_month),
    (encashed_leave_till_date =
      req.body.encashed_leave_till_date !== undefined
        ? req.body.encashed_leave_till_date
        : data.encashed_leave_till_date),
    (e_id == req.body.e_id) !== undefined ? req.body.e_id : data.e_id,
    (doj = req.body.doj !== undefined ? req.body.doj : data.doj),
    (name = req.body.name !== undefined ? req.body.name : data.name),
    (dob = req.body.dob !== undefined ? req.body.doj : data.doj),
    (age = req.body.age !== undefined ? req.body.age : data.age),
    (years_of_service =
      req.body.years_of_service !== undefined
        ? req.body.years_of_service
        : data.years_of_service),
    (address =
      req.body.address !== undefined ? req.body.address : data.address),
    (city = req.body.city !== undefined ? req.body.city : data.city),
    (state = req.body.state !== undefined ? req.body.state : data.state),
    (pincode =
      req.body.pincode !== undefined ? req.body.pincode : data.pincode),
    (email = req.body.email !== undefined ? req.body.email : data.email),
    (org_name =
      req.body.org_name !== undefined ? req.body.org_name : data.org_name),
    (dept_id =
      req.body.dept_id !== undefined ? req.body.dept_id : data.dept_id),
    (grade_id == req.body.grade_id) !== undefined
      ? req.body.grade_id
      : data.grade_id,
  ];
};
module.exports = {
  createAdmin,
  adminLogin,
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  employeeLogin,
  getEmployeeProfile,
  generateReports,
  updateEmployeedata
};
