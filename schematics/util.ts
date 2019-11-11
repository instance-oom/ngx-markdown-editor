import { Tree, SchematicsException } from '@angular-devkit/schematics';

export function getWorkspace(tree: Tree) {
  const workspaceConfigBuffer = tree.read('angular.json');
  if (!workspaceConfigBuffer) {
    throw new SchematicsException('Not an Angular CLI workspace');
  }
  const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
  return workspaceConfig;
}

export function getProjectFromWorkspace(config: any, projectName: any) {
  if (!config.projects)
    throw new SchematicsException('No projects are defined');
  if (projectName) {
    const project = config.projects[projectName];
    if (!project) {
      throw new SchematicsException(`No project named "${projectName}" exists.`);
    }
    Object.defineProperty(project, 'name', { enumerable: false, value: projectName });
    return project;
  }
  const allProjectNames = Object.entries(config.projects)
    .filter(([name, value]) => (<any>value).projectType !== 'library')
    .filter(([name, _]) => !name.includes('e2e'));
  if (allProjectNames.length !== 1)
    throw new SchematicsException('Multiple projects are defined; please specify a project name');
  const [name, _] = allProjectNames[0];
  const project = config.projects[name];
  Object.defineProperty(project, 'name', { enumerable: false, value: projectName });
  return project;
}

export function readFile(tree: Tree, filePath: string) {
  const content = tree.read(filePath);
  if (content === null) {
    throw new SchematicsException(`File ${filePath} does not exist.`);
  }
  return content.toString('utf-8');
}
