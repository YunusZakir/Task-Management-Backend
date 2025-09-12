"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOnly = void 0;
const common_1 = require("@nestjs/common");
const AdminOnly = () => (0, common_1.SetMetadata)('requireAdmin', true);
exports.AdminOnly = AdminOnly;
//# sourceMappingURL=roles.decorator.js.map