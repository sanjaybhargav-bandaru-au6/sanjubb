import Sequelize from "sequelize";
const {POSTGRES_URI, POSTGRES_PASSWORD } = process.env;


const sequelize = new Sequelize(POSTGRES_URI.replace('<password>',POSTGRES_PASSWORD));

 sequelize.sync({alter:true});
// sequelize.sync();

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

export default sequelize