# OpenAPI best practices

include :
- ./yaml.md

- Ensure that arrays have a maximum number of items, if no value specified use maxItems: 100
- All API paths must be prefixed by the major version of the api : ex `/v1/myapi`
- New APIs must be added to : `src/main/resources/openapi/api-v1.0.yaml`
- All paths must be defined in a same file in `src/main/resources/openapi/paths/`
- All objects handled by the API must be defined in a same file `src/main/resources/openapi/schemas/`
- All paths and components rely on the global secutity specification in `src/main/resources/openapi/api-v1.0.yaml`
