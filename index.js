const fs = require('fs');
const ldap = require('ldapjs');

const server = ldap.createServer();

(() => {
    function authorize(req, res, next) {
        console.log(req.connection.ldap.bindDN.toString());
        if (req.connection.ldap.bindDN.equals('cn=root'))
            return next(new ldap.InsufficientAccessRightsError());

        return next();
    }

    server.bind('cn=root', (req, res, next) => {
        console.log(req.credentials);
        console.log(req.dn.toString());
        if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret')
            return next(new ldap.InvalidCredentialsError());

        res.end();
        return next();
    });

    server.listen(10389, '127.0.0.1', () => {
        console.log('LDAP server listening at %s', server.url);
    });
})();
