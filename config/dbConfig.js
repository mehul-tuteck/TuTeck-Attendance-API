module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "root",
  DB: "attendance",

  dialect: "mariadb",
  define: {
    timestamps: false,
  },
  timestamps: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
