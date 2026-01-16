import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

const paths = {
  model: 'src/models',
  controller: 'src/controllers',
  service: 'src/services',
  routes: 'src/routes',
  validators: 'src/validators',
  swaggerPath: 'src/config/swagger/paths',
  swaggerDefPath: 'src/config/swagger/definitions',
  tests: 'src/tests',
  unitTests: 'src/tests/unit',
  integrationTests: 'src/tests/integration',
};

const schemaPath = path.join(process.cwd(), 'db/prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

function pluralize(word: string): string {
  // Simple pluralization - you can extend this with more rules if needed
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') || word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es';
  }
  return word + 's';
}

function getTypeValidation(type: string): string {
  switch (type.replace(/[?]/g, '')) {
      case 'String':
          return `.isString().withMessage(i18n.__('validator.MUST_BE_A_STRING'))`;
      case 'Int':
          return `.toInt().isInt().withMessage(i18n.__('validator.MUST_BE_A_VALID_INTEGER'))`;
      case 'Float':
          return `.isFloat().withMessage(i18n.__('validator.MUST_BE_A_VALID_FLOAT'))`;
      case 'Boolean':
          return `.isBoolean().withMessage(i18n.__('validator.MUST_BE_A_BOOLEAN'))`;
      default:
          return '';
  }
}

function extractModelDefinition(modelName: string): { fields: string[]; types: string[]; optionalFields: Set<string> } {
  const modelRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'm');
  const match = schemaContent.match(modelRegex);

  if (!match) throw new Error(`Model ${modelName} not found in schema.prisma`);

  const fieldLines = match[1].trim().split('\n');

  const fields: string[] = [];
  const types: string[] = [];
  const optionalFields: Set<string> = new Set();

  let skipRest = false;

  for (const line of fieldLines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('//')) {
          // If this is the relation marker, skip the rest
          if (trimmedLine.toLowerCase().includes('relation starts')) {
              skipRest = true;
          }
          continue;
      }

      if (skipRest) continue;

      const [field, type, ...rest] = trimmedLine.split(/\s+/);
      if (!field || !type) continue;

      const isOptional = type.endsWith('?') || field === 'id' || field === 'deletedAt';
      const isArray = type.endsWith('[]');
      const baseType = type.replace(/[?\[\]]/g, '');

      fields.push(field);
      types.push(`${baseType}${isArray ? '[]' : ''}`);
      if (isOptional) {
          optionalFields.add(field);
      }
  }

  return { fields, types, optionalFields };
}



