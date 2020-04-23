# Overview

## Description
SmartSLA adds the ability for clients to create support tickets / issues concerning supported software under a scope of a contract and interact with experts and admins.


it consists of:

- frontend app built using VueJS.
- OpenPaaS component as backend, built using nodeJS.

## Installation

here are the steps required to install SmartSLA after you have installed OpenPaas

### 1. install the backend component

  `$ESN_PATH` is your openpaas installation path
  `$SMARTSLA_PATH` is your SmartSLA installation path

  - clone and install the project
  ```bash
  git clone https://ci.linagora.com/linagora/lgs/smartsla/smartsla-backend.git
  cd smartsla-backend
  npm i
  export SMARTSLA_PATH=$(pwd)
  ```
  - link the module to OpenPaas
  ```bash
  cd $ESN_PATH/modules
  ln -s $SMARTSLA_PATH smartsla-backend
  ```

  - add it to the modules list
  ```bash
  vi $ESN_PATH/config/default.json
  ```
  add `smartsla-backend` to the modules array

  ```json
  ...
  "modules": [
  ...,
  "smartsla-backend"
  ],
  ...
  ```

  - run or restart OpenPaas

### 2. install the frontend app

  - clone and install the project
  ```bash
  git clone https://ci.linagora.com/linagora/lgs/smartsla/smartsla-frontend.git
  cd smartsla-frontend
  npm i
  ```

  - run the development server
  ```bash
  npm run server
  ```

  assuming OpenPaas is already running, the SmartSLA should be running on `http://localhost:8081`

  - build the project for production
  ```bash
  npm run build
  ```
  the built project is located in `dist` folder and can be deployed in any web server ( ie nginx )

## configuration

### 1. frontend app

  edit the `public/env/openpaas.js` file:
  - `VUE_APP_OPENPAAS_URL` your openpaas instance url where the SmartSLA backend component is installed.
  - `SSP_URL` your SSP url to be used to reset user passwords.
  - `LIMESURVEY_URL` your limesurvey instance url.
  - `SUPPORT_ACCOUNT` customize your SmartSLA information

### 2. backend app

  - Set the limesurvey API in the configuration:
  `http://limesurvey.smartsla.local` is our limesurvey instance url
  ```bash
  export $ESN_URL="http://localhost:8080/"
  export $ESN_ADMIN="admin@open-paas.org"
  export $ESN_PASS="secret"
  curl -X PUT -H 'Accept: application/json' -H 'Content-Type: application/json' $ESN_URL -u "$ESN_ADMIN:$ESN_PASS"  -d '[
    {
      "name": "smartsla-backend",
      "configurations": [
        {
          "name": "limesurvey",
          "value": {
            "surveyId": 491487,
            "apiUrl": "http://limesurvey.smartsla.local/index.php/admin/remotecontrol/",
            "username": "admin",
            "password": "password"
          }
        }
      ]
    }
  ]'
  ```
