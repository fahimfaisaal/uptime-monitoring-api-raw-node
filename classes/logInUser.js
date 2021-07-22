const { hash } = require('../lib/util')

class User {
    constructor(phone, pass) {
        this.isLoggedIn = false;
        this.phone = phone;
        this.password = hash(pass);
    }
}

module.exports = User