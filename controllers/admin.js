const db = require("../databaseConfig");
const bcrypt = require("bcrypt-nodejs");
const JWT = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { JWT_SECRET } = require("../configs");
const encodedToken = (id) => {
  return JWT.sign(
    {
      iss: "Nguyen Cong",
      sub: id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 10),
    },
    JWT_SECRET,
  );
};

const postJob = (req, res) => {
  const {
    jobtitle,
    salary,
    worksplace,
    jobdesrciption,
    amount,
    languageskill,
    techskill,
    worktime,
    position,
    token,
  } = req.body;
  const id = jwt_decode(token).sub;
  db("job")
    .insert({
      companyid: id,
      jobtitle: jobtitle,
      salary: salary,
      worksplace: worksplace,
      jobdesrciption: jobdesrciption,
      amount: amount,
      worktime: worktime,
    })
    .returning("*")
    .then((job) => {
      languageskill.forEach((l) => {
        db("languageskill")
          .returning("*")
          .insert({
            name: l,
          })
          .then(async (ls) => {
            await db("joblanguageskill").insert({
              jobid: job[0].id,
              languageid: ls[0].id,
            });
          });
      });

      techskill.forEach((t) => {
        db("techskill")
          .returning("*")
          .insert({
            name: t,
          })
          .then(async (ts) => {
            await db("jobtechskill").insert({
              jobid: job[0].id,
              techskillid: ts[0].id,
            });
          });
      });

      position.forEach((p) => {
        db("position")
          .returning("*")
          .insert({
            name: p,
          })
          .then(async (jp) => {
            await db("jobposition").insert({
              jobid: job[0].id,
              positionid: jp[0].id,
            });
          });
      });

      return res.status(200).json({
        companyid: job[0].companyid,
        jobtitle: job[0].jobtitle,
        salary: job[0].salary,
        worksplace: job[0].worksplace,
        jobdesrciption: job[0].jobdesrciption,
        amount: job[0].amount,
        imageurl: job[0].imageURL,
      });
    })
    .catch((err) => console.log(err));
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "password", "id")
    .from("account")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
        res.setHeader("Authorization", encodedToken(data[0].id).toString());
        return res.status(200).json({
          success: true,
          Authorization: encodedToken(data[0].id),
          email: data[0].email,
        });
      } else {
        res.status(400).json("wrong credentials");
      }
    })
    .catch((err) => {
      res.status(400).json("wrong credentials");
    });
};

const updateCompanyProfile = async (req, res, next) => {
  const {
    address,
    description,
    field,
    logo,
    memberquantity,
    name,
    slogan,
    timeot,
    worktimeend,
    worktimestart,
    token,
  } = req.body;
  console.log(req.body);
  const id = jwt_decode(token).sub;
  let companyProfile1 = await db("companycv")
    .insert({
      id: id,
      address: address,
      description: description,
      field: field,
      logo: logo,
      memberquantity: memberquantity,
      name: name,
      slogan: slogan,
      timeot: timeot,
      worktimeend: worktimeend,
      worktimestart: worktimestart,
    })
    .returning("*");
  return res.status(200).json({
    id: companyProfile1[0].id,
    address: companyProfile1[0].address,
    description: companyProfile1[0].description,
    field: companyProfile1[0].field,
    logo: companyProfile1[0].logo,
    memberquantity: companyProfile1[0].memberquantity,
    name: companyProfile1[0].name,
    slogan: companyProfile1[0].slogan,
    timeot: companyProfile1[0].timeot,
    worktimeend: companyProfile1[0].worktimeend,
    worktimestart: companyProfile1[0].worktimestart,
  });
};

const getProfile = async (req, res, next) => {
  const { token } = req.body;
  const id = jwt_decode(token).sub;
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
    memberquantity: companyProfile[0].memberquantity,
    name: companyProfile[0].name,
    slogan: companyProfile[0].slogan,
    timeot: companyProfile[0].timeot,
    worktimeend: companyProfile[0].worktimeend,
    worktimestart: companyProfile[0].worktimestart,
  });
};

const getListJob = async (req, res, next) => {
  const { token } = req.body;
  const id = jwt_decode(token).sub;
  const listJob = [];
  let jobs = await db
    .select("*")
    .from("job")
    .where("companyid", "=", id)
    .then((jobs) => {
      return jobs;
    });
  jobs.forEach(async (j, index) => {
    let jobTechSkill = await (
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

    let techSkills = await (
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

    let jobLanguageSkill = await (
      await db
        .select("languageid")
        .from("joblanguageskill")
        .where("jobid", "=", j.id)
        .then((skillid) => {
          return skillid;
        })
    ).map((j) => {
      return j.languageid;
    });

    let languageSkills = await (
      await db
        .select("name")
        .from("languageskill")
        .where("id", "in", jobLanguageSkill)
        .then((skill) => {
          return skill;
        })
    ).map((s) => {
      return s.name;
    });
    j.techSkills = techSkills;
    j.anguageSkills = languageSkills;
    j.id = j.id;
    listJob[index] = j;
    if (index === jobs.length - 1) {
      return res.status(200).json(listJob);
    }
  });
};

const getJob = async (req, res, next) => {
  const { token, id } = req.body;
  let job = await db
    .select("*")
    .from("job")
    .where("id", "=", id)
    .then((jobs) => {
      return jobs;
    });

  let jobTechSkills = (
    await db
      .select("techskillid")
      .from("jobtechskill")
      .where("jobid", "=", job[0].id)
      .then((skillid) => {
        return skillid;
      })
  ).map((j) => {
    return j.techskillid;
  });

  let techSkills = (
    await db
      .select("name")
      .from("techskill")
      .where("id", "in", jobTechSkills)
      .then((skill) => {
        return skill;
      })
  ).map((t) => {
    return t.name;
  });

  let jobLanguageSkill = (
    await db
      .select("languageid")
      .from("joblanguageskill")
      .where("jobid", "=", job[0].id)
      .then((skillid) => {
        return skillid;
      })
  ).map((j) => {
    return j.languageid;
  });

  let languageSkills = (
    await db
      .select("name")
      .from("languageskill")
      .where("id", "in", jobLanguageSkill)
      .then((skill) => {
        return skill;
      })
  ).map((t) => {
    return t.name;
  });

  let jobPosition = (
    await db
      .select("positionid")
      .from("jobposition")
      .where("jobid", "=", job[0].id)
      .then((positionid) => {
        return positionid;
      })
  ).map((j) => {
    return j.positionid;
  });

  let position = (
    await db
      .select("name")
      .from("position")
      .where("id", "in", jobPosition)
      .then((position) => {
        return position;
      })
  ).map((p) => {
    return p.name;
  });

  job[0]["techSkills"] = techSkills;
  job[0]["languageSkills"] = languageSkills;
  job[0]["position"] = position;
  job[0]["id"] = job.id;
  return res.status(200).json(job[0]);
};

module.exports = {
  postJob,
  signIn,
  updateCompanyProfile,
  getProfile,
  getListJob,
  getJob,
};
