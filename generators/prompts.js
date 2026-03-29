export const modulePrompts = [
	{
		type: 'input',
		name: 'moduleName',
		message: 'Module name (camelCase, e.g., user, productCategory):',
		validate: (input) => {
			if (!input.trim()) {
				return 'Module name is required';
			}
			if (!/^[a-z][a-zA-Z0-9]*$/.test(input)) {
				return 'Module name must be camelCase: starts with lowercase';
			}
			return true;
		},
	},
	{
		type: 'checkbox',
		name: 'files',
		message: 'Select files to generate:',
		choices: [
			{ name: 'Schema (Drizzle table)', value: 'schema', checked: true },
			{ name: 'Validator (Zod middleware)', value: 'validator', checked: true },
			{ name: 'Service (Business logic)', value: 'service', checked: true },
			{ name: 'Controller (Request handler)', value: 'controller', checked: true },
			{ name: 'Route (API endpoint)', value: 'route', checked: true },
			{ name: 'Index (Barrel exports)', value: 'index', checked: true },
		],
		default: ['schema', 'validator', 'service', 'controller', 'route', 'index'],
	},
];
