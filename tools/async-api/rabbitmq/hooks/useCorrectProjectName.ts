import Generator from "@asyncapi/generator";
import { Logger } from "../utils";

/**
 * Since we cannot control the name of folders, we need to rename the default one to the desired project name after it's done generating the code.
 */
export default {
  "generate:before": (generator: Generator) => {
    Logger.info("Starting Async-Api Generator execution");

    console.log(JSON.stringify(generator));
  },
  "generate:after": (generator: Generator) => {
    Logger.info("Completing Async-Api Generator execution");

    const { projectName } = generator.templateParams;
    const defaultProjectName = "OpenSystem.Services";
    /*if (projectName !== defaultProjectName) {
      const currentPathToProject = path.resolve(
        generator.targetDir,
        "AsyncApiRabbitMqClient"
      );
      const newPathToProject = path.resolve(generator.targetDir, projectName);
      fs.renameSync(currentPathToProject, newPathToProject);

      const currentPathToTestProject = path.resolve(
        generator.targetDir,
        "AsyncApiRabbitMqClientTests"
      );
      const newPathToTestProject = path.resolve(
        generator.targetDir,
        `${projectName}Tests`
      );

      fs.renameSync(currentPathToTestProject, newPathToTestProject);
    }*/
  },
};
