def envList = ['dev-env', 'qa-env']
def orgList = ['APIGEE_ORGANISATION_NAME']

// Parameters Separated with Separator
properties([
    parameters([
        [
          $class: 'ChoiceParameter',
          choiceType: 'PT_SINGLE_SELECT',
          description: 'Select the Organisation',
          name: 'ORGANISATION',
          script: [
              $class: 'GroovyScript',
              script: [classpath: [], sandbox: true, script: "return ${orgList.inspect()}"]
          ]
        ],
        [
            $class: 'ChoiceParameter',
            choiceType: 'PT_CHECKBOX',
            description: 'Check the Environment Name from the List',
            name: 'ENVIRONMENT',
            script: [
                $class: 'GroovyScript',
                script: [ classpath: [], sandbox: true, script: "return ${envList.inspect()}"
                ]
            ]
        ],
     separator(name: "CREATE_SHARED_FLOW", sectionHeader: "Create Shared Flow",
          separatorStyle: "border-width: 0",
          sectionHeaderStyle: """
            background-color: #7ea6d3;
            text-align: left;
            padding: 4px;
            color: #343434;
            font-size: 22px;
            font-weight: normal;
            text-transform: uppercase;
            font-family: 'Orienta', sans-serif;
            letter-spacing: 1px;
            font-style: italic;
          """
        ),
        [
          $class: 'DynamicReferenceParameter', 
          choiceType: 'ET_FORMATTED_HTML', 
          description: 'Enter the Shared Flow File Name to create in Apigee',
          name: 'SHARED_FLOW_FILE_NAME', 
          omitValueField: true,
          referencedParameters: 'ENVIRONMENT',
          script: [
              $class: 'GroovyScript', 
              fallbackScript: [
                  classpath: [],
                  sandbox: true,
                  script: 
                      'return [\'Error message\']'
              ], 
              script: [
                  classpath: [], 
                  sandbox: true,
                  script: 
                      """ 
                          html=""
                          if (ENVIRONMENT.contains('')){
                              html="<input name='value' value='' class='setting-input' type='text'>"
                          }
                          else {
                            
                              html="Enter value in SHARED_FLOW_FILE_NAME to enter the value"
                          }
                          return html
                      """
              ]
          ]
        ],
        separator(name: "DEPLOY_SHARED_FLOW", sectionHeader: "Deploy Shared Flow",
          separatorStyle: "border-width: 0",
          sectionHeaderStyle: """
            background-color: #7ea6d3;
            text-align: left;
            padding: 4px;
            color: #343434;
            font-size: 22px;
            font-weight: normal;
            text-transform: uppercase;
            font-family: 'Orienta', sans-serif;
            letter-spacing: 1px;
            font-style: italic;
          """
        ),
        [
          $class: 'DynamicReferenceParameter', 
          choiceType: 'ET_FORMATTED_HTML', 
          description: 'Enter the Shared Flow Name to deploy in Apigee',
          name: 'SHARED_FLOW_NAME', 
          omitValueField: true,
          referencedParameters: 'ENVIRONMENT',
          script: [
              $class: 'GroovyScript', 
              fallbackScript: [
                  classpath: [],
                  sandbox: true,
                  script: 
                      'return [\'Error message\']'
              ], 
              script: [
                  classpath: [], 
                  sandbox: true,
                  script: 
                      """ 
                          html=""
                          if (ENVIRONMENT.contains('')){
                              html="<input name='value' value='' class='setting-input' type='text'>"
                          }
                          else {
                            
                              html="Enter value in SHARED_FLOW_NAME to enter the value"
                          }
                          return html
                      """
              ]
          ]
        ],
        [
          $class: 'DynamicReferenceParameter', 
          choiceType: 'ET_FORMATTED_HTML', 
          description: 'Enter the Revision Number to deploy Shared Flow in Apigee(If not set, the highest revision is used)',
          name: 'REVISION', 
          omitValueField: true,
          referencedParameters: 'ENVIRONMENT',
          script: [
              $class: 'GroovyScript', 
              fallbackScript: [
                  classpath: [],
                  sandbox: true,
                  script: 
                      'return [\'Error message\']'
              ], 
              script: [
                  classpath: [], 
                  sandbox: true,
                  script: 
                      """ 
                          html=""
                          if (ENVIRONMENT.contains('')){
                              html="<input name='value' value='' class='setting-input' type='text'>"
                          }
                          else {
                            
                              html="Enter value in REVISION to enter the value"
                          }
                          return html
                      """
              ]
          ]
        ]
    ])
])

