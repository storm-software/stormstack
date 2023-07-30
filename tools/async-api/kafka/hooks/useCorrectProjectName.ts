import Generator from "@asyncapi/generator";

/**
 * Since we cannot control the name of folders, we need to rename the default one to the desired project name after it's done generating the code.
 */
export default {
  "generate:before": (generator: Generator) => {
    console.info("Starting Async-Api Generator execution");

    console.info(JSON.stringify(generator));
  },
  "generate:after": (generator: Generator) => {
    console.info("Completing Async-Api Generator execution");

    //const { projectName } = generator.templateParams;
    //const defaultProjectName = "OpenSystem.Services";
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
