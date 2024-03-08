# Map Plotter

This project is a web application that allows users to plot points on a map using city and state information. The application is built with JavaScript, Express, and Sequelize, and uses a MySQL database for storing location data.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd csv-map-plotter
npm install
'''

Update the `example.env` and rename it to `.env`

Run `npm seed` to intialize the database and test with seed data

Run `npm start` and open on `http://localhost:3000`

##Usage
For single location plotting, enter the city and state in the input fields and click the "Plot" button. 
For multiple location plotting, upload a CSV file with the city and state information and click the "Plot" button.
note: This was developed for a personal use case, expecting the headers to be in "city, state" format. This can be edited in the the public/js/index.js file.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details