const ServiceFactory = require('./src/service/service.factory');

const services = ServiceFactory.createServices();
services.startupService.init();
// TODO: Add new bot commands and functionalities here