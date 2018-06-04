var ldap = require('ldapjs');

var server = ldap.createServer();

function authorize(req, res, next) {
    if (!req.connection.ldap.bindDN.equals('cn=root'))
        return next(new ldap.InsufficientAccessRightsError());

    return next();
}

server.search('o=example', authorize, function(req, res, next) {

});

server.search('o=example', function (req, res, next) {

    console.log(req);

    var obj = {
        dn: req.dn.toString(),
        attributes: {
            objectclass: ['organization', 'top'],
            o: 'example'
        }
    };

    if (req.filter.matches(obj.attributes))
        res.send(obj);
    else
        res.send(obj);

    res.end();
});

server.listen(10888, '127.0.0.1', function () {
    console.log('LDAP server listening at %s', server.url);
});
