import { TakeoffCommand } from 'commands';
import { TakeoffCmdParameters, TakeoffRcFile } from 'takeoff';

/**
 * Command that handles the stopping of a project
 */

export = ({
  shell,
  args,
  opts,
  printMessage,
  pathExists,
  exitWithMessage,
  rcFile,
}: TakeoffCmdParameters): TakeoffCommand => ({
  args: '<name>',
  command: 'stop',
  description: 'Stops all services in a named project',
  group: 'takeoff',
  handler(): void {
    const [project]: string[] = args.length > 0 ? args : ['default'];

    printMessage(`Stopping project ${project}`);

    const projectDir = `${rcFile.rcRoot}/projects/${project}`;

    if (!pathExists(projectDir)) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1);
    }

    const runCmd = shell.exec(`docker-compose -f ${projectDir}/docker/docker-compose.yml stop`, {
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage(`The project ${project} doesn't exist`, 1, runCmd.stdout);
    }

    return exitWithMessage(`Successfully stopped ${project}`, 0);
  },
});
