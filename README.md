# JS-RCON Frontend

This repository hosts the code for the client-side component of JS-RCON.

## What is JS-RCON?

JS-RCON is a powerful Source Dedicated Server administration GUI built with JavaScript. At the moment the project only supports Team Fortress 2, but more games are planned to be added later.

## Installation

This repository should not be cloned for production use, as it is bundled with the distribution edition of JS-RCON. Instead, this repository should only be used for development purposes.

The installation procedure is fairly simple. Clone this repo with `git clone https://github.com/js-rcon/js-rcon-frontend`, install the dependencies with **npm i**. After [configuring](#configuration), start the development server with **npm start**. Then browse to `http://localhost:8000` to see your changes in real time.

## Configuration

There is an example configuration file in the **src** folder called [config.example.js](src/config.example.js). Clone it to a file named **config.js** and edit the values as you desire.

**Value reference**

| Value | Description | Type |
| ----- | ----------- | ---- |
| apiUrl | The URL from where the development version of the backend service is running. In development, both instances must be run from different addresses, but the backend already accounts for this. | String |
| defaultSettings | The default settings to use when the end user accesses the frontend for the first time. These settings should be mirrored in settingsTypes. | Object |
| settingsTypes | The types accepted for different settings. This is done to prevent tampering with the settings as they have to be exposed to the end user. |
| enableDevToolsWarning | Show the warning when DevTools is opened even when in development mode (Always shown in production). | Boolean |

## Technologies used

The major dependencies of this project are listed here. For full dependency information, see [package.json](package.json).

* Framework: [React.js](https://reactjs.org)
* Design: [Material-UI](https://material-ui.com) and the [Bulma CSS framework](https://bulma.io)

## License

JS-RCON is licensed under the [GNU Affero General Public License](LICENSE).<br>
JS-RCON © 2018 [Curtis Fowler](https://github.com/caf203) and [Linus Willner](https://github.com/linuswillner).
