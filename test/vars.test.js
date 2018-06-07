let vars = {
  testUserId: "",
  testUser: {
    username: "John",
    password: "pass",
    email: "john@smith.com"
  },
  testData: [
    {
      name: "WishList 1",
      categories: [
        {
          name: "Category 1:1",
          sort: 0,
          items: [
            {
              name: "Item 1:1:1",
              quantity: "1:1:1",
              checked: false,
              important: false
            },
            {
              name: "Item 1:1:2",
              quantity: "1:1:2",
              checked: false,
              important: false
            }
          ]
        },
        {
          name: "Category 1:2",
          sort: 1,
          items: [
            {
              name: "Item 1:2:1",
              quantity: "1:2:1",
              checked: false,
              important: false
            },
            {
              name: "Item 1:2:2",
              quantity: "1:2:2",
              checked: false,
              important: false
            }
          ]
        }
      ]
    },
    {
      name: "WishList 2",
      categories: [
        {
          name: "Category 2:1",
          sort: 0,
          items: [
            {
              name: "Item 2:1:1",
              quantity: "2:1:1",
              checked: false,
              important: false
            },
            {
              name: "Item 2:1:2",
              quantity: "2:1:2",
              checked: false,
              important: false
            }
          ]
        },
        {
          name: "Category 2:2",
          sort: 1,
          items: [
            {
              name: "Item 2:2:1",
              quantity: "2:2:1",
              checked: false,
              important: false
            },
            {
              name: "Item 2:2:2",
              quantity: "2:2:2",
              checked: false,
              important: false
            }
          ]
        }
      ]
    }
  ],
  cookie: "",
  sid: () => {
    if (!vars.cookie) return "";

    let mm = /connect.sid=s%3A([^\.]+)\./g.exec(vars.cookie);
    if (mm.length == 0) return "";

    return mm[1];
  }
};

module.exports = vars;
