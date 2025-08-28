"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceToSearchResultConvertor = void 0;
const serviceToSearchResultConvertor = (services) => {
    return services.map((service) => ({
        name: `${service.name} | ${service.sub_category.name} | ${service.sub_category.category_id.name}`,
        id: service._id,
        category: "service",
    }));
};
exports.serviceToSearchResultConvertor = serviceToSearchResultConvertor;