function extractValidationRules(modelName: string) {
  const modelRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'm');
  const match = schemaContent.match(modelRegex);

  if (!match) {
      throw new Error(`Model ${modelName} not found in schema.prisma`);
  }

  const fieldLines = match[1].trim().split('\n');
  const validationRules: string[] = [];
  const updateRules: string[] = [];
  let skipRest = false;
  for (const line of fieldLines) {

      const trimmedLine = line.trim();

      // Skip empty lines or comment lines
      if (!trimmedLine || trimmedLine.startsWith('//')) {
        // If this is the relation marker, skip the rest
        if (trimmedLine.toLowerCase().includes('relation starts')) {
            skipRest = true;
        }
        continue;
      }

      if (skipRest) continue;

      const [field, type, ...rest] = line.trim().split(/\s+/);

      if (!field || !type) continue; // Safeguard against malformed lines

      // Skip system fields
      if (['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(field)) {
          continue;
      }

      const isUnique = rest.includes('@unique');
      const isRequired = !rest.includes('?');
      const maxLength = type === 'String' ? 190 : null;
      const typeValidation = getTypeValidation(type);

      // Create rules
      const createRule = [
          `body('${field}')`,
          isRequired ? `.notEmpty().withMessage(i18n.__('validator.${modelName.toUpperCase()}_${field.toUpperCase()}_IS_REQUIRED'))` : `.optional()`,
          typeValidation,
          maxLength ? `.isLength({ max: ${maxLength} }).withMessage(i18n.__('validator.${modelName.toUpperCase()}_${field.toUpperCase()}_MUST_BE_LESS_THAN_${maxLength + 1}_CHARACTERS'))` : '',
          isUnique
              ? `.custom(async (${field}) => {
                  const ${modelName.toLowerCase()} = await prisma.${modelName.toLowerCase()}.findUnique({
                      where: { ${field} },
                  });
                  if (${modelName.toLowerCase()}) {
                      throw new Error(i18n.__('validator.${modelName.toUpperCase()}_${field.toUpperCase()}_MUST_BE_UNIQUE'));
                  }
                  return true;
              })`
              : '',
      ].filter(Boolean);

      validationRules.push(createRule.join('\n'));

      // Update rules
      const updateRule = [
          `body('${field}')`,
          `.optional()`,
          typeValidation,
          maxLength ? `.isLength({ max: ${maxLength} }).withMessage(i18n.__('validator.${modelName.toUpperCase()}_${field.toUpperCase()}_MUST_BE_LESS_THAN_${maxLength + 1}_CHARACTERS'))` : '',
          isUnique
              ? `.custom(async (${field} ,{ req }) => {
                  const { id  } : any = req.params;
                  const ${modelName.toLowerCase()} = await prisma.${modelName.toLowerCase()}.findUnique({
                      where: { ${field} },
                  });
                  if (${modelName.toLowerCase()} && ${modelName.toLowerCase()}.id !== Number(id)) {
                      throw new Error(i18n.__('validator.${modelName.toUpperCase()}_${field.toUpperCase()}_MUST_BE_UNIQUE'));
                  }
                  return true;
              })`
              : '',
      ].filter(Boolean);

      updateRules.push(updateRule.join('\n'));
  }

  return { validationRules, updateRules };
}

function generateModel(modelName: string, fields: string[], types: string[], optionalFields: Set<string>) {
    const fieldsStr = fields
        .map((field, idx) => {
            const tsType = mapPrismaTypeToTS(types[idx]);
            const optional = optionalFields.has(field) ? '?' : '';
            return `${field}${optional}: ${tsType};`;
        })
        .join('\n  ');

    const content = `export interface ${modelName} {
    ${fieldsStr}
}
`;

    const outputPath = path.join('src', 'models', `${modelName}.ts`);
    fs.outputFileSync(outputPath, content);
    console.log(`Model file for ${modelName} created at ${outputPath}`);
}

function mapPrismaTypeToTS(prismaType: string): string {
    const map: Record<string, string> = {
        String: 'string',
        Int: 'number',
        Float: 'number',
        Boolean: 'boolean',
        DateTime: 'Date',
        Decimal: 'number',  // Prisma Decimal is typically mapped to 'number'
        BigInt: 'bigint',   // Prisma BigInt is mapped to 'bigint'
        Json: 'any',        // Json is typically mapped to 'any'
        Bytes: 'Buffer',    // Prisma Bytes is mapped to Node.js Buffer
    };

    const isArray = prismaType.endsWith('[]');
    const isOptional = prismaType.includes('| undefined');
    const baseType = prismaType.replace('[]', '').replace('| undefined', '');

    // Look up the Prisma type in the map, or fallback to the base type if not found.
    const tsType = map[baseType] || baseType;

    return `${tsType}${isArray ? '[]' : ''}${isOptional ? ' | undefined' : ''}`;
}

function generateSwagger(modelName: string): any {
  const { fields, types } = extractModelDefinition(modelName);

  // Define the basic structure for Swagger definitions
  const swaggerDefinition: any = {
      [modelName]: {
          type: 'object',
          required: [],
          properties: {},
      },
  };

  // Loop through the fields and types to build the Swagger definition
  fields.forEach((field, idx) => {
      if (field === 'id' || field === 'createdAt' || field === 'updatedAt' || field === 'deletedAt') {
          return; // Skip these fields for create method
      }

      // Mark fields like 'name' as required
      const isRequired = !types[idx].includes('null') && !types[idx].includes('undefined');

      // Map the field to Swagger definition
      swaggerDefinition[modelName].properties[field] = {
          type: mapPrismaTypeToSwagger(types[idx]),
      };

      if (isRequired) {
          swaggerDefinition[modelName].required.push(field);
      }
  });

  return swaggerDefinition;
}

