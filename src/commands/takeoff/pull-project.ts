import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

/**
 * Command for pulling an project
 */

export = ({
  silent,
  shell,
  args,
  rcFile,
  pathExists,
  exitWithMessage,
  printMessage,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name> [service]',
  command: 'pull',
  description: 'Pulls any pre-build images within a project (such a database images).',
  group: 'takeoff',
  handler(): void {
    const [project, service]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Pullng project ${project}`);

    const envDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(envDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    let cmd = `docker-compose -f ${envDir}/docker/docker-compose.yml pull`;
    if (service) {
      cmd = `${cmd} ${service}`;
    }

    const runCmd = shell.exec(cmd, { silent });

    if (runCmd.code !== 0) {
      return exitWithMessage(`Unable to pull ${project}.  Use -v to see verbose logs`, 1, runCmd.stdout);
    }

    return exitWithMessage(`Pulled pre-built images for ${project}.  Use -v to see verbose logs`, 0);
  },
});