### 3. limesurvey

  - After installing and running limesurvey and postgresql, you can start using limesurvey home page.
  - Otherwise You can follow the [installation procedure for limesurvey 2.0](https://manual.limesurvey.org/Installation_procedure_for_limesurvey_2.0).

    1. Click Next until you reach the Database configuration screen
      
      insert the following in the fields:
      ```
      Database type `PostgreSQL`
      Database location `pgsql`
      Database user `postgres`
      Database password `limesurvey`
      Database name `limesurvey`
      Table prefix `lime_`
      ```

    2. Activate the /admin/remotecontrol API:

      - Go to [http://limesurvey.smartsla.local/index.php/admin/globalsettings](http://limesurvey.smartsla.local/index.php/admin/globalsettings) page
      - Select Interface tab
      - Enable Publish **/admin/remotecontrol API** (rpc_publish_api: 1)

    3. Import the survey:
      - Go to http://limesurvey.smartsla.local/index.php/admin/survey/sa/newsurvey/tab/import
      - Import survey : [limesurvey_survey_491487](https://ci.linagora.com/linagora/lgs/smartsla/smartsla-docker-dev/blob/master/assets/conf/limesurvey/limesurvey_survey_491487.lss)


    4. Initialize the survey participants, a table for our survey will be created in the database:

      - Click on **survey participants** and after that  click on **Initialise participant table**
    
    5. Activate  the survey:

      - Click on **activate this survey**
      - Select params fields
      - Click on **Save & activate survey**

## 4. using SmartSLA

  - the admininstration page is available at `http://localhost:8081/administration`, you can use your openpaas admin credentials to login:
  ```
  email: admin@open-paas.org
  password: secret
  ```
### before starting

#### Creating a Software, Client and Contract
  1. Select **Software** &rarr; **create new software**
      - Click on the '**+**' icon
      - Fill in the field **Name**
      - Hit **Create**
  2. Select **Clients** &rarr; **create new client**
      - Click on the '**+**' icon
      - Fill in the field **Name**
      - Hit **Create**
  3. Select **Contracts** &rarr; **create new contracts**
      - Click on the '**+**' icon
      - Fill the field **Name**
      - In **Client** choose the **client we created before**
      - Fill in thefields **Timezone**, **Business hours**, **Start date** and **End date**
      - Hit **Create**
  4. In **Contract detail** page, fill in **Supported software**
      - Click on the '**&#x270E;**' icon and on the '**+ ADD**' button
      - Fill in the fields **Software**, **Start date**, **Critical**, **Version** and **OS**
      - Hit **Create**
  5. Go back &#x2190; to the **Contract detail** page, fill each **Contractual commitments**
      - Click on the '**&#x270E;**' icon and on the '**+ ADD**' button
      - Fill in the fields **Request type**, **Severity**, **Ossa identifier** and **Treatment time range of Business hours**
      - Hit **Create**
#### Creating Users

  - Select **Users** &rarr; **create new user**
  - Click on the '**+**' icon
  - Choose the **Type**
  - In the **Search users** field, find an LDAP user.
  - Choose the **Role**
  - If **Beneficiary** type is selected &rarr;, you need also to select **Client** and **Contracts**
  - Hit **Create**

### creating an issue

1. go to [the home page](http://localhost:8081/)
2. Select **New issue** in the menu
    - Fill in the **Title** field
    - Select the **Contract**
    - Fill in the **Type**, **Software**, **Severity** and ***Description** fields
    - Hit **Submit**

### user types and roles
  there are two types of users in SmartSLA:
  - the **Beneficiary** is a customer linked to a client and can create, see and respond to tickets
  - the **Expert** is part of the team handling the issues

  User roles is explained in the following table :

|          TYPE         |                 |             Beneficiary            |               Expert               | Admin OP |         |               |                |
|:---------------------:|:---------------:|:----------------------------------:|:----------------------------------:|:--------:|:-------:|:-------------:|:--------------:|
|          ROLE         |                 |               Viewer               |             Beneficiary            |  Expert  | Manager | Administrator | Platform Admin |
|        TICKETS        |    List / Get   |                                    | Only those linked to its contracts |     ✓    |         |       ✓       |        ✓       |
|                       |      Create     |                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |
|                       |      Update     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |     Comment     |                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |
|                       | Comment private |                                    |                  X                 |     ✓    |         |       ✓       |        ✓       |
|                       |     Archive     |                                    |                  X                 |     X    |         |       X       |        X       |
|                       |                 |                                    |                                    |          |         |               |                |
| USERS /TEAMS /CLIENTS |    List / Get   | Only those linked to its contracts | Only those linked to its contracts |     ✓    |         |       ✓       |        ✓       |
|                       |      Create     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Update     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Delete     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |                 |                                    |                                    |          |         |               |                |
|       SOFTWARE       |    List / Get   | Only those linked to its contracts | Only those linked to its contracts |     ✓    |         |       ✓       |        ✓       |
|                       |      Create     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Update     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Delete     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |                 |                                    |                                    |          |         |               |                |
|       CONTRACTS       |    List / Get   |         Only his contracts         |         Only his contracts         |     ✓    |         |       ✓       |        X       |
|                       |      Create     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |      Update     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |      Delete     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |                 |                                    |                                    |          |         |               |                |
|        Profile        | Get own profile |                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |

<div align="center" class="footer">
  <img src="/assets/img/linagora.png" />
  <p>© SmartSLA - Developed and supported by Linagora, 2019-2020.</p>
</div>