const bcrypt = require("bcrypt-nodejs");
const db = require("../databaseConfig");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../configs");
const encodedToken = (id) => {
  return JWT.sign(
    {
      iss: "Nguyen Cong",
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    JWT_SECRET,
  );
};

const authGoogle = async (req, res) => {
  // res.setHeader('Authorization', token);
  return res.status(200).json({
    userName: req.user.username,
    accessToken: encodedToken(req.user.id),
  });
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  await db
    .select("email", "password")
    .from("account")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
        return db
          .select("*")
          .from("account")
          .where("email", "=", email)
          .then((account) => {
            res.setHeader("Authorization", encodedToken(account[0].id));
            return res.status(200).json({ success: true });
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
  res.setHeader("Authorization", encodedToken(req.user.id));
  // return res.status(200).json({ userName: req.user.username, accessToken: encodedToken(req.user.id)});
};

const signUp = async (req, res, next) => {
  const { email, username, password, role } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json("incorrect form submission");
  }

  const foundAccount = await db("account")
    .select("*")
    .where("email", "=", email);

  if (foundAccount[0]) {
    return res.status(403).json("Email da dang ki");
  }

  const hash = bcrypt.hashSync(password);
  db("account")
    .insert({
      username: username,
      password: hash,
      email: email,
      role: role,
    })
    .returning("*")
    .then((account) => {
      return res.status(200).json({
        userName: account[0].username,
        accessToken: encodedToken(account[0].id),
      });
    })
    .catch((err) => res.status(400).json("not submit"));
};

const secret = async (req, res) => {
  return res.status(200).json({
    userName: req.user.username,
    accessToken: encodedToken(req.user.id),
  });
};

const listJob = async (req, res) => {
  const listJob = [];
  let jobs = await db
    .select("*")
    .from("job")
    .then((jobs) => {
      return jobs;
    });
  jobs.forEach(async (j, index) => {
    let jobTechSkill = (
      await db
        .select("techskillid")
        .from("jobtechskill")
        .where("jobid", "=", j.id)
        .then((skillid) => {
          return skillid;
        })
    ).map((j) => {
      return j.techskillid;
    });
    let skills = (
      await db
        .select("name")
        .from("techskill")
        .where("id", "in", jobTechSkill)
        .then((skill) => {
          return skill;
        })
    ).map((s) => {
      return s.name;
    });
    j["skills"] = skills;
    j["id"] = j.id;
    listJob[index] = j;
    if (index === jobs.length - 1) {
      res.status(200).json(listJob);
    }
  });
};

const getProfileCompany = async (req, res, next) => {
  const { id } = req.body;
  let companyProfile = await db
    .select("*")
    .from("companycv")
    .where("id", "=", id);
  return res.status(200).json({
    id: companyProfile[0].id,
    address: companyProfile[0].address,
    description: companyProfile[0].description,
    field: companyProfile[0].field,
    logo: companyProfile[0].logo,
    memberQuantity: companyProfile[0].memberquantity,
    name: companyProfile[0].name,
    slogan: companyProfile[0].slogan,
    timeOT: companyProfile[0].timeot,
    workTimeEnd: companyProfile[0].worktimeend,
    workTimeStart: companyProfile[0].worktimestart,
  });
};

const getListCompany = async (req, res, next) => {
  let listCompany = await db("companycv").select("*");
  return res.status(200).json(listCompany);
};

module.exports = {
  signIn,
  signUp,
  secret,
  authGoogle,
  listJob,
  getProfileCompany,
  getListCompany,
};
