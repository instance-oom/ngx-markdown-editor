import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { getWorkspace, getProjectFromWorkspace, readFile } from './../util';

function registerInPackageJson(_options: any) {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.skipDeps) {
      _context.logger.info('Skip installing ngx-markdown-ediotr dependency(ace-builds/bootstrap/font-awesome) packages.');
      return tree;
    }
    if (tree.exists('package.json')) {
      const dependencies: any = {
        'ace-builds': '^1.4.9',
        'bootstrap': '^4.3.1',
        'font-awesome': '^4.7.0'
      }
      const packageInfo = JSON.parse(readFile(tree, 'package.json'));
      let changed = false;
      for (let key in dependencies) {
        if (!packageInfo['dependencies'][key]) {
          packageInfo['dependencies'][key] = dependencies[key];
          changed = true;
        }
      }
      if (changed) {
        tree.overwrite('package.json', JSON.stringify(packageInfo, null, 2));
        _context.addTask(new NodePackageInstallTask());
      }
    }
    return tree;
  };
};

function updateAngularJson(_options: any) {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.skipImport) {
      _context.logger.info('Skip assets/styles/scripts registration.');
      return tree;
    }
    const supportedTargets = new Set(['build', 'test']);
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, _options.project);
    const targets = project.architect || project.targets;
    let aceAssets = {
      glob: "**/*",
      input: "node_modules/ace-builds/src-min",
      output: "./assets/ace-builds/"
    };
    let styles = [
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/font-awesome/css/font-awesome.min.css',
      'node_modules/ngx-markdown-editor/assets/highlight.js/agate.min.css'
    ]
    let scripts = [
      'node_modules/ngx-markdown-editor/assets/highlight.js/highlight.min.js',
      'node_modules/ngx-markdown-editor/assets/marked.min.js'
    ]
    Object.keys(targets).filter(key => supportedTargets.has(key)).forEach(key => {
      let target = targets[key];
      if (!target.options) {
        target.options = {
          assets: [aceAssets],
          styles: styles,
          scripts: scripts
        };
      } else if (!target.options.assets || !target.options.styles || !target.options.scripts) {
        target.options.assets = target.options.assets || [aceAssets];
        target.options.styles = target.options.styles || styles;
        target.options.scripts = target.options.scripts || scripts;
      } else {
        styles = styles.reverse();
        scripts = scripts.reverse();

        let foundAceAsset = false;
        for (let asset of target.options.assets) {
          if (typeof asset !== 'object' || !asset.input) continue;
          if (asset.input.indexOf('node_modules/ace-builds') !== -1) {
            foundAceAsset = true;
            break;
          }
        }
        if (!foundAceAsset) {
          target.options.assets.push(aceAssets);
        }

        const existingStyles = target.options.styles.map((s: any) => typeof s === 'string' ? s : s.input);
        for (let style of styles) {
          const exists = existingStyles.find((s: any) => s.includes(style));
          if (!exists) {
            target.options.styles.splice(0, 0, style);
          }
        }

        const existingScripts = target.options.scripts.map((s: any) => typeof s === 'string' ? s : s.input);
        for (let script of scripts) {
          const exists = existingScripts.find((s: any) => s.includes(script));
          if (!exists) {
            target.options.scripts.splice(0, 0, script);
          }
        }
      }
      tree.overwrite('angular.json', JSON.stringify(workspace, null, 2));
    });
    return tree;
  }
};

export function ngAdd(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return chain([
      registerInPackageJson(_options),
      updateAngularJson(_options)
    ])(tree, _context);
  };
}
