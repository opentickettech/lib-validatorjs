#!/usr/bin groovy

def rootDir = "lib"
def docsDir = "docs"

def docsPrefix = "lib-validatorjs"
def docsBucketPrefix = "s3://storybooks.openticket.tech/${docsPrefix}"

// State
def commitHash = ""
def commitMessage = ""
def deployVersion = ""

@Library('cicd-pipeline')
import openticket.cicd.CICD
import groovy.json.JsonSlurper

def cicd = new CICD(this)
def slack = cicd.slack()

pipeline {

    agent none

    options {
        timestamps()
    }

    stages {
        // All branches should be tested, etc.
        stage('Any branch') {
            agent {
                docker {
                    image 'hub.openticket.tech/frontend/node:16.13.1'
                    registryUrl 'https://hub.openticket.tech'
                    registryCredentialsId 'harbor-frontend'
                    args '-e "NODE_OPTIONS="'
                }
            }
            stages {
                // Prep
                stage('Prep') {
                    steps {
                        script { slack.startStage() }

                        echo "Prep @openticket/lib-valdatorjs"

                        script {
                            commitHash = sh(script: 'git rev-parse HEAD', returnStdout: true, label: 'Commit hash').trim()
                            commitMessage = sh(script: "git show --no-patch --format=%s '${commitHash}'", returnStdout: true, label: 'Commit message').trim()
                        }

                        echo("commithash: ${commitHash}")
                        echo("commitMessage: ${commitMessage}")

                        withCredentials([string(credentialsId: 'verdaccio-jenkins-token', variable: 'NPM_AUTH_TOKEN')]) {
                            sh("echo \"//registry.openticket.tech/:_authToken=\\\"\$NPM_AUTH_TOKEN\\\"\" > .npmrc")

                            sh("echo \"//registry.openticket.tech/:always-auth=true\" >> .npmrc")

                            sh("yarn install --ignore-scripts --registry=\"https://registry.openticket.tech/\"")
                        }

                        // Ensure no forbidden files are present in root dir (committed in repo)
                        sh(label: 'Ensure no forbidden files present', script: "! find './${rootDir}' \\( -name '.env*' -or -name '.DS_Store' \\) -print | grep '.'")
                    }
                    post {
                        success { script { slack.finishStage('success') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                stage('Lint') {
                    steps {
                        script { slack.startStage() }

                        echo 'Lint'

                        sh('yarn lint -f junit -o junit/eslint.xml')
                    }
                    post {
                        always { junit 'junit/eslint.xml' }
                        success { script { slack.finishStage('success') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                stage('Test') {
                    steps {
                        script { slack.startStage() }

                        echo 'Test'

                        sh('yarn test:unit')

                        stash(includes: "coverage/**", name: 'coverage')
                    }
                    post {
                        always { junit 'junit/unit.xml' }
                        success { script { slack.finishStage('success') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                stage('Coverage') {
                    steps {
                        script { slack.startStage() }

                        echo 'Coverage'

                        unstash('coverage')

                        script {
                            coverage = sh(returnStdout: true, script: 'cat coverage/coverage-summary.json').trim()

                            def jsonSlurper = new JsonSlurper()
                            def coverage = jsonSlurper.parseText(coverage)

                            assert coverage instanceof Map
                            def exception = ''
                            if (coverage.total.lines.pct != 100) { exception = exception + "lines should be 100%, got ${coverage.total.lines.pct}%\n" }
                            if (coverage.total.statements.pct != 100) { exception = exception + "statements should be 100%, got ${coverage.total.statements.pct}%\n" }
                            if (coverage.total.functions.pct != 100) { exception = exception + "functions should be 100%, got ${coverage.total.functions.pct}%\n" }
                            if (coverage.total.branches.pct != 100) { exception = exception + "branches should be 100%, got ${coverage.total.branches.pct}%\n" }

                            if (exception != '') {
                                echo('Coverage failed: \n' + exception)
                                slack.finishStage('warning')
                            } else {
                                slack.finishStage('success')
                            }
                        }
                    }
                    post {
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                // Build
                stage('Build') {
                    steps {
                        script { slack.startStage() }

                        echo 'Build'

                        // If the json is broken, this will fail!
                        sh('yarn build')

                        sh("echo '${commitHash}' > ./${rootDir}/commit.txt")

                        // Ensure no forbidden files are present in root dir (due to build)
                        sh(label: 'Ensure no forbidden files present', script: "! find './${rootDir}' \\( -name '.env*' -or -name '.DS_Store' \\) -print | grep '.'")

                        stash(includes: "${rootDir}/**", name: 'dist')
                    }
                    post {
                        success { script { slack.finishStage('success') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                // Build Docs
                stage('Build Docs') {
                    steps {
                        script { slack.startStage() }

                        echo 'Build Docs'

                        // If the json is broken, this will fail!
                        sh('yarn storybook:build')

                        // Ensure no forbidden files are present in docs dir (due to build)
                        sh(label: 'Ensure no forbidden files present', script: "! find './${docsDir}' \\( -name '.env*' -or -name '.DS_Store' \\) -print | grep '.'")

                        stash(includes: "${docsDir}/**", name: 'docs')
                    }
                    post {
                        success { script { slack.finishStage('success') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }
            }
        }

        // MASTER
        stage('Master branch') {
            when {
                allOf {
                    branch 'master'
                    not { expression { commitMessage.contains('[NODEPLOY]') || commitMessage.contains('[NO-DEPLOY]') } }
                }
            }
            stages {

                // MASTER: Version
                stage('Bump & Tag Version') {
                    agent {
                        docker {
                            image 'hub.openticket.tech/frontend/node:16.13.1'
                            registryUrl 'https://hub.openticket.tech'
                            registryCredentialsId 'harbor-frontend'
                            args '-e "NODE_OPTIONS="'
                        }
                    }
                    environment {
                        GIT_AUTHOR_NAME     = 'Leroy'
                        GIT_AUTHOR_EMAIL    = 'leroy@openticket.tech'
                        GIT_COMMITTER_NAME  = 'Leroy'
                        GIT_COMMITTER_EMAIL = 'leroy@openticket.tech'
                        EMAIL               = 'leroy@openticket.tech'
                    }
                    steps {
                        script { slack.startStage() }

                        // Disallows concurrency of the version stage.
                        lock(resource: "lib-valdatorjs-version", inversePrecedence: false) {
                            echo 'Version & Tag'

                            // Abort al previous builds (if any waiting for the lock in wrong order).
                            milestone(ordinal: 100, label: 'Ensure version bump is permitted')

                            checkout scm

                            unstash('dist')

                            script {
                                echo "Bump & tag version"

                                try {
                                    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'bitbucket-peter', usernameVariable: 'GIT_USERNAME', passwordVariable: 'GIT_PASSWORD']]) {
                                        // If any race conditions / intermittent authentication failures are present, add a sleep 1 before echo of username/password.
                                        sh('git config credential.helper "!f() { sleep 1; printf \\"username=\\${GIT_USERNAME}\\npassword=\\${GIT_PASSWORD}\\"; }; f"')

                                        def versionMatch = "^v[0-9][0-9]*\\.[0-9][0-9]*\\.[0-9][0-9]*\$"

                                        def currentVersion = sh(script: "git tag | grep '${versionMatch}' | sort -V | tail -n 1", returnStdout: true, label: "Retrieve current version").trim()

                                        if (commitMessage.contains('[DEPLOY]')) {
                                            deployVersion = currentVersion

                                            echo("Version bumped in last commit, only retrieving version ${deployVersion}")
                                        } else {
                                            deployVersion = cicd.nextSemVersion(currentVersion, commitMessage)

                                            def deployVersionNumbersOnly = deployVersion.replaceAll('^v', '')

                                            // Bump package.json version
                                            sh("yarn version --no-git-tag-version --new-version '${deployVersionNumbersOnly}'")

                                            // Commit package.json (updated version)
                                            sh("git add package.json")
                                            sh("git commit -m '[DEPLOY] Bump version ${deployVersion} - ${commitMessage}'")

                                            // Add tag
                                            sh(script: "git tag --annotate '${deployVersion}' --message 'Leroy version bump'", label: "Tag version ${deployVersion}")

                                            // Push commit and tag
                                            sh("GIT_ASKPASS=true git push --atomic origin master '${deployVersion}'")
                                        }
                                    }
                                } finally {
                                    sh('git config --unset credential.helper')
                                }
                            }
                        }

                        // Add version to accessible file
                        sh("echo '${deployVersion}' > ./${rootDir}/version.txt")

                        stash(includes: "${rootDir}/**", name: 'dist')
                    }
                    post {
                        success { script { slack.finishStage('deployed') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                // MASTER: Publish
                stage('Publish') {
                    agent {
                        docker {
                            image 'hub.openticket.tech/frontend/node:16.13.1'
                            registryUrl 'https://hub.openticket.tech'
                            registryCredentialsId 'harbor-frontend'
                            args '-e "NODE_OPTIONS="'
                        }
                    }
                    when {
                        allOf {
                            expression { commitMessage.contains('[DEPLOY]') }
                            expression { deployVersion && deployVersion != '' }
                        }
                    }
                    steps {
                        script { slack.startStage() }

                        // Upload version to Verdaccio
                        echo "Publish library"
                        echo "-> version     : ${deployVersion}"

                        unstash('dist')

                        lock(resource: "lib-valdatorjs-publish", inversePrecedence: true) {
                            // Disallows concurrency of the publish stage.
                            // Locks are acquired on a last in first out order
                            // and previous builds are discarded.

                            withCredentials([string(credentialsId: 'verdaccio-jenkins-token', variable: 'NPM_AUTH_TOKEN')]) {
                                sh("echo \"//registry.openticket.tech/:_authToken=\\\"\$NPM_AUTH_TOKEN\\\"\" > .npmrc")

                                sh("echo \"//registry.openticket.tech/:always-auth=true\" >> .npmrc")

                                sh('yarn publish --access restricted --registry https://registry.openticket.tech/ --non-interactive')
                            }
                        }
                    }
                    post {
                        success { script { slack.finishStage('deployed') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }

                // MASTER: Deploy docs
                stage('Deploy docs') {
                    agent {
                        docker {
                            image 'hub.openticket.tech/build/aws'
                            registryUrl 'https://hub.openticket.tech'
                            registryCredentialsId 'harbor-build'
                        }
                    }
                    when {
                        allOf {
                            expression { commitMessage.contains('[DEPLOY]') }
                            expression { deployVersion && deployVersion != '' }
                            not { expression { commitMessage.contains('[NODOCS]') || commitMessage.contains('[NO-DOCS]') } }
                        }
                    }
                    environment {
                        AWS_DEFAULT_REGION    = 'eu-west-1'
                        AWS_ACCESS_KEY_ID     = credentials('aws-cicd-access-key-id')
                        AWS_SECRET_ACCESS_KEY = credentials('aws-cicd-secret-access-key')
                    }
                    steps {
                        script { slack.startStage() }

                        // Upload version to Verdaccio
                        echo "Deploy documentation"
                        echo "-> version: ${deployVersion}"
                        echo "-> bucket : ${docsBucketPrefix}/${deployVersion}"

                        unstash('docs')

                        // Download last metadata.json
                        sh("aws s3 cp '${docsBucketPrefix}/latest/metadata.json' ./versions.json")
                        sh(label: "Add version ${deployVersion} to metadata.json", script: "jq --indent 4 '.versions[\"${deployVersion}\"] |= \"https://storybooks.docs.openticket.tech/${docsPrefix}/${deployVersion}\"' versions.json > ./${docsDir}/metadata.json")

                        // Upload version
                        sh("aws s3 sync ./${docsDir} '${docsBucketPrefix}/${deployVersion}'")

                        lock(resource: "lib-valdatorjs-deploy-docs", inversePrecedence: true) {
                            // Disallows concurrency of the publish stage.
                            // Locks are acquired on a last in first out order
                            // and previous builds are discarded.

                            echo "Deploy latest docs to ${docsBucketPrefix}/latest"

                            // Abort al previous builds (that are still waiting for the lock because of inverse precedence).
                            milestone(ordinal: 700, label: 'Ensure overwriting latest with newer builds only')

                            // Sync latest
                            sh("aws s3 sync '${docsBucketPrefix}/${deployVersion}' '${docsBucketPrefix}/latest'")
                        }
                    }
                    post {
                        success { script { slack.finishStage('deployed') } }
                        failure { script { slack.finishStage('failure') } }
                        unstable { script { slack.finishStage('warning') } }
                        aborted { script { slack.finishStage('info', 'ABORTED') } }
                    }
                }
            }
        }
    }

    post {
        success { script { slack.finish('success') } }
        failure { script { slack.finish('failure') } }
        unstable { script { slack.finish('warning') } }
        aborted { script { slack.finish('info', 'ABORTED') } }
    }
}