function mapPrismaTypeToSwagger(prismaType: string): string {
  const map: Record<string, string> = {
      String: 'string',
      Int: 'integer',
      Float: 'number',
      Boolean: 'boolean',
      DateTime: 'string', // Swagger uses string for Date
  };

  const isArray = prismaType.endsWith('[]');
  const baseType = prismaType.replace('[]', '');

  const swaggerType = map[baseType] || 'string'; // Default to string if no mapping found

  return isArray ? `array[${swaggerType}]` : swaggerType;
}

function generateController(modelName: string){

    const templatePath = path.join('src', 'config', 'templates', 'controller.ts');
    let content = fs.readFileSync(templatePath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    content = content.replace(/\${modelName}/g, modelNameLowerCase);
    content = content.replace(/\${ModelName}/g, modelName);
    fs.outputFileSync(path.join(paths.controller, `${modelNameLowerCase}Controller.ts`), content);
    console.log(`Controller file for ${modelName} created at ${paths.controller}/${modelNameLowerCase}Controller.ts`);
}

function generateService(modelName: string){

    const templatePath = path.join('src', 'config', 'templates', 'service.ts');
    let content = fs.readFileSync(templatePath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    content = content.replace(/\${modelName}/g, modelNameLowerCase);
    content = content.replace(/\${ModelName}/g, modelName);
    fs.outputFileSync(path.join(paths.service, `${modelNameLowerCase}Service.ts`), content);
    console.log(`Service file for ${modelName} created at ${paths.service}/${modelNameLowerCase}Service.ts`);
}

function generateRoutes(modelName: string,permission: string){

    const templatePath = path.join('src', 'config', 'templates', 'routes.ts');
    let content = fs.readFileSync(templatePath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    content = content.replace(/\${modelName}/g, modelNameLowerCase);
    content = content.replace(/\${ModelName}/g, modelName);
    content = content.replace(/\${permission}/g, permission);
    fs.outputFileSync(path.join(paths.routes, `${modelNameLowerCase}Routes.ts`), content);
    console.log(`Routes file for ${modelName} created at ${paths.routes}/${modelNameLowerCase}Routes.ts`);
}

function generateValidationFile(modelName: string) {

  const { validationRules, updateRules } = extractValidationRules(modelName);
  const templatePath = path.join('src', 'config', 'templates', 'validator.ts');
  let content = fs.readFileSync(templatePath, 'utf-8');
  const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  content = content.replace(/\${modelName}/g, modelNameLowerCase);
  content = content.replace(/\${ModelName}/g, modelName);
  content = content.replace(/\${createValidation}/g, validationRules.join(',\n        '));
  content = content.replace(/\${updateValidation}/g, updateRules.join(',\n        '));
  fs.outputFileSync(path.join(paths.validators, `${modelNameLowerCase}Validator.ts`), content);
  console.log(`Validator file for ${modelName} created at ${paths.validators}/${modelNameLowerCase}Validator.ts`);

}

function addImportsToInversifyConfig(modelName: string) {

    const inversifyConfigPath = path.join('src', 'config', 'inversifyConfig.ts');
    let content = fs.readFileSync(inversifyConfigPath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);

    const newImports = `  
import { ${modelName}Controller } from '../controllers/${modelNameLowerCase}Controller';
import { ${modelName}Service } from '../services/${modelNameLowerCase}Service';
  
  `;
    const newBinds = `  
container.bind<${modelName}Controller>(${modelName}Controller).toSelf();
container.bind<${modelName}Service>(${modelName}Service).toSelf();
  
  `;

    const importsExist = content.includes(`${modelName}Controller`) && content.includes(`${modelName}Service`);
  
    if (importsExist) {
      console.log(`${modelName}Controller and ${modelName}Service imports are already present.`);
      return;
    }
     
    // Find the position of the line `const container = new Container();`
    const containerLineIndex = content.indexOf('const container = new Container();');
  
    if (containerLineIndex !== -1) {
      // Insert the new imports just above this line and add an empty line above and below the inserted imports
      content = content.slice(0, containerLineIndex) + newImports + content.slice(containerLineIndex);
    }

    // Find the position of the line `export default container;`
    const containerBindIndex = content.indexOf('export default container;');
  
    if (containerBindIndex !== -1) {
      // Insert the new Binds just above this line
      content = content.slice(0, containerBindIndex) + newBinds + content.slice(containerBindIndex);
    }

    fs.outputFileSync(inversifyConfigPath, content);
    if (!importsExist) {
      console.log(`Added ${modelName}Controller and ${modelName}Service imports to inversifyConfig.ts`);
    }
  }

function addImportsToV1Routes(modelName: string) {

    const v1RoutesPath = path.join('src', 'routes', 'v1.ts');
    let content = fs.readFileSync(v1RoutesPath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    const pluralModelName = pluralize(modelNameLowerCase);

    const newImports = `import ${modelName}Routes from './${modelNameLowerCase}Routes';
    `;
    const newBinds = `router.use('/api/v1/${pluralModelName}', authMiddleware, ${modelName}Routes);
    `;

    const importsExist = content.includes(`${modelNameLowerCase}Routes`);
  
    if (importsExist) {
      console.log(`${modelName}Routes already present.`);
      return;
    }
     
    // Find the position of the line `const router = Router();`
    const containerLineIndex = content.indexOf('const router = Router();');
  
    if (containerLineIndex !== -1) {
      // Insert the new imports just above this line and add an empty line above and below the inserted imports
      content = content.slice(0, containerLineIndex) + newImports + content.slice(containerLineIndex);
    }

    // Find the position of the line `export default container;`
    const containerBindIndex = content.indexOf('export default router;');
  
    if (containerBindIndex !== -1) {
      // Insert the new Binds just above this line
      content = content.slice(0, containerBindIndex) + newBinds + content.slice(containerBindIndex);
    }

    fs.outputFileSync(v1RoutesPath, content);
    
    if (!importsExist) {
      console.log(`Added ${modelName}Routes to V1Routes`);
    }
  }

function generateSwaggerPath(modelName: string){

    const templatePath = path.join('src', 'config', 'templates', 'swaggerPaths.ts');
    let content = fs.readFileSync(templatePath, 'utf-8');
    const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
    const pluralModelName = pluralize(modelNameLowerCase);
    content = content.replace(/\${modelName}/g, modelNameLowerCase);
    content = content.replace(/\${ModelName}/g, modelName);
    content = content.replace(/\${pluralModelName}/g, pluralModelName);
    fs.outputFileSync(path.join(paths.swaggerPath, `${modelNameLowerCase}Paths.ts`), content);
    console.log(`Swagger Path file for ${modelName} created at ${paths.swaggerPath}/${modelNameLowerCase}Paths.ts`);
    
    const templateDefPath = path.join('src', 'config', 'templates', 'swaggerDefinition.ts');
    let contentDef = fs.readFileSync(templateDefPath, 'utf-8');
    const swaggerDef = generateSwagger(modelName);
    contentDef = contentDef.replace(/\${modelName}/g, modelNameLowerCase);
    contentDef = contentDef.replace(/\${ModelName}/g, modelName);
    contentDef = contentDef.replace(/\${swaggerDef}/g, JSON.stringify(swaggerDef, null, 2));
    fs.outputFileSync(path.join(paths.swaggerDefPath, `${modelNameLowerCase}Definition.ts`), contentDef);
    console.log(`Swagger Definition file for ${modelName} created at ${paths.swaggerDefPath}/${modelNameLowerCase}Definitions.ts`);

}

function addImportsToSwaggerConfig(modelName: string) {

  const v1RoutesPath = path.join('src', 'config','swagger' ,'swaggerConfig.ts');
  let content = fs.readFileSync(v1RoutesPath, 'utf-8');
  const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);

  const pathImports = `import ${modelNameLowerCase}Paths from './paths/${modelNameLowerCase}Paths';
  `;
  const defImports = `import ${modelNameLowerCase}Definitions from './definitions/${modelNameLowerCase}Definition';
  `;
  const pathInclude = `...${modelNameLowerCase}Paths,
  `;
  const defInclude = `...${modelNameLowerCase}Definitions,
  `;

  const importsExist = content.includes(`${modelNameLowerCase}Paths`);

  if (importsExist) {
    console.log(`${modelName}Paths & Definition already present.`);
    return;
  }
   
  // Find the position of the line `const router = Router();`
  const containerPathIndex = content.indexOf('// Path Imports ends');

  if (containerPathIndex !== -1) {
    // Insert the new imports just above this line and add an empty line above and below the inserted imports
    content = content.slice(0, containerPathIndex) + pathImports + content.slice(containerPathIndex);
  }

  // Find the position of the line `export default container;`
  const containerDefIndex = content.indexOf('// Definition Imports ends');

  if (containerDefIndex !== -1) {
    // Insert the new Binds just above this line
    content = content.slice(0, containerDefIndex) + defImports + content.slice(containerDefIndex);
  }
  // Find the position of the line `export default container;`
  const containerPathInclude = content.indexOf('// register new paths here');

  if (containerPathInclude !== -1) {
    // Insert the new Binds just above this line
    content = content.slice(0, containerPathInclude) + pathInclude + content.slice(containerPathInclude);
  }
  // Find the position of the line `export default container;`
  const containerDefInclude = content.indexOf('// register new defintions here');

  if (containerDefIndex !== -1) {
    // Insert the new Binds just above this line
    content = content.slice(0, containerDefInclude) + defInclude + content.slice(containerDefInclude);
  }

  fs.outputFileSync(v1RoutesPath, content);
  
  if (!importsExist) {
    console.log(`Added ${modelName}Paths and Definitions to SwaggerConfig`);
  }
}

function generateTestData(fields: string[], types: string[], optionalFields: Set<string>): {
  createData: string;
  createExpectation: string;
  updateData: string;
  updateExpectation: string;
  partialUpdateData: string;
  invalidData: string;
  filterParam: string;
} {
  const createDataFields: string[] = [];
  const createExpectFields: string[] = [];
  const updateDataFields: string[] = [];
  const updateExpectFields: string[] = [];
  const partialFields: string[] = [];
  const invalidFields: string[] = [];
  let filterParam = 'id=1';

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const type = types[i];
    const isOptional = optionalFields.has(field);

    // Skip system fields
    if (['id', 'createdAt', 'updatedAt', 'deletedAt'].includes(field)) {
      continue;
    }

    // Generate test data based on type
    let testValue = '';
    let updateValue = '';
    let invalidValue = '';

    switch (type) {
      case 'String':
        testValue = `'Test ${field} \${Date.now()}'`;
        updateValue = `'Updated ${field} \${Date.now()}'`;
        invalidValue = '12345'; // number instead of string
        filterParam = `${field}=test`;
        break;
      case 'Int':
        testValue = '1';
        updateValue = '2';
        invalidValue = `'not a number'`;
        break;
      case 'Float':
        testValue = '10.5';
        updateValue = '20.5';
        invalidValue = `'not a float'`;
        break;
      case 'Boolean':
        testValue = 'true';
        updateValue = 'false';
        invalidValue = `'not a boolean'`;
        break;
      case 'DateTime':
        testValue = `new Date().toISOString()`;
        updateValue = `new Date().toISOString()`;
        invalidValue = `'invalid date'`;
        break;
      default:
        testValue = `'test value'`;
        updateValue = `'updated value'`;
        invalidValue = '123';
    }

    // Add to create data (skip optional fields for minimal test)
    if (!isOptional || createDataFields.length < 2) {
      createDataFields.push(`${field}: ${testValue}`);
      createExpectFields.push(`${field}: expect.any(${type === 'String' ? 'String' : type === 'Int' || type === 'Float' ? 'Number' : type === 'Boolean' ? 'Boolean' : 'String'})`);
    }

    // Add to update data
    updateDataFields.push(`${field}: ${updateValue}`);
    updateExpectFields.push(`${field}: expect.any(${type === 'String' ? 'String' : type === 'Int' || type === 'Float' ? 'Number' : type === 'Boolean' ? 'Boolean' : 'String'})`);

    // Add first field to partial update
    if (partialFields.length === 0) {
      partialFields.push(`${field}: ${updateValue}`);
    }

    // Add to invalid data
    if (invalidFields.length < 2) {
      invalidFields.push(`${field}: ${invalidValue}`);
    }
  }

  return {
    createData: createDataFields.join(',\n                '),
    createExpectation: createExpectFields.join(',\n                '),
    updateData: updateDataFields.join(',\n                '),
    updateExpectation: updateExpectFields.join(',\n                '),
    partialUpdateData: partialFields.join(',\n                '),
    invalidData: invalidFields.join(',\n                '),
    filterParam,
  };
}

function generateTest(modelName: string, fields: string[], types: string[], optionalFields: Set<string>) {
  const modelNameLowerCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const pluralModelName = pluralize(modelNameLowerCase);
  const testData = generateTestData(fields, types, optionalFields);

  // Generate Controller Unit Tests
  const controllerTemplatePath = path.join('src', 'config', 'templates', 'controller.test.ts');
  let controllerContent = fs.readFileSync(controllerTemplatePath, 'utf-8');
  controllerContent = controllerContent.replace(/\${modelName}/g, modelNameLowerCase);
  controllerContent = controllerContent.replace(/\${ModelName}/g, modelName);
  controllerContent = controllerContent.replace(/\${testCreateData}/g, testData.createData);
  controllerContent = controllerContent.replace(/\${testUpdateData}/g, testData.updateData);
  controllerContent = controllerContent.replace(/\${testPartialUpdateData}/g, testData.partialUpdateData);
  controllerContent = controllerContent.replace(/\${testFilterParam}/g, testData.filterParam);
  fs.outputFileSync(path.join(paths.unitTests, 'controllers', `${modelNameLowerCase}Controller.test.ts`), controllerContent);
  console.log(`Controller unit tests created at ${paths.unitTests}/controllers/${modelNameLowerCase}Controller.test.ts`);

  // Generate Service Unit Tests
  const serviceTemplatePath = path.join('src', 'config', 'templates', 'service.test.ts');
  let serviceContent = fs.readFileSync(serviceTemplatePath, 'utf-8');
  serviceContent = serviceContent.replace(/\${modelName}/g, modelNameLowerCase);
  serviceContent = serviceContent.replace(/\${ModelName}/g, modelName);
  serviceContent = serviceContent.replace(/\${testCreateData}/g, testData.createData);
  serviceContent = serviceContent.replace(/\${testUpdateData}/g, testData.updateData);
  serviceContent = serviceContent.replace(/\${testPartialUpdateData}/g, testData.partialUpdateData);
  serviceContent = serviceContent.replace(/\${testFilterParam}/g, testData.filterParam);
  fs.outputFileSync(path.join(paths.unitTests, 'services', `${modelNameLowerCase}Service.test.ts`), serviceContent);
  console.log(`Service unit tests created at ${paths.unitTests}/services/${modelNameLowerCase}Service.test.ts`);

  // Generate Integration Tests
  const integrationTemplatePath = path.join('src', 'config', 'templates', 'test.ts');
  let integrationContent = fs.readFileSync(integrationTemplatePath, 'utf-8');
  integrationContent = integrationContent.replace(/\${modelName}/g, modelNameLowerCase);
  integrationContent = integrationContent.replace(/\${ModelName}/g, modelName);
  integrationContent = integrationContent.replace(/\${pluralModelName}/g, pluralModelName);
  integrationContent = integrationContent.replace(/\${testCreateData}/g, testData.createData);
  integrationContent = integrationContent.replace(/\${testCreateExpectation}/g, testData.createExpectation);
  integrationContent = integrationContent.replace(/\${testUpdateData}/g, testData.updateData);
  integrationContent = integrationContent.replace(/\${testUpdateExpectation}/g, testData.updateExpectation);
  integrationContent = integrationContent.replace(/\${testPartialUpdateData}/g, testData.partialUpdateData);
  integrationContent = integrationContent.replace(/\${testInvalidData}/g, testData.invalidData);
  integrationContent = integrationContent.replace(/\${testFilterParam}/g, testData.filterParam);
  fs.outputFileSync(path.join(paths.integrationTests, `${modelNameLowerCase}.integration.test.ts`), integrationContent);
  console.log(`Integration tests created at ${paths.integrationTests}/${modelNameLowerCase}.integration.test.ts`);
}

async function promptInputs() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'modelName',
      message: 'Enter the model name:',
      validate: (input) => (input ? true : 'Model name is required'),
    },
    {
      type: 'input',
      name: 'permissionName',
      message: 'Enter the permission name:',
      validate: (input) => (input ? true : 'Permission name is required'),
    },
  ]);
  return answers;
}

