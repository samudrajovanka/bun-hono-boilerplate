import { modulePrompts } from './generators/prompts.js';
import { readFileSync, writeFileSync } from 'fs';

const PREFIX_PATH_MODULES = '@/modules';

const toPascalCase = (str) =>
	str.charAt(0).toUpperCase() + str.slice(1);

const toCamelCase = (str) =>
	str.charAt(0).toLowerCase() + str.slice(1);

function appendToSchemas(answers) {
	const { moduleName } = answers;
	const schemasPath = 'src/schemas/index.ts';
	const exportLine = `export * from '${PREFIX_PATH_MODULES}/${moduleName}/schema';`;

	try {
		const content = readFileSync(schemasPath, 'utf-8');
		if (content.includes(exportLine)) {
			return 'Schema already exported';
		}
		writeFileSync(schemasPath, content.trim() + '\n' + exportLine + '\n');
		return 'Schema registered';
	} catch (error) {
		return `Error: ${error.message}`;
	}
}

function appendToApiRoutes(answers) {
	const { moduleName } = answers;
	const camelName = toCamelCase(moduleName);
	const apiPath = 'src/routes/api.ts';
	const importLine = `import ${camelName}Route from '${PREFIX_PATH_MODULES}/${moduleName}/route';`;
	const routeLine = `apiApp.route('/${moduleName}', ${camelName}Route);`;

	try {
		let content = readFileSync(apiPath, 'utf-8');

		if (content.includes(importLine)) {
			return 'Route already registered';
		}

		const importMarkerStart = '// [IMPORT_ROUTE_START]';
		const registerMarkerStart = '// [ROUTE_REGISTRATION_START]';
		const registerMarkerEnd = '// [ROUTE_REGISTRATION_END]';

		if (content.includes(importMarkerStart)) {
			content = content.replace(
				importMarkerStart,
				importMarkerStart + '\n' + importLine,
			);
		}

		if (content.includes(registerMarkerStart)) {
			content = content.replace(
				registerMarkerEnd,
				routeLine + '\n' + registerMarkerEnd,
			);
		}

		writeFileSync(apiPath, content);
		return 'Route registered';
	} catch (error) {
		return `Error: ${error.message}`;
	}
}

export default function (plop) {
	plop.setGenerator('module', {
		description: 'Generate a new module',
		prompts: modulePrompts,
		actions: (data) => {
			if (!data) return [];

			const { moduleName, files } = data;
			const pascalName = toPascalCase(moduleName);
			const camelName = toCamelCase(moduleName);
			const snakeName = moduleName.replace(/-/g, '_');

			const baseData = {
				...data,
				pascalName,
				camelName,
				snakeName,
			};

			const actions = [];

			if (files?.includes('schema')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/schema.ts.hbs',
					path: `src/modules/${moduleName}/schema.ts`,
					data: baseData,
				});
				actions.push(appendToSchemas);
			}

			if (files?.includes('validator')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/validator.ts.hbs',
					path: `src/modules/${moduleName}/validator.ts`,
					data: baseData,
				});
			}

			if (files?.includes('service')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/service.ts.hbs',
					path: `src/modules/${moduleName}/service.ts`,
					data: baseData,
				});
			}

			if (files?.includes('controller')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/controller.ts.hbs',
					path: `src/modules/${moduleName}/controller.ts`,
					data: baseData,
				});
			}

			if (files?.includes('route')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/route.ts.hbs',
					path: `src/modules/${moduleName}/route.ts`,
					data: baseData,
				});
				actions.push(appendToApiRoutes);
			}

			if (files?.includes('index')) {
				actions.push({
					type: 'add',
					templateFile: 'generators/templates/src/module/index.ts.hbs',
					path: `src/modules/${moduleName}/index.ts`,
					data: baseData,
				});
			}

			return actions;
		},
	});

	plop.setGenerator('module-all', {
		description: 'Generate a new module with all files (non-interactive)',
		prompts: [
			{
				type: 'input',
				name: 'moduleName',
				message: 'Module name (camelCase):',
				validate: (input) => {
					if (!input.trim()) return 'Module name is required';
					if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
						return 'Must be camelCase: starts with lowercase, alphanumeric only';
					}
					return true;
				},
			},
		],
		actions: (data) => {
			if (!data) return [];

			const { moduleName } = data;
			const pascalName = toPascalCase(moduleName);
			const camelName = toCamelCase(moduleName);
			const snakeName = moduleName.replace(/-/g, '_');

			const baseData = {
				...data,
				pascalName,
				camelName,
				snakeName,
			};

			return [
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/schema.ts.hbs',
					path: `src/modules/${moduleName}/schema.ts`,
					data: baseData,
				},
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/validator.ts.hbs',
					path: `src/modules/${moduleName}/validator.ts`,
					data: baseData,
				},
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/service.ts.hbs',
					path: `src/modules/${moduleName}/service.ts`,
					data: baseData,
				},
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/controller.ts.hbs',
					path: `src/modules/${moduleName}/controller.ts`,
					data: baseData,
				},
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/route.ts.hbs',
					path: `src/modules/${moduleName}/route.ts`,
					data: baseData,
				},
				{
					type: 'add',
					templateFile: 'generators/templates/src/module/index.ts.hbs',
					path: `src/modules/${moduleName}/index.ts`,
					data: baseData,
				},
				appendToSchemas,
				appendToApiRoutes,
			];
		},
	});
}
