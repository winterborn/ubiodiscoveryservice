var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { config } from "@ubio/framework";
export class CleanupConfig {
}
__decorate([
    config({ default: 30000 }),
    __metadata("design:type", Number)
], CleanupConfig.prototype, "EXPIRATION_AGE", void 0);
__decorate([
    config({ default: 10000 }),
    __metadata("design:type", Number)
], CleanupConfig.prototype, "CLEANUP_INTERVAL", void 0);
//# sourceMappingURL=CleanupConfig.js.map