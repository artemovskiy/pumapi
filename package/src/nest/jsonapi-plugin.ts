import * as swaggerUi from 'swagger-ui-express';
import { INestApplication } from '@nestjs/common';
import { AppScanner } from '../scanner/app-scanner';
// @ts-ignore
import * as YAML from 'json-to-pretty-yaml';

export class JsonapiPlugin {
  static scan(app: INestApplication) {
    const appScanner = new AppScanner(app);
    return appScanner.scan().toJSON();
  }

  static setup(app: INestApplication, document: any) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(document));
    app.use('/api-docs-yaml', (req, res) => {
      res.type('text/yaml');
      res.send(YAML.stringify(document));
    });
  }

  static init(app: INestApplication) {
    const document = JsonapiPlugin.scan(app);
    JsonapiPlugin.setup(app, document);
  }
}