(async function () {
  try {
    const { modelName, permissionName } = await promptInputs();

    const { fields, types, optionalFields } = extractModelDefinition(modelName);

    generateModel(modelName, fields, types , optionalFields);
    generateController(modelName);
    generateService(modelName);
    generateRoutes(modelName,permissionName);
    generateValidationFile(modelName);
    addImportsToInversifyConfig(modelName);
    addImportsToV1Routes(modelName);
    generateSwaggerPath(modelName);
    addImportsToSwaggerConfig(modelName);
    generateTest(modelName, fields, types, optionalFields);

    console.log(`\n✅ Files for ${modelName} created successfully!\n`);
    console.log(`📁 Generated Files:`);
    console.log(`   - Model: src/models/${modelName.toLowerCase()}.ts`);
    console.log(`   - Controller: src/controllers/${modelName.toLowerCase()}Controller.ts`);
    console.log(`   - Service: src/services/${modelName.toLowerCase()}Service.ts`);
    console.log(`   - Routes: src/routes/${modelName.toLowerCase()}Routes.ts`);
    console.log(`   - Validator: src/validators/${modelName.toLowerCase()}Validator.ts`);
    console.log(`   - Swagger Docs: src/config/swagger/paths/${modelName.toLowerCase()}Paths.ts`);
    console.log(`   - Unit Tests:`);
    console.log(`     • Controller: src/tests/unit/controllers/${modelName.toLowerCase()}Controller.test.ts`);
    console.log(`     • Service: src/tests/unit/services/${modelName.toLowerCase()}Service.test.ts`);
    console.log(`   - Integration Tests: src/tests/integration/${modelName.toLowerCase()}.integration.test.ts\n`);
    console.log(`📊 Test Commands:`);
    console.log(`   npm test              → Run all tests with coverage`);
    console.log(`   npm run test:unit     → Run only unit tests`);
    console.log(`   npm run test:integration → Run only integration tests`);
    console.log(`   npm run test:watch    → Watch mode`);
    console.log(`   npm run test:coverage → Run tests & open coverage report\n`);
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('An unknown error occurred:', err);
    }
  }
})();
