const { exec } = require('child_process');
const sequelize = require('../config/connection');
const Location = require('../models/Location');
require('dotenv').config();

const locationData = [
  {
    city: 'Lehi',
    state: 'UT',
    latitude: '40.391617',
    longitude: '-111.850766'
  },
  {
    city: 'Salt Lake City',
    state: 'UT',
    latitude: '40.758701',
    longitude: '-111.876183'
  },
  {
    city: 'Provo',
    state: 'UT',
    latitude: '40.233844',
    longitude: '-111.658534'
  },
];

const seedLocations = async () => {
  try {
    exec(`mysql -u root -p${process.env.DB_PASSWORD} < db/schema.sql`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing schema: ${error.message}`);
        process.exit(1);
      }
      console.log('Schema executed successfully');

      sequelize.sync({ force: true })
        .then(() => {
          return Location.bulkCreate(locationData, { validate: true });
        })
        .then(() => {
          console.log('Locations seeded successfully!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('Failed to seed locations:', error);
          process.exit(1);
        });
    });
  } catch (error) {
    console.error('Failed to execute schema:', error);
    process.exit(1);
  }
};

seedLocations();
