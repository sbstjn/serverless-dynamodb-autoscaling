"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const name_1 = require("./name");
class Resource {
    constructor(options) {
        this.options = options;
        this.dependencies = [];
        this.name = new name_1.default(options);
    }
    setDependencies(list) {
        this.dependencies = list;
        return this;
    }
}
exports.default = Resource;
//# sourceMappingURL=resource.js.map