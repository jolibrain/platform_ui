pipeline {
  agent any
  stages {
   stage('Init') {
      steps {
  /* FIXME(sileht): Put this in Jenkins lib to be able to load it in all projects
        script {
            def common = load("ci/Jenkinsfile.common")
            common.cancelPreviousBuilds()
        }
        */
        sh 'printenv | sort'
      }
    }
    stage('Test and build') {
      docker.image('node:10').inside() {
        sh 'node --version'
        sh 'yarn --version'
        sh 'yarn'
        sh 'yarn test'
        sh 'yarn build'
      }
    }
  }
  post {
    always {
      cleanWs(cleanWhenAborted: true, cleanWhenFailure: true, cleanWhenNotBuilt: true, cleanWhenSuccess: true, cleanWhenUnstable: true, cleanupMatrixParent: true, deleteDirs: true)
    }
    success {
      catchError {
        rocketSend(channel: 'build', message: 'Build succeed' ,color: 'green' )
      }
    }
    aborted {
      catchError {
        rocketSend(channel: 'build', message: 'Build superseded or aborted')
      }
    }
    unstable {
      catchError {
        rocketSend(channel: 'build', message: 'Build failed', color: 'red')
      }
    }
    failure {
      catchError {
        rocketSend(channel: 'build', message: 'Build failed', color: 'red')
      }
    }
  }
}
