let config = {};
config.mongo = {
  url2:
    "mongodb://db_user:gfhjkm@cluster0-shard-00-00-cvkez.mongodb.net:27017,cluster0-shard-00-01-cvkez.mongodb.net:27017,cluster0-shard-00-02-cvkez.mongodb.net:27017/wishlist?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin",
  url: "mongodb://localhost:27017/wishlist"
};
config.secret = "session secret";

module.exports = Object.freeze(config);
