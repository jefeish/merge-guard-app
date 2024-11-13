/**
 * [Merge Guard] Probot App
 *
 * This Probot app checks the title of a pull request to ensure it includes a valid JIRA issue key
 * (e.g., JIRA-1234). It is triggered when a pull request is opened or its title is edited.
 * 
 * The app performs the following tasks:
 * 1. When a PR is created or its title is edited, the app checks if the title matches the pattern "JIRA-<number>".
 * 2. If the title doesn't match the required pattern, the app:
 *    - Comments on the PR with an error message notifying the user about the missing JIRA issue key.
 *    - Marks the check run as "failure" to block the merge, based on the branch protection rules.
 * 3. If the title is valid, the app marks the check run as "success".
 * 
 * This app provides a GitHub check run as a status indicator, making it easy to enforce naming conventions
 * for pull requests and ensure traceability to JIRA issues.
 * 
 * NOTE: To prevent a PR from being merged, branch protection rules must be set up to require status checks
 *
 * For more information on building Probot apps, visit:
 * https://probot.github.io/docs/
 */

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
export default (app) => {
  app.on(['pull_request.opened', 'pull_request.edited'], async (context) => {
    const pr_sha = context.payload.pull_request.head.sha;

    // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
    try {
      // Create an initial "in_progress" check run
      const checkRun = await context.octokit.checks.create({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        name: '[Merge Guard]',
        head_sha: pr_sha,
        status: 'in_progress',
      });

      const CHECK_RUN_ID = checkRun.data.id;

      // Validate PR title using a regex pattern for JIRA ticket ID
      const prTitle = context.payload.pull_request.title;
      const pattern = /JIRA-[0-9]+/;
      const STATUS = 'completed';
      let CONCLUSION = 'success';
      let outputSummary = 'PR title is valid';

      // If the PR title doesn't match the pattern, fail the check and notify the user
      if (!pattern.test(prTitle)) {
        const message = 'Error: PR title does not match the required format (e.g., JIRA-1234)';

        // Comment on the PR to notify the user
        await context.octokit.issues.createComment({
          owner: context.payload.repository.owner.login,
          repo: context.payload.repository.name,
          issue_number: context.payload.pull_request.number,
          body: message,
        });

        // Set the conclusion to 'failure' if the title doesn't match
        CONCLUSION = 'failure';
        outputSummary = message;
      }

      // Update the check run with the result (success or failure)
      await context.octokit.checks.update({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        check_run_id: CHECK_RUN_ID,
        conclusion: CONCLUSION,
        status: STATUS,
        output: {
          title: '[Merge Guard] PR Title Check',
          summary: outputSummary,
        },
      });
    } catch (error) {
      console.error('Error while checking PR title:', error);
    }
  });

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
