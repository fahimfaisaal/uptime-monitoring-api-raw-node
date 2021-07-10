/**
* Title: Environment
* Description: Configure the environment variables
* Author: @fahimfaisaal
*/

// module scaffolding
const environment = {};

// development modes
environment.development = {
    mode: 'development',
    port: 3000
};

environment.production = {
    mode: 'production',
    port: 5000
}

// chose the environment mode by environment variables
const environmentVariable = process.env.NODE_ENV;
const chosenEnvironment = typeof (environmentVariable) === 'string'
    ? environment[environmentVariable]
    : environment.development;

module.exports = chosenEnvironment;