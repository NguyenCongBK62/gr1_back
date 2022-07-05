const db = require("../databaseConfig");
const bcrypt = require("bcrypt-nodejs");
const JWT = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const { JWT_SECRET } = require("../configs");
const pool = require("../configs/databaseConnect");
const helper = require("../helper/helper");
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

const postJob = async (req, res) => {
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
  if (req.body.id) {
    await pool
      .query(
        "update job set jobtitle = $1, salary = $2, worksplace = $3, jobdesrciption = $4, amount = $5, worktime = $6 where id = $7",
        [
          jobtitle,
          salary,
          worksplace,
          jobdesrciption,
          amount,
          worktime,
          req.body.id,
        ],
      )
      .then((results) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });

    let oldTechSkillId = (
      await pool
        .query(
          "delete from jobtechskill where jobid = $1 returning techskillid",
          [req.body.id],
        )
        .then((results) => {
          return results.rows;
        })
        .catch((err) => {
          console.log(err);
        })
    ).map((i) => {
      return i.techskillid;
    });

    await pool
      .query(
        `delete from techskill where id in (${helper.getParamsQuerry(
          oldTechSkillId,
        )})`,
        oldTechSkillId,
      )
      .then((results) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });

    let oldLanguageSkillId = (
      await pool
        .query(
          "delete from joblanguageskill where jobid = $1 returning LanguageID",
          [req.body.id],
        )
        .then((results) => {
          return results.rows;
        })
        .catch((err) => {
          console.log(err);
        })
    ).map((i) => {
      return i.languageid;
    });

    await pool
      .query(
        `delete from languageskill where id in (${helper.getParamsQuerry(
          oldLanguageSkillId,
        )})`,
        oldLanguageSkillId,
      )
      .then((results) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });

    let oldPositionId = (
      await pool
        .query(
          "delete from jobposition where jobid = $1 returning PositionID",
          [req.body.id],
        )
        .then((results) => {
          return results.rows;
        })
        .catch((err) => {
          console.log(err);
        })
    ).map((i) => {
      return i.positionid;
    });

    await pool
      .query(
        `delete from position where id in (${helper.getParamsQuerry(
          oldPositionId,
        )})`,
        oldPositionId,
      )
      .then((results) => {
        return;
      })
      .catch((err) => {
        console.log(err);
      });

    position.forEach(async (p) => {
      await pool
        .query("insert into Position(name) values ($1) returning id", [p])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobPosition(jobid, positionid) values ($1, $2)",
              [req.body.id, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    techskill.forEach(async (t) => {
      await pool
        .query("insert into TechSkill(name) values ($1) returning id", [t])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobTechSkill(jobid, TechSkillID) values ($1, $2)",
              [req.body.id, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    languageskill.forEach(async (l) => {
      await pool
        .query("insert into LanguageSkill(name) values ($1) returning id", [l])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobLanguageSkill(jobid, LanguageID) values ($1, $2)",
              [req.body.id, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  } else {
    let newJobId = await pool
      .query(
        "insert into Job(CompanyID, JobTitle, Salary, Worksplace, JobDesrciption, Amount, worktime) values ($1, $2, $3, $4, $5, $6, $7) returning id",
        [id, jobtitle, salary, worksplace, jobdesrciption, amount, worktime],
      )
      .then((results) => {
        return results.rows[0].id;
      })
      .catch((err) => {
        console.log(err);
      });

    position.forEach(async (p) => {
      await pool
        .query("insert into Position(name) values ($1) returning id", [p])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobPosition(jobid, positionid) values ($1, $2)",
              [newJobId, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    techskill.forEach(async (t) => {
      await pool
        .query("insert into TechSkill(name) values ($1) returning id", [t])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobTechSkill(jobid, TechSkillID) values ($1, $2)",
              [newJobId, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
    languageskill.forEach(async (l) => {
      await pool
        .query("insert into LanguageSkill(name) values ($1) returning id", [l])
        .then(async (results) => {
          await pool
            .query(
              "insert into JobLanguageSkill(jobid, LanguageID) values ($1, $2)",
              [newJobId, results.rows[0].id],
            )
            .then((results) => {
              return;
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  return res.status(200).json({ status: true });
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
  const id = jwt_decode(token).sub;
  console.log(44444, id);
  let companyProfile = [];
  let oldProfile = await pool
    .query("select * from companycv where id = $1", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
  if (oldProfile.length > 0) {
    companyProfile = await pool
      .query(
        "update companycv set name = $1, address = $2, field = $3, description = $4, memberquantity = $5, worktimestart = $6, worktimeend = $7, slogan = $8, logo = $9, timeot = $10 where id = $11",
        [
          name,
          address,
          field,
          description,
          memberquantity,
          worktimestart,
          worktimeend,
          slogan,
          logo,
          timeot,
          id,
        ],
      )
      .then((data) => {
        return data.rows;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    companyProfile = await pool
      .query(
        "insert into companycv (id, name, address, field, description, memberquantity, worktimestart, worktimeend, slogan, logo, timeot) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
        [
          id,
          name,
          address,
          field,
          description,
          memberquantity,
          worktimestart,
          worktimeend,
          slogan,
          logo,
          timeot,
        ],
      )
      .then((data) => {
        return data.rows;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return res.status(200).json(companyProfile[0]);
};

const getProfile = async (req, res, next) => {
  const { token } = req.body;
  const id = jwt_decode(token).sub;
  let companyProfile = await pool
    .query("select * from companycv where id = $1", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
  return res.status(200).json(companyProfile[0]);
};

const getListJob = async (req, res, next) => {
  const { token } = req.body;
  const id = jwt_decode(token).sub;
  let jobs = await pool
    .query("select * from job where companyid = $1", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });

  jobs = await Promise.all(
    jobs.map(async (job) => {
      let jobTechSkill = await pool
        .query(
          "select name from techskill where id in (select techskillid from job, jobtechskill where job.id = jobtechskill.jobid and job.id = $1 )",
          [job.id],
        )
        .then((data) => {
          return data.rows;
        })
        .catch((err) => {
          console.log(err);
        });
      let jobLanguageSkill = await pool
        .query(
          "select name from languageskill where id in (select languageid from job, joblanguageskill where job.id = joblanguageskill.jobid and job.id = $1 )",
          [job.id],
        )
        .then((data) => {
          return data.rows;
        })
        .catch((err) => {
          console.log(err);
        });

      job.techSkills = jobTechSkill.map((j) => {
        return j.name;
      });
      job.languageSkills = jobLanguageSkill.map((j) => {
        return j.name;
      });
      return job;
    }),
  );
  return res.status(200).json(jobs);
};

const getJob = async (req, res, next) => {
  const { id } = req.body;
  let job = await pool
    .query("select * from job where id = $1", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });

  let jobTechSkill = await pool
    .query(
      "select name from techskill where id in (select techskillid from job, jobtechskill where job.id = jobtechskill.jobid and job.id = $1 )",
      [job[0].id],
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });

  let jobLanguageSkill = await pool
    .query(
      "select name from languageskill where id in (select languageid from job, joblanguageskill where job.id = joblanguageskill.jobid and job.id = $1 )",
      [job[0].id],
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });

  let jobPositon = await pool
    .query(
      "select name from position where id in (select positionid from job, jobposition where job.id = jobposition.jobid and job.id = $1 )",
      [job[0].id],
    )
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err);
    });
  let techSkills = jobTechSkill.map((techSkill) => techSkill.name);
  let languageSkills = jobLanguageSkill.map(
    (languageSkill) => languageSkill.name,
  );
  let position = jobPositon.map((position) => position.name);

  job[0].techSkills = techSkills;
  job[0].languageSkills = languageSkills;
  job[0].position = position;
  job[0].id = job.id;
  return res.status(200).json(job[0]);
};

const deleteJob = async (req, res, next) => {
  const { id } = req.body;
  let oldTechSkillId = (
    await pool
      .query(
        "delete from jobtechskill where jobid = $1 returning techskillid",
        [id],
      )
      .then((results) => {
        return results.rows;
      })
      .catch((err) => {
        console.log(err);
      })
  ).map((i) => {
    return i.techskillid;
  });

  await pool
    .query(
      `delete from techskill where id in (${helper.getParamsQuerry(
        oldTechSkillId,
      )})`,
      oldTechSkillId,
    )
    .then((results) => {
      return;
    })
    .catch((err) => {
      console.log(err);
    });

  let oldLanguageSkillId = (
    await pool
      .query(
        "delete from joblanguageskill where jobid = $1 returning LanguageID",
        [id],
      )
      .then((results) => {
        return results.rows;
      })
      .catch((err) => {
        console.log(err);
      })
  ).map((i) => {
    return i.languageid;
  });

  await pool
    .query(
      `delete from languageskill where id in (${helper.getParamsQuerry(
        oldLanguageSkillId,
      )})`,
      oldLanguageSkillId,
    )
    .then((results) => {
      return;
    })
    .catch((err) => {
      console.log(err);
    });

  let oldPositionId = (
    await pool
      .query("delete from jobposition where jobid = $1 returning PositionID", [
        id,
      ])
      .then((results) => {
        return results.rows;
      })
      .catch((err) => {
        console.log(err);
      })
  ).map((i) => {
    return i.positionid;
  });

  await pool
    .query(
      `delete from position where id in (${helper.getParamsQuerry(
        oldPositionId,
      )})`,
      oldPositionId,
    )
    .then((results) => {
      return;
    })
    .catch((err) => {
      console.log(err);
    });

  await pool
    .query(`delete from job where id = $1`, [id])
    .then((results) => {
      return;
    })
    .catch((err) => {
      console.log(err);
    });
  getListJob(req, res, next);
};

const getListCV = async (req, res, next) => {
  const { id } = req.body;
  const listCV = await pool
    .query(
      `select * from CandidateCV where id in (slect jobID from JobCandidateCV where jobid = $1)`,
      [id],
    )
    .then((results) => {
      return results.rows;
    })
    .catch((err) => {
      console.log(err);
    });
  return res.status(200).json(listCV);
};

module.exports = {
  postJob,
  signIn,
  updateCompanyProfile,
  getProfile,
  getListJob,
  getJob,
  deleteJob,
  getListCV,
};
