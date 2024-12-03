import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

const paths = {
  model: 'src/models',
  controller: 'src/controllers',
  service: 'src/services',
  routes: 'src/routes',
};

const schemaPath = path.join(process.cwd(), 'prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

function extractModelDefinition(modelName: string): { fields: string[]; types: string[]; optionalFields: Set<string> } {
    const modelRegex = new RegExp(`model ${modelName} {([\\s\\S]*?)}`, 'm');
    const match = schemaContent.match(modelRegex);

    if (!match) throw new Error(`Model ${modelName} not found in schema.prisma`);

    const fieldLines = match[1].trim().split('\n');

    const fields: string[] = [];
    const types: string[] = [];
    const optionalFields: Set<string> = new Set();

    for (const line of fieldLines) {
        const [field, type, ...rest] = line.trim().split(/\s+/);
        const isOptional = type.endsWith('?') || field === 'id' || field === 'deletedAt';
        const isArray = type.endsWith('[]');
        const baseType = type.replace(/[?\[\]]/g, ''); // Remove `?` and `[]`

        fields.push(field);
        types.push(`${baseType}${isArray ? '[]' : ''}`);
        if (isOptional) {
            optionalFields.add(field);
        }
    }

    return { fields, types, optionalFields };
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

    const newImports = `import ${modelName}Routes from './${modelNameLowerCase}Routes';
    `;
    const newBinds = `router.use('/api/v1/${modelNameLowerCase}', authMiddleware, ${modelName}Routes);
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
    addImportsToInversifyConfig(modelName);
    addImportsToV1Routes(modelName);

    console.log(`Files for ${modelName} created successfully!`);
  } catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('An unknown error occurred:', err);
    }
  }
})();
