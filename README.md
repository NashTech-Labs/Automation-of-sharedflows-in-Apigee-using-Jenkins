# SharedFlows in Apigee

In Apigee, a shared flow is a reusable component or a set of policies and logic that can be applied across multiple API proxies. Shared flows provide a way to encapsulate common functionality, such as security, logging, transformation, or error handling, and share it across multiple APIs or API proxies within an organization.

## Create and Deploy SharedFlows in Apigee using Jenkins

This repository contains Jenkinsfile which has script for creating and deploying sharedflows in Apigee environments.

For using this template we have to update our Apigee organisation name and credentials in jenkinsfile for parameter:

`def orgList = ['APIGEE_ORGANISATION_NAME']`

`credentialsId: '<gcp_service_account>'`


Create a Jenkins pipeline using this repository and build that pipeline by passing parameters to it. You can select multiple envs at the same time in parameter. Mention here the name of sharedflow folder.


![jenkins_pipeline](https://i.postimg.cc/VvxsWDGd/Screenshot-from-2023-07-15-18-58-31.png)


Build the pipeline and it will create and deploy sharedflow in Apigee envs.

To verify this move to:

Apigee > Develop > Shared Flows
