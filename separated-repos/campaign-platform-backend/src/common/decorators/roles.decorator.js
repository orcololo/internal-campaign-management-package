"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.UserRole = void 0;
var common_1 = require("@nestjs/common");
var UserRole;
(function (UserRole) {
    UserRole["CANDIDATO"] = "CANDIDATO";
    UserRole["ESTRATEGISTA"] = "ESTRATEGISTA";
    UserRole["LIDERANCA"] = "LIDERANCA";
    UserRole["ESCRITORIO"] = "ESCRITORIO";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.ROLES_KEY = 'roles';
var Roles = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
};
exports.Roles = Roles;
