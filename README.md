
# Devapt

Current version: 1.0.0 beta (do not use in production environment)

For instance, the source code is available on the [develop branch](https://github.com/lucbories/devapt/tree/develop).


## What is it?

The Developpers Application Toolkit is a usefull package for developers:
create quickly and securely a complex distributed set of applications or a simple alone application. 

This project is based on Javascript (ECMAscript 6 transpiled in ES5) and nodejs.
Devapt contains a server runtime and a set of client features.
Devapt help you to write less code and to use easily more features.

The principle is simple: you write some configuration files for distributed nodes, models, views and menus and the you start the application.
The framework will automatically generates the RESTfull server.
Simply launch index.html and your application is up a rich user interface and many features.


## USAGE

See [GETTING_STARTED](https://github.com/lucbories/Devapt/tree/develop/docs/GETTING_STARTED.md)

Devapt library offers a "runtime" instance which delivers this features:
* main rendering wrapper (Render instance)
* rendering base class (Component class)
* Redux store wrapper
* configuration settings wrapper
* main logging wrapper


## LICENCE

See [LICENSE](https://github.com/lucbories/Devapt/tree/develop/LICENSE)


## BUGS

See [LICENSE](https://github.com/lucbories/Devapt/issues) TO CHECK


## Technical details

With Devapt you define 
* A topology, simple (one application, one server, one service) or complex (many services distributed for many applications on many distributed servers).
* Some resources (models, views, menubars, menus)
* Security rules

A topology contains:
* nodes: A node is a nodejs process with a unique name. You can have many nodes on the same machine.
Each node communicates with other node through a couple (host, port).
A node can have one or many servers.
* servers: A server provides one or more services and listen client connections through a couple (host, port).
A server has a unique name and can be one of types: restify, express, socket.io, message bus...
* services: A service offer one feature to clients. A service can be one of: static assets providers, middleware provider, model RESTfull access...
* applications: An application contains some services and is provided through nodes and servers.
An application can have one service on one server on one node.
Or many services on many servers on many nodes.
* modules: functional features for applications (a set of preconfigured UI for example).
* plugins: technical fearures for applications (a rendering provider for example).
* security: defines authentication and authorization rules.

The rendering engines are plugins and rendering classes are stateless: state is stored in a Redux store.
See []() for flow concepts.


## Devapt is a glue for many usefull projects
Thanks for all projects leaders and contributers.
The given list is an extract of all used or inspired projects.

Main features:
* Restify: http://restify.com/
* Epilogue: https://github.com/dchester/epilogue
* Sequelize: http://sequelizejs.com
* Passport: http://passportjs.org
* Express
* SimpleBus
* Socket.io
* jQuery: https://jquery.com
* Mustache: https://github.com/janl/mustache.js
* Immutable
* Redux
* React
* Mysql
* Moment
* Vantage
* Bunyan
* Winston

Dev and build features:
* Babel:
* Chai:
* Gulp
* Mocha



Installation
------------

Please see the file called INSTALL.md.


Contacts
--------

To subscribe to news or report a bug or contribute to the project, use the project website at https://github.com/lucbories/DevApt.
