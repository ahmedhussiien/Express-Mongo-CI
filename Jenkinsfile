def getRepoURL() {
  sh "git config --get remote.origin.url > .git/remote-url"
  return readFile(".git/remote-url").trim()
}

def getCommitSha() {
  sh "git rev-parse HEAD > .git/current-commit"
  return readFile(".git/current-commit").trim()
}

def getCommitId() {
  sh "git rev-parse --short HEAD > .git/commit-id"
  return readFile(".git/commit-id").trim()
}


def getDurationInSeconds(long startTime, long endTime) {
  long diff = endTime - startTime
  diff /= 1000 
  return diff
}

def updateGithubCommitStatus(String context, String state, String message) {
  repoUrl = getRepoURL()
  commitSha = getCommitSha()

  step([
    $class: 'GitHubCommitStatusSetter',
    reposSource: [$class: "ManuallyEnteredRepositorySource", url: repoUrl],
    commitShaSource: [$class: "ManuallyEnteredShaSource", sha: commitSha],
    contextSource: [$class: "ManuallyEnteredCommitContextSource", context: context],
    errorHandlers: [
      [$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]
    ],
    statusResultSource: [$class: "ConditionalStatusResultSource", results: [
      [$class: "AnyBuildResult", message: message, state: state]
    ]]
  ])
}

pipeline {
  agent any
stages {
    stage('Build Testing environment') {
      steps {
        script {
          try {
            updateGithubCommitStatus("Jenkins CI - Build Status", 'PENDING', "The Jenkins CI build is in progress")
            def startTime = new Date()   

            sh 'npm run docker:build_test'

            def stopTime = new Date()
            long duration = getDurationInSeconds(startTime.getTime(), stopTime.getTime() ) 
            updateGithubCommitStatus("Jenkins CI - Build Status", 'SUCCESS', "Build Passed in " + duration + " sec")

          } catch (Exception e) {
            updateGithubCommitStatus("Jenkins CI - Build Status", 'FAILURE', "Build Failed")
            throw e
          }
        }
      }
    }

    stage('Test') {
      steps {
        script {
          try {
            updateGithubCommitStatus("Jenkins CI - Tests Status", 'PENDING', "The Jenkins CI test is in progress")
            def startTime = new Date()   

            sh 'npm run docker:run_test'

            def stopTime = new Date()
            long duration = getDurationInSeconds(startTime.getTime(), stopTime.getTime() ) 
            updateGithubCommitStatus("Jenkins CI - Tests Status", 'SUCCESS', "Tests Passed in " + duration  + " sec")
          } catch (Exception e) {
            updateGithubCommitStatus("Jenkins CI - Tests Status", 'FAILURE', "Tests Failed")
            throw e
          }
        }
      }
    }
}