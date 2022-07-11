import * as swaggerUi from 'swagger-ui-express';
import { INestApplication } from '@nestjs/common';
import * as YAML from 'json-to-pretty-yaml';
import { OpenAPIV3 } from 'openapi-types';
import { AppScanner } from '../scanner';
// @ts-ignore

export class JsonapiPlugin {
  static scan(app: INestApplication): Pick<OpenAPIV3.Document, 'openapi' | 'paths' | 'components'> {
    const appScanner = new AppScanner(app);
    return appScanner.scan().toJSON();
  }

  static setup(app: INestApplication, document: OpenAPIV3.Document) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
    app.use('/api-docs-yaml', (req, res) => {
      res.type('text/yaml');
      res.send(YAML.stringify(document));
    });
  }
}
