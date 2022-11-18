Core Business Dashboard
==

# Overview
The web application that allows Car Operation Agents (COAs) to

1. Manage shifts
2. Manage loonshot vehicles
3. Manage geofence areas
4. Manage partner settings
5. View partner performance

### Sources
👉 Info about all loonshot related services can be found [here](https://confluence.taxibeat.com/display/DPT/LSHOT-1+-+Services)  
👉 Details about Core Business Dashboard business logic can be found [here](https://confluence.taxibeat.com/display/TECH/Core-Business+Dashboard)

# Glossary

|Term   |Description                              |
|----   |-----------                              |
|Partner|loonshot driver - driver employed by Beat|

# Technical Info

## Tech Stack
| Type          | Item                          | Version           |
| ------------- | ---------                     | -------           |
| Language      | Typescript / JavaScript       | ^4.2.2 / ESNext   |
| Framework     | ReactJS                       | ^16.13.1          |
| Configuration | Prettier                      | ^1.19.1           |
| E2E Tests    | Cypress                        | ^4.9.0            |

## API Integration
All API calls and error handling happens on `api.ts` file, located under `src > data` directory.

## Tool Integrations

| Type          | Provider    |                                                                       |
| ------------- | ---------   | --------------------                                                  |  
| Notifications | Slack       |[#monitoring-int-tools](https://taxibeat.slack.com/archives/CFU99GETE) |


# Developers Handbook
## Build and Run

⚠️ You need `node v.11.x.x` or higher (no higher than `v.14.x.x`) in order for Core Business Dashboard to run properly

**1. Resolve all dependencies:**

> yarn install

**2. Create an `.env.local` file under the root folder:**  
In order to run the app locally you will need to override the environment variables with the values of the relative sandbox / kubestack. The environment variables needed for the Core Business Dashboard can be found under `src > data > environment.ts`

Example:
```
REACT_APP_ENVIRONMENT=sandbox
REACT_APP_REGION=dev
REACT_APP_CORE_BUSINESS_BFF_API=https://SANDBOX_PLACEHOLDER-core-business-dashboard-bff.private.testing.thebeat.co
```

**3. And run it locally:**

> yarn start

_The portal is available on http://localhost:4023 by default._

**4. Run Cypress Test Scripts**

* In order to run tests locally we need to assign the kubestack's info inside cypress.json:

```
"baseUrl": "https://$KUBESTACK_PREFIX-core-business-dashboard.k8s.testing.thebeat.co",
"CB_URL": "https://$KUBESTACK_PREFI-core-business.private.k8s.testing.thebeat.co"",
"MYSQL_PORT": "3306",
"MYSQL_USER": "root",
"MYSQL_PASSWORD": "a123456",
"REST_MYSQL_DATABASE": "sandbox_$KUBESTACK_NAME",
"MYSQL56_HOST": "mysql56.$KUBESTACK_NAME",
"MYSQL57_HOST": "mysql57.$KUBESTACK_NAME",
"CB_MYSQL_DATABASE": "core-business",
```
Then run: `yarn suiteName` --> Name of which suite to run under `package.json > scripts`

Example: `yarn e2e`

* In order to run tests in Jenkins, the env variables should be defined with export, as:

Example:
```
export cypress_baseUrl=http://42m4-core-business-dashboard.k8s.testing.thebeat.co cypress_CB_URL=http://42m4-core-business.private.k8s.testing.thebeat.co cypress_MYSQL56_HOST=mysql56.sbe-blah-blah cypress_MYSQL57_HOST=mysql57.sbe-blah-blah cypress_REST_MYSQL_DATABASE=sandbox_42m4 && yarn e2e
```

5. Build the app:

> yarn build

## CI/CD links
* [Kubestack](https://jenkins.private.k8s.management.thebeat.co/view/Kubestack/job/kubestack-services/job/core-business-dashboard/)
* [Deployment](https://jenkins.private.k8s.management.thebeat.co/job/core-business-dashboard-k8s/)

## Coding Conventions
The project follows the [Frontend Guidelines & Conventions](https://confluence.taxibeat.com/pages/viewpage.action?pageId=62686103).

## Troubleshooting
* **Installing the beat-ui library:**
    - If it's the very first time you run yarn install, you will encounter an error that prompts you to set the npm token needed to access the private registry from where the beat theme will be installed. To set the npm Token run: `npm config set //registry.npmjs.org/:_authToken=${npmToken}`
    - Find the npmToken on npm dashboard via OneLogin
* **Adding auth cookie manually:**
    - There are cases that you might need to add the jwt token manually on you localhost. To do so, open the browser console and type: `document.cookie='jwt=Bearer ${jwtToken}'`.
    - You can get the token from the browser's application tab on production app.
* **Avoiding CORS issue on localhost:**
    - Run the app locally on Chrome without security (recommended only for localhost). To do so, open your terminal and type:
  ```
  open -na Google\ Chrome --args --user-data-dir=/tmp/temporary-chrome-profile-dir --disable-web-security --disable-site-isolation-trials	
  ```
