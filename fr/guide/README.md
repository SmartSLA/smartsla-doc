# Aperçu

## Description
SmartSLA offre la possibilité pour les clients de créer des tickets de support / issues concernant les logiciels pris en charge dans le cadre d'un contrat et d'interagir avec des experts et des administrateurs.

Cela consiste en:

- application frontend construite en utilisant VueJS.
- Composant OpenPaaS en tant que backend, construit en utilisant nodeJS.


## Navigateurs supportés
SmartSLA utilise la bibliothéque d'interface utilisateur Vuetify qui est basé sur vue CLI version 3 ,vous n'êtes pas obligé d'ajouter les polyfills pour supporter Internet EXplorer 11 et Safari 9/10 .
C'est généréré automatiquement pour vous. 

| Navigateurs        | Supporté           |
| ------------- |:-------------:| -----:|
| <img  class="imgTable"  src="/assets/img/chrome.jpeg" />    Chrome     | ✓ |
| <img  class="imgTable"  src="/assets/img/firefox.png" />  Firefox     | ✓| 
| <img  class="imgTable"  src="/assets/img/safari.jpeg" />   Safari  10+  | ✓ | 
| <img  class="imgTable"  src="/assets/img/edge.png" />   Edge | ✓ |  
| <img  class="imgTable"  src="/assets/img/ie11.png" />   IE11 | ✓ |  
| <img  class="imgTable"  src="/assets/img/ie9.png" />   IE9/IE10 |X |  

## Installation

voici les étapes requises pour installer SmartSLA après avoir installé OpenPaas

### 1. installation du composant backend
  `$ ESN_PATH` est votre chemin d'installation openpaas
  `$ SMARTSLA_PATH` est votre chemin d'installation SmartSLA

  - cloner et installer le projet
  ```bash
  git clone https://ci.linagora.com/linagora/lgs/smartsla/smartsla-backend.git
  cd smartsla-backend
  npm i
  export SMARTSLA_PATH=$(pwd)
  ```
  - lier le module à OpenPaas
  ```bash
  cd $ESN_PATH/modules
  ln -s $SMARTSLA_PATH smartsla-backend
  ```

  - l'ajouter à la liste des modules
  ```bash
  vi $ESN_PATH/config/default.json
  ```
   ajoutez `smartsla-backend` au tableau des modules

  ```json
  ...
  "modules": [
  ...,
  "smartsla-backend"
  ],
  ...
  ```
  - exécuter ou redémarrer OpenPaas

  ### 2. installation de l'application frontend

  - cloner et installer le projet
  ```bash
  git clone https://ci.linagora.com/linagora/lgs/smartsla/smartsla-frontend.git
  cd smartsla-frontend
  npm i
  ```

  - lancer le serveur de développement
  ```bash
  npm run serve
  ```

  - en supposant qu'OpenPaas est déjà en cours d'exécution, le SmartSLA devrait être exécuté sur `http://localhost:8081`

  - construire le projet de production
  ```bash
  npm run build
  ```
  le projet construit est situé dans le dossier `dist` et peut être déployé sur n'importe quel serveur web (ex nginx)

## configuration

### 1. application frontend

  éditez le fichier `public/env/openpaas.js`:
  - `VUE_APP_OPENPAAS_URL` l'url de votre instance openpaas où le composant backend SmartSLA est installé.
  - `SSP_URL` votre URL SSP à utiliser pour réinitialiser les mots de passe des utilisateurs.
  - `LIMESURVEY_URL` l'url de votre instance limesurvey.
  - `SUPPORT_ACCOUNT` personnalisez vos informations SmartSLA

### 2. application backend

  - Définir l'API limesurvey dans la configuration:
  `http://limesurvey.smartsla.local` est l'url de notre instance limesurvey

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

  - Après avoir installé et exécuté limesurvey et postgresql, vous pouvez commencer à utiliser la page d'accueil de limesurvey.
  - Sinon, vous pouvez suivre la [procédure d'installation de limesurvey 2.0](https://manual.limesurvey.org/Installation_procedure_for_limesurvey_2.0).

    1. Cliquez sur Suivant jusqu'à atteindre l'écran de configuration de la base de données

      insérez ce qui suit dans les champs:
      ```
      Database type `PostgreSQL`
      Database location `pgsql`
      Database user `postgres`
      Database password `limesurvey`
      Database name `limesurvey`
      Table prefix `lime_`
      ```
    2. Activez the /admin/remotecontrol API:
    - Accédez à la page [http://limesurvey.smartsla.local/index.php/admin/globalsettings](http://limesurvey.smartsla.local/index.php/admin/globalsettings)
    - Sélectionnez l'onglet Interface
    - Activer l'API Publish **/admin/remotecontrol** (rpc_publish_api: 1)

    3. Importez l'enquête:
      - Accédez à http://limesurvey.smartsla.local/index.php/admin/survey/sa/newsurvey/tab/import
      - téléchargez: [limesurvey_survey_491487](https://ci.linagora.com/linagora/lgs/smartsla/smartsla-docker-dev/blob/master/assets/conf/limesurvey/limesurvey_survey_491487.lss)

    4. Initialisez les participants à l'enquête, un tableau pour notre enquête sera créé dans la base de données:
      - Cliquez sur **survey participants** et ensuite cliquez sur **Initialise participant table**
    5. Activez l'enquête:
      - Cliquez sur **activate this survey**
      - Sélectionner les paramétres des champs
      - Cliquez sur **Save & activate survey**

## 4. Utilisation de SmartSLA
  - la page d'administration est disponible sur `http://localhost:8081/administration`, vous pouvez utiliser vos identifiants d'administration openfaas pour vous connecter:
  ```
  email: admin@open-paas.org
  mot de passe: secret
  ```

### Tutoriel vidéo

  ![SmartSLA guides](/assets/img/smartsla_fr_playlist.png)

#### [Playlist SmartSLA : les tutos](https://www.youtube.com/playlist?list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 1 SmartSLA : Connexion à la solution et présentation de l'ergonomie de SmartSLA](https://www.youtube.com/watch?v=EjxUVHhaQis&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 2 SmartSLA : Fonctionnalités disponibles pour les experts en charge du support](https://www.youtube.com/watch?v=tGEGEUGX0bw&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 3 SmartSLA : Présentation des fonctionnalités disponibles pour les experts en charge du support](https://www.youtube.com/watch?v=zIhoOgzASQ4&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 4 SmartLSA : création d'un logiciel dans le catalogue de logiciels de la plateforme de support](https://www.youtube.com/watch?v=VhLX6MEuP9g&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 5 SmartSLA : Affectation de logiciels dans le périmètre d'un contrat de support](https://www.youtube.com/watch?v=-8JhOZbbH8w&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 6 SmartSLA : Paramétrage des niveaux de services d'un contrat de support](https://www.youtube.com/watch?v=1kkrLAryMdg&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 7 SmartSLA : Création d'un ticket d'anomalie par le bénéficiaire d'un contrat](https://www.youtube.com/watch?v=beJ5MXeeoBI&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 8 SmartSLA : Affectation et prise en charge d'un ticket par un expert du support](https://www.youtube.com/watch?v=FlpeDezFVSQ&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 9 SmartSLA : Traitement du ticket et résolution avec production d'un patch](https://www.youtube.com/watch?v=heWP3LxvklA&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)
  - [Tuto 10 SmartSLA : Clôture du ticket par le bénéficiaire](https://www.youtube.com/watch?v=a42BpUT-pxI&list=PLJxEmdZvbh8HgeiCFbgVNvvM_j-pMDrk1)

### avant de commencer

#### Création d'un logiciel, d'un client et d'un contrat
  1. Sélectionnez **Logiciels** &rarr; **Ajouter un nouveau logiciel**
      - Clique sur l'icône '**+**'
      - Remplissez le champ **Nom**
      - Appuyez sur **Créer**
  2. Sélectionnez **Clients** &rarr; **Ajouter un nouveau client**
      - Clique sur l'icône '**+**'
      - Remplissez le champ **Nom**
      - Appuyez sur **Créer**
  3. Sélectionnez **Contracts** &rarr; **Créer new contracts**
      - Clique sur l'icône '**+**'
      - Remplissez le champ **Nom**
      - Dans **Client** choisissez le **client que nous avons créé avant**
      - Remplissez les champs **Fuseau horaire**, **Heures d'ouverture**, **Début** et **Fin**
      - Appuyez sur **Créer**
  4. Dans la page **Détails du contrat**, remplissez les **Logiciels supportés**
      - Clique sur l'icône '**&#x270E;**' et sur le bouton '**+ AJOUTER**'
      - Remplissez le champs **Logiciel**, **Date du support**, **Critique**, **Version** et **OS**
      - Appuyez sur **Créer**
  5. Go back &#x2190; to the **Contract detail** page, fill each **Contractual commitments**
  5. Retournez &#x2190; à la page **Détails du contrat**, remplissez chacun **Engagements contractuels**
      - Clique sur l'icône '**&#x270E;**' et sur le bouton '**+ AJOUTER**'
      - Remplissez le champs **Type de demande**, **Sévérité**, **Identifiant** et **Plage horaire de traitement  Heures ouvrables**
      - Appuyez sur **Créer**

#### Creating des utlisateurs
  - Sélectionnez **Users** &rarr; **Créer new user**
  - Clique sur l'icône '**+**'
  - Choisir le **Type**
  - Dans le champ **Rechercher des utilisateurs**, recherchez un utilisateur LDAP.
  - Choisir le **Rôle**
  - Si le type **Bénéficiaire** est sélectionné &rarr;, vous devez également sélectionner le **Client** et **Contrats**
  - Appuyez sur **Créer**

### creation des tickets
1. allez à [la page d'accueil](http://localhost:8081/)
2. Sélectionnez **Nouvelle demande*** dans le menu
  - Remplissez le champ **Titre**
  - Sélectionnez le **Contrat**
  - Remplissez les champs **Type**, **Logiciel**, **Sévérité** et **Description**
  - Appuyez sur **Soumettre**

### types d'utilisateurs et rôles
  il y a deux types d'utilisateurs dans SmartSLA:
  - le **Bénéficiaire** est un client lié à un client et peut créer, voir et répondre à ses tickets
  - l'**Expert** fait partie de l'équipe traitant les problèmes

  Les rôles utilisateur sont expliqués dans le tableau suivant:

|          TYPE         |                 |             Bénéficiaire            |               Expert               | Admin OP |         |               |                |
|:---------------------:|:---------------:|:----------------------------------:|:----------------------------------:|:--------:|:-------:|:-------------:|:--------------:|
|          ROLE         |                 |               Viseur               |             Bénéficiaire            |  Expert  | Manager | Administrateur | Administrateur de la plateforme |
|        TICKETS        |    List / Get   |                                    | Uniquement ceux liés à ses contrats |     ✓    |         |       ✓       |        ✓       |
|                       |      Créer     |                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |
|                       |      Mettre à jour     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |     Commenter     |                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |
|                       | Commenter en privé |                                    |                  X                 |     ✓    |         |       ✓       |        ✓       |
|                       |     Archiver     |                                    |                  X                 |     X    |         |       X       |        X       |
|                       |                 |                                    |                                    |          |         |               |                |
| UTILISATEURS /ÉQUIPES /CLIENTS |    List / Get   | Uniquement ceux liés à ses contrats | Uniquement ceux liés à ses contrats |     ✓    |         |       ✓       |        ✓       |
|                       |      Créer     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Mettre à jour     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Supprimer     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |                 |                                    |                                    |          |         |               |                |
|       LOGICIELS       |    List / Get   | Uniquement ceux liés à ses contrats | Uniquement ceux liés à ses contrats |     ✓    |         |       ✓       |        ✓       |
|                       |      Créer     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Mettre à jour     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |      Supprimer     |                                    |                  X                 |     X    |         |       ✓       |        ✓       |
|                       |                 |                                    |                                    |          |         |               |                |
|       CONTRATS       |    List / Get   |         Seuls ses contrats       |         Seuls ses contrats       |     ✓    |         |       ✓       |        X       |
|                       |      Créer     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |      Mettre à jour     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |      Supprimer     |                                    |                  X                 |     X    |         |       ✓       |        X       |
|                       |                 |                                    |                                    |          |         |               |                |
|        Profile        | Obtenez propre profil|                                    |                  ✓                 |     ✓    |         |       ✓       |        ✓       |

<div align="center" class="footer">
  <img src="/assets/img/linagora.png" />
  <p>© SmartSLA - Developé et supporté par Linagora, 2019-2020.</p>
</div>