def selectedEnvs = params.ENVIRONMENT.split(',')
def selectedSharedFlows = params.SHARED_FLOW_FILE_NAME.split(',')
def selectedSharedFlowsDeploy = params.SHARED_FLOW_NAME.split(',')

pipeline {
    agent any
    environment {
          GCLOUD_DIR = "$JENKINS_HOME/google-cloud-sdk/bin"
          APIGEE_CLI_DIR = "$HOME/.apigeecli/bin"
    }
    stages {
        stage('Installing Dependencies') {
      steps {
          sh '''#!/bin/bash
                echo "Checking for pre-installed dependencies..."
                echo ""
                if [ ! -d "$GCLOUD_DIR" ]; then
                    echo "Installing GCloud CLI..."
                    echo ""
                    cd $JENKINS_HOME
                    curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-412.0.0-linux-x86_64.tar.gz
                    tar -xf google-cloud-cli-412.0.0-linux-*.tar.gz
                    ./google-cloud-sdk/install.sh -q
                    source $JENKINS_HOME/google-cloud-sdk/completion.bash.inc
                    source $JENKINS_HOME/google-cloud-sdk/path.bash.inc
                else--
                    echo "GCloud CLI is already Installed!"
                    echo ""
                fi

                if [ ! -d "$APIGEE_CLI_DIR" ]; then
                    echo "Installing Apigee CLI..."
                    echo ""
                    curl -L https://raw.githubusercontent.com/apigee/apigeecli/main/downloadLatest.sh | sh -
                    
                else
                    echo "Apigee CLI is already Installed!"
                    echo ""
                fi
             '''
      }
    }
        // Logging into GCloud
        stage('Logging into Google Cloud and Get Access Token') {
          steps {
            script {
                withCredentials([file(credentialsId: '<gcp_service_account>', variable: 'GOOGLE_SERVICE_ACCOUNT_KEY')]) {
                sh '${GCLOUD_DIR}/gcloud auth activate-service-account --key-file ${GOOGLE_SERVICE_ACCOUNT_KEY}'
                env.TOKEN = sh([script: "${GCLOUD_DIR}/gcloud auth print-access-token", returnStdout: true ]).trim()
              }
            }
          }
        }
        stage('Create Shared flows in Apigee') {
          steps {
            script {
          // Clone the repository
          checkout([$class: 'GitSCM', branches: [[name: "*/main"]], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'Automation-of-sharedflows-in-Apigee-using-Jenkins']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'github', url: 'https://github.com/knoldus/Automation-of-sharedflows-in-Apigee-using-Jenkins.git']]])

          for (sharedflows in selectedSharedFlows) {
           sh "$APIGEE_CLI_DIR/apigeecli sharedflows import -f ${WORKSPACE}/${sharedflows} -o ${params.ORGANISATION} -t ${env.TOKEN}"
          }
        }
      }
     }
     stage('Deploy Shared flows in Apigee') {
          steps {
            script {

          for (envs in selectedEnvs) {
              for (sharedflowsdeploy in selectedSharedFlowsDeploy) {

           sh "$APIGEE_CLI_DIR/apigeecli sharedflows deploy -e ${envs} -v ${params.REVISION} -n ${sharedflowsdeploy} -o ${params.ORGANISATION} -t ${env.TOKEN} -s ${SERVICEACCOUNT}"
              }
             }
            }
          }
        }
      }
   }

  
