// ============================================
// SWAGGER API DOCUMENTATION SPECIFICATION
// ============================================
// Builds the OpenAPI document that swagger-ui shows at  http://localhost:5000/docs
// The list of endpoints is in endpoints.js (one line per endpoint).

import swaggerJsdoc from "swagger-jsdoc";
import endpoints from "./endpoints.js";

// Swagger writes path parameters as {id}, Express writes them as :id
const toSwaggerPath = (path) => path.replace(/:(\w+)/g, "{$1}");

// Build the "paths" part from the list
const paths = {};
endpoints.forEach(([method, url, tag, summary, needsToken, body]) => {
    const swaggerPath = toSwaggerPath(url);
    if (!paths[swaggerPath]) paths[swaggerPath] = {};

    const operation = {
        summary,
        tags: [tag],
        // every :param in the URL becomes a path parameter in the page
        parameters: [...url.matchAll(/:(\w+)/g)].map((match) => ({
            name: match[1],
            in: "path",
            required: true,
            schema: { type: "string" }
        })),
        // register and login need no token, everything else does
        security: needsToken ? [{ bearerAuth: [] }] : [],
        responses: {
            200: { description: "OK" },
            201: { description: "Created" },
            400: { description: "Bad request" },
            401: { description: "Not logged in" },
            403: { description: "Access denied" },
            404: { description: "Not found" },
            409: { description: "Conflict (duplicate / already booked)" }
        }
    };

    // an example JSON body for POST and PUT
    if (body) {
        const properties = {};
        Object.entries(body).forEach(([key, value]) => {
            properties[key] = { type: typeof value === "number" ? "integer" : "string", example: value };
        });
        operation.requestBody = {
            required: true,
            content: { "application/json": { schema: { type: "object", properties } } }
        };
    }

    paths[swaggerPath][method] = operation;
});

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Online Therapy Platform API",
        version: "1.0.0",
        description: "Login with POST /api/login, copy the token, click Authorize and paste it."
    },
    components: {
        // describes how authentication works: a JWT sent as "Bearer <token>"
        securitySchemes: {
            bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
        }
    },
    security: [{ bearerAuth: [] }],
    paths
};

// Generate the final swagger spec and export it
const swaggerSpec = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });
export default swaggerSpec;
