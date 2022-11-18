import hudson.tasks.test.AbstractTestResultAction

@Library("jenkins-devops-scripts") _
node('slave') {
    def git_utils = new com.beat.utilities.github()
    def stack_utils = new com.beat.utilities.stack()
    def project = "core-business-dashboard"
    def update_latest = false
    def img = null
    def latest_img = null
    def branch_or_tag = ""
    def beat_theme_npm_token = "BEAT_THEME_NPM_TOKEN";

    // Clone Repo
    stage('Clone repository') {
      /* Let's make sure we have the repository cloned to our workspace */
      checkout scm

      /* Build only if a tag or branches with 'feature-' prefix are pushed */
      if (env.TAG_NAME != null) {
        echo "This is the ${env.TAG_NAME} tag"
        branch_or_tag = env.TAG_NAME
        /* If a new tag was pushed, that means there is a new release, so we will update latest image too */
        update_latest = true
      } else if (git_utils.isSandboxBranch(env.BRANCH_NAME)) {
        echo "This is the ${env.BRANCH_NAME} branch"
        branch_or_tag = env.BRANCH_NAME
      } else {
        echo "No tag or feature branch was pushed"
      }
    }

    // Build image
    stage('Build docker image') {
      /* If a valid push is made, build image */
      if (branch_or_tag != "") {
      /* This builds the actual image; synonymous to docker build on the command line */
      withCredentials([
          string(credentialsId: "${beat_theme_npm_token}", variable: 'npmToken')
        ]) {
           img = docker.build("beat/${project}:${branch_or_tag}", "--no-cache --build-arg npmToken=${npmToken} .")
        }
      /* Update latest image */
      if (update_latest == true) {
        withCredentials([
          string(credentialsId: "${beat_theme_npm_token}", variable: 'npmToken')
        ]) {
          latest_img = docker.build("beat/${project}", "--no-cache --build-arg npmToken=${npmToken} .")
        }
      }
    }

    // Push image
    stage('Push image to registry') {
      // If image is built, push it to registry
      if (img != null) {
        // Get Management stack variables
        envVarMapManagement = stack_utils.managementstackVariables()
        /* Finally, we'll push the images:
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry("https://${envVarMapManagement.REGISTRY_SERVER}") {
          img.push()
        }
      }
      // If latest image is built, push it to registry
      if (latest_img != null) {
        // Get Management stack variables
        envVarMapManagement = stack_utils.managementstackVariables()
        /* Finally, we'll push the images:
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry("https://${envVarMapManagement.REGISTRY_SERVER}") {
          latest_img.push()
        }
      }
    }

    // Deploy to sfeature
    stage('Deploy') {
      /* If a new image was built, and is not a new release, deploy it */
      if (img != null && update_latest == false) {
        build job: 'sandbox-on-the-fly-deploy-app', parameters: [string(name: 'FEATURE_NAME', value: BRANCH_NAME), string(name: 'APP_NAME', value: project)], wait: false
      }
    }
  }
}
