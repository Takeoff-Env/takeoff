import { TakeoffCmdParameters } from 'takeoff';
import { TakeoffCommand } from 'commands';

/**
 * Command for pulling an environment
 */

export = ({ shell, opts, exitWithMessage, printMessage }: TakeoffCmdParameters): TakeoffCommand => ({
  command: 'pi',
  description: 'Convenience method to prune all images',
  options: [
    {
      option: '-f, --filter',
      description: 'Filter the prune command with expressions (e.g "label=foo")',
    },
  ],
  group: 'docker',
  handler(): void {
    printMessage(`Pruning Docker Images`);

    let cmd = 'docker image prune -f';
    if (opts['f'] || opts['filter']) {
      cmd = `${cmd} --filter ${opts['f'] || opts['filter']}`;
    }

    const runCmd = shell.exec(cmd, {
      slient: opts.v ? false : true,
    });

    if (runCmd.code !== 0) {
      return exitWithMessage('Error pruning images.  Use -v to see verbose logs', 1, runCmd.stdout);
    }

    return exitWithMessage('Docker images pruned', 0);
  },
});
