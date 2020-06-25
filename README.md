# To do list
- **ADD TESTS**
- Clean up form layout
- Clean up form service (allow access to form) -> Properly manage errors on login/register
- Allow search form clearance in room list
- When expanding a row in room list make sure it is visible (when expanding below the bottom limit, scroll down)
- Create room form in room list
- Allow to remove room (only owner and admins)
- Avoid a logged user to log in again
- Session handling
- Admin role
- General clean up

# Eka
This project is meant to be a platform to host simple multiplayer games (although it is used mainly to improve coding skills).

## Initial setup.
After downloading the project, run npm install from the folder (you will need to have Node installed).

## Actions
### Build the project
Run `npm run build:dev` if you want to use the standard configuration or `npm run build:prod` if you want to use the production one.
After the build proccess is done, you can launch the app with `npm run launch`, check the logs to know the URL.
If you want to build and launch in one command, try `npm run build:dev:launch` or `npm run build:prod:launch`.

### Building for development
For developing purposes it is usefull to watch for file changes, in order to do that (and to avoid constant page refreshings when it is not needed) there are different commands for the server and the client.
In order to build the client while watching for changes run `npm run build:client:w`, for the server `npm run build:server:w` and to launch the application `npm run launch:w`. Please bear in mind that the latter command only listens to changes in the server code, because to get the latest changes on the client you just need to refresh the page.

### Other commands
There are other utility commands to test the application `npm run test`, lint the files `npm run lint` or launch the end to end tests `npm run e2e`
Please note that most of the test are NOT done ;)





# **Autogenerated documentation:**
Some (most) of it will be outdated or no longer of use.

# Eka

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
