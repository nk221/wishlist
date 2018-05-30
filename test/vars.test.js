let vars = {
  testUserId: "",
  testUser: {
    username: "John",
    password: "pass",
    email: "john@smith.com"
  },
  cookie: "",
  sid: () => {
    if (!vars.cookie) return "";

    let mm = /connect.sid=s%3A([^\.]+)\./g.exec(vars.cookie);
    if (mm.length == 0) return "";

    return mm[1];
  }
};

module.exports = vars;
