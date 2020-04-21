# Using SmartSLA with docker

## Aperçu

Déployez facilement un SmartSLA basé sur OpenPaaS à l'aide de Docker et de docker-compose.

Par défaut, la version utilisée est la dernière version stable des produits OpenPaaS, mais vous pouvez également essayer la version actuellement en cours de développement des composants (en utilisant le mode `aperçu` )

*Avertissement: ce dépôt est destiné à 2 cas d'utilisation uniquement: **une démonstration** et **développement / débogage**.*
*Vous ne devriez jamais l'utiliser comme une instance de production car il manque des configurations importantes pour sécuriser vos données et pérenniser le produit.*

## avant de commencer
> Docker est disponible [ici](https://www.docker.com/products/docker) et docker-compose [ici](https://docs.docker.com/compose).
> Assurez-vous qu'ils sont installés sur votre système avant de démarrer.
> NB: vous pouvez également installer docker-compose à l'aide de l'outil pip Python, voir ci-dessous:

  ```bash
  # Utilisation du paquet python (vous devez utiliser python virtualenv, cf virtualenvwrapper)  pip install docker-compose
  ```
### Déclaration des Vhosts

Comme il n'y aura pas de résolution DNS dans votre environnement local, vous devez modifier votre fichier /etc/hosts pour ajouter de nouvelles entrées.

De cette façon, l'accès à http://frontend.smartsla.local avec votre navigateur se résoudra sur votre ordinateur local.

Ajoutez ce qui suit dans votre fichier `/etc/hosts`:
```
172.99.0.1      frontend.smartsla.local backend.smartsla.local limesurvey.smartsla.local
```  
## Utilisation
### Clonez le dépôt
```bash
git clone ssh://git@ci.linagora.com:7999/linagora/lgs/smartsla/smartsla-docker-dev.git
# ou
git clone https://github.com/smartsla/smartsla-docker-dev.git
# aprés
cd smartsla-docker-dev
```
### choisir la partie de la plateforme que vous souhaitez exécuter
Par défaut, la commande `docker-compose` recherchera un fichier nommé `docker-compose.yml` dans le répertoire courant. Dans ce dépôt, cela démarrera les services communs de base nécessaires pour un SmartSLA (LDAP, OpenPaaS ...) mais ne démarrera pas la plate-forme entière, donc vous manquerez la plupart des interfaces et des applications.

Cela vous permet de choisir la partie de la plate-forme que vous souhaitez exécuter, car la plate-forme entière peut être assez lourde à exécuter sur une seule machine.

Pour choisir quoi exécuter ou non, vous devrez utiliser un fichier `.env`, qui spécifie votre [` COMPOSE_FILE`](https://docs.docker.com/compose/reference/envvars/#compose_file) variable env .

Pour le faire facilement, vous pouvez simplement exécuter:
```bash
cp .env.sample .env
```
Dans ce fichier, vous trouverez quelques exemples de configuration commentés. Vous pouvez simplement décommenter la ligne que vous souhaitez utiliser ou créer la vôtre.

Remarques:
- Vous devez exécuter `docker-compose down --volumes --remove-orphans` et `docker-compose up -d` lors du changement de configuration, pour éviter les conteneurs orphelins.
- Vous devez avoir une seule ligne sans commentaire dans ce fichier pour éviter un remplacement de configuration indésirable.

## Commencer à jouer

Vous êtes maintenant prêt!
Vous pouvez maintenant utiliser toutes les commandes fournies par l'outil `docker-compose`.
Voir: https://docs.docker.com/compose/reference/

Pour accéder à la plateforme, vérifiez l'URL configurée dans la section [Déclaration des Vhosts](#declaration-des-vhosts).
Les comptes d'utilisateurs de test se trouvent dans le fichier `users.created.txt`.

### Commandes de survie de docker-compose de base

#### Pour la récupération initiale ou pour mettre à jour des images locales
```bash
docker-compose pull
```
#### "Up & Down" contre "Start & Stop"

Par défaut, l'exécution de `docker-compose up` créera et démarrera tous les conteneurs devant.
Mais lorsque vous quittez la commande, les conteneurs seront détruits et les données ne seront pas conservées (équivalent à l'exécution de `docker-compose down --volumes`).

Si vous souhaitez conserver temporairement vos conteneurs et les données qu'ils contiennent, vous pouvez utiliser start & stop:
```bash
docker-compose up -d    # Créez des conteneurs et démarrez-les en arrière-plan
docker-compose stop     # Arrêtez tous les conteneurs, mais conservez-les
docker-compose start    # Redémarrez les conteneurs existants qui ont été arrêtés
docker-compose down -v  # Arrêtez & supprimez tous les conteneurs, volumes locaux et réseaux
```
*Remarque: les conteneurs doivent être considérés comme consommables. Cela signifie que vous ne devez pas compter sur start & stop pour enregistrer les données que vous souhaitez conserver à long terme!*
*Voir la section `Persistance des données` ci-dessous.*

#### Surveillez l'état de vos conteneurs:
```bash
docker-compose ps
```

Les conteneurs init doivent se terminer par la sortie 0. Sinon, relancez: `docker-compose up`

#### Voir les journaux de tous les conteneurs
```bash
docker-compose logs         # Afficher les logs
docker-compose logs -f      # suivre les logs
docker-compose logs -f esn  # vuivre les logs de service ESN
```

#### Supprimer les conteneurs créés précédemment
```bash
docker-compose down -v
```
**Astuce**: Si vous voulez une commande rapide pour détruire votre environnement et le rafraîchir complètement, ajoutez ce qui suit à votre `~/.bashrc` ou` ~/.zshrc`:

```bash
alias sarra="docker-compose pull && docker-compose down --volumes && docker-compose up -d"
```
## Modes disponibles
Nous comptons sur compose pour fournir certaines configurations personnalisées, en remplaçant les fichiers de composition de base à l'aide de la variable env `COMPOSE_FILE`.

Pour activer un mode, votre `COMPOSE_FILE` doit référencer les fichiers suivants, **dans cet ordre**:
1. `docker-compose.yml`, obligatoire pour toutes les configurations
2. `docker-compose.[mode].yml`, ne peuvent pas être utilisés seuls, ils ne remplacent qu'une partie `docker-compose.yml`

Les modes disponibles sont les suivants:
* [`Run, Test, Demo`](#mode-test-demo): utiliser la version finale des produits
* [`Preview`](#preview-mode): utiliser la version inédite des produits, actuellement en développement, au lieu de la dernière version stable publiée
* [`Mode de développement`](#mode-de-developpement): débrancher un produit de la plateforme de docker, pour utiliser votre environnement de développement en cours d'exécution localement en dehors de docker

Votre instance ESN est accessible à l'URL http://backend.smartsla.local
Votre instance SmartSLA est accessible à l'URL http://frontend.smartsla.local

### Mode test / démo

Ce mode vous permet d'utiliser la version récente des produits SmartSLA.

Vous devez exporter dans votre `COMPOSE_FILE` env le` docker-compose.yml`.
Exemple de contenu `.env` avec ESN:

```
COMPOSE_FILE=docker-compose.yml
```
De cette façon, vous obtenez la version récente de frontend et backend SmartSLA.

### Mode aperçu
Ce mode vous permet d'utiliser les images les plus récentes des produits SmartSLA, c'est-à-dire la version inédite en cours de développement.

Vous devez exporter dans votre environnement `COMPOSE_FILE` le` docker-compose.preview.yml` **en plus de** `docker-compose.yml` de base.
Exemple de contenu `.env` avec ESN:
```
COMPOSE_FILE=docker-compose.yml:docker-compose.preview.yml
```

De cette façon, vous obtenez la version la plus récente du frontend et du backend de SmartSLA.

### Mode de développement

Pour utiliser le mode dev, vous devez exporter dev docker-compose, ajouter le module `backend` et` frontend`, créer et démarrer tous les conteneurs et configurer ESN et SmartSLA pour pouvoir l'exécuter **dans cet ordre**:

Vous devez exporter dans votre `COMPOSE_FILE` env le` dev docker-compose` pour `backend` et` frontend` **en plus de** la base `docker-compose.esn.yml`
Exemple de contenu `.env` avec ESN:
```
COMPOSE_FILE=docker-compose.yml:docker-compose.dev-backend.yml:docker-compose.dev-frontend.yml
```

De cette façon, vous obtenez LDAP en cours d'exécution dans Docker et un proxy inverse léger au lieu d'ESN, qui transfère tout le trafic vers votre serveur nodejs ESN en cours d'exécution localement.

* Vous devez effectuer d'autres étapes pour [`Mode de développement backend`](#mode-de-developpement-backend) et pour [`Mode de développement frontend`](##mode-de-developpement-frontend)

#### Mode de développement backend

Pour utiliser le mode de développement backend, vous devez exporter le composant dev docker-compose, ajouter le module `smartsla-backend`, créer et démarrer tous les conteneurs et configurer ESN et SmartSLA pour pouvoir l'exécuter **dans cet ordre**:

1. Vous devez exporter dans votre environnement `COMPOSE_FILE` le `docker-compose.dev-backend.yml` **en plus de** le `docker-compose.esn.yml` de base
Exemple de contenu `.env` avec ESN:
```
COMPOSE_FILE=docker-compose.yml:docker-compose.dev-backend.yml
```

De cette façon, vous obtenez LDAP en cours d'exécution dans Docker et un proxy inverse léger au lieu d'ESN, qui transfère tout le trafic vers votre serveur nodejs ESN en cours d'exécution localement.

2. Vous devez également ajouter localement le module `smartsla-backend`.
```bash
cd ..
git clone ssh://git@ci.linagora.com:7999/linagora/lgs/smartsla/smartsla-backend.git
# ou
git clone https://github.com/smartsla/smartsla--backend.git
# aprés
cd smartsla-backend
npm i
```

3. Vous devez ajouter `esn` localement et créer un lien symbolique` smartsla-backend`.
```bash
cd ..
git clone ssh://git@ci.linagora.com:7999/linagora/lgs/openpaas/esn.git
# ou
git clone https://github.com/linagora/openpaas-esn.git
# aprés
cd esn
npm i
```

```bash
cd modules
ln -s ../../smartsla-backend/ smartsla-backend
```
4. Déclarez le module `smartsla-backend` à la liste des modules esn.

vous devrez utiliser un fichier `default.dev.json`, qui spécifie votre liste de modules pour l'environnement de développement. Pour ce faire facilement, vous pouvez simplement exécuter:

```bash
cd ../config
cp default.json default.dev.json
```

Ajoutez `smartsla-backend` à la liste des modules
```bash
  ...
  "modules": [
  ...,
  "smartsla-backend"
  ],
  ...
```

5. Vous devez exécuter `docker-compose up -d` pour créer et démarrer tous les conteneurs.
```bash
docker-compose up -d 
```

6. Allez dans le dossier `ESN` pour ajouter une configuration afin qu'OpenPaaS sache comment se connecter à sa base de données MongoDB exécutée dans Docker. Cela est possible avec l'OpenPaaS CLI.


Générez d'abord le fichier `config/db.json`. Ceci sera utilisé par l'application nodejs pour se connecter à sa base de données MongoDB exécutée dans docker. Ajoutez une configuration pour qu'OpenPaaS sache comment accéder aux services:

```bash
cd ../
export ELASTICSEARCH_HOST=localhost
export REDIS_HOST=localhost
export MONGO_HOST=localhost
export AMQP_HOST=localhost
export CURRENT_DOMAIN_ADMIN=admin@open-paas.org
node ./bin/cli.js db --host 172.17.0.1
node ./bin/cli configure
node ./bin/cli elasticsearch --host $ELASTICSEARCH_HOST --port $ELASTICSEARCH_PORT
node ./bin/cli domain create --email ${CURRENT_DOMAIN_ADMIN} --password secret --ignore-configuration
node ./bin/cli platformadmin init --email "${CURRENT_DOMAIN_ADMIN}"
```
*172.17.0.1 est pour linux. C'est l'IP où MongoDB lancé par docker-compose ci-dessus peut être atteint. Vous devrez définir votre IP docker-machine sur OS X ou Windows.*

*Ne doit être effectué que pour la première fois ou après une `docker-compose down -v`*

7. Exécutez ESN et smartsla-backend localement.

Démarrez le serveur ESN en mode développement:

```bash
cd ../
grunt dev
```

Votre serveur ESN local doit:
- Écoutez sur le port `8080`
- Connectez-vous à MongoDB fonctionnant dans le docker, exposé sur `localhost:27017`
- Connectez-vous à Redis fonctionnant dans docker, exposé sur `localhost:6379`
- Connectez-vous à Rabbitmq fonctionnant dans docker, exposé sur `localhost:5672`
- Connectez-vous à ElasticSearch fonctionnant dans docker, exposé sur `localhost:9200`
- Faire configurer le compte administrateur de la plateforme `admin@open-paas.org` (pour cela, voir `node ./bin/cli.js db --host 172.17.0.1`)


8. Exécutez le job `esn-init`

Une fois ESN opérationnel, le travail `esn-init` exécuté dans docker appellera son API et configurera d'autres paramètres comme le domaine, la connexion LDAP ...
```bash
docker-compose up -d esn-init
```

#### Mode de développement frontend

Pour utiliser le mode dev, vous devez exporter dev docker-compose, ajouter le module frontal `SmartSLA`, créer et démarrer tous les conteneurs, configurer ESN et SmartSLA pour pouvoir l'exécuter **dans cet ordre**:

1. Vous devez exporter dans votre environnement `COMPOSE_FILE` le` docker-compose.dev-frontend.yml` **en plus de** `docker-compose.esn.yml` de base

Exemple de contenu `.env` avec ESN:
```
COMPOSE_FILE=docker-compose.yml:docker-compose.dev-frontend.yml
```

De cette façon, vous obtenez LDAP en cours d'exécution dans Docker et un proxy inverse léger au lieu d'ESN, qui transfère tout le trafic vers votre serveur nodejs ESN en cours d'exécution localement.

2. Vous devez ajouter le module `smartsla-frontend` localement.
```bash
cd ../
git clone ssh://git@ci.linagora.com:7999/linagora/lgs/smartsla/smartsla-git
# ou
git clone https://github.com/smartsla/smartsla-frontend.git
# aprés
npm i
```

3. Démarrez le serveur frontal SmartSLA en mode développement:

```bash
npm run serve
```

## Démarrage rapide
Une fois que tout est en cours d'exécution, vous pouvez commencer à utiliser SmartSLA [page d'accueil](http://frontend.smartsla.local).

Votre ESN peut maintenant être parcouru jusqu'à [backend.smartsla.local](http://backend.smartsla.local).

Vous pouvez vous connecter avec l'utilisateur administrateur par défaut:
```
Nom d'utilisateur: admin@open-paas.org
Mot de passe: secret
```

Vous pouvez également vous connecter en tant que n'importe quel autre utilisateur de démo, les comptes d'utilisateurs sont dans le fichier `users.created.txt`.
