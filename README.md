# cp-zen-frontend
Frontend code for the CoderDojo Community Platform (Zen)

# Running e2e tests

## cypress tests
We've begun moving e2e tests to [Cypress](https://www.cypress.io/) in order to improve reliability.

### Running with UI
To run Cypress tests with the Cypress UI (good for debugging issues), you will first need to run the front end by running `yarn start`, then simply run
```
yarn cypress:open
```

This will open a window where you can select what spec to run.

### Headless
You can also run the Cypress tests headless through Docker. You'll first need to install Cypress within the Docker container by running
```
docker-compose run --rm cypress yarn cypress:install
```

Once done, the installed Cypress is kept in a volume so it will persist between runs. If running the tests ever gives out about Cypress not being installed, just run this command again.

To run the tests
```
docker-compose run --rm cypress
```

## wdio tests
The selenium-based wdio tests will run along with the unit tests when you run
```
docker-compose run --rm test
```
