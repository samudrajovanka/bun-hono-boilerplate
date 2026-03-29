import { seedProjects } from './projects';

const main = async () => {
	console.log('Start seeding');

	await seedProjects();

	console.log('Finish seeding');
	process.exit(0);
};

main();
