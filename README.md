![image](public/assets/img/big_logo.png){ width="280" height="200" style="display: block; margin: 0 auto}

# OC Projet 6: Just Stream It
Ce projet s'inscrit dans le cadre du parcours "Développeur d'application Python" sur OpenClassrooms. Il consiste à créer un site web permettant de visualiser en temps réel un classement de films les mieux noté. L'objectif est d'intégrer une maquette en HTML et CSS, responsive aux formats tablette et smartphone, de récupérer les données via une API REST en local, et de rendre le site dynamique en vanilla JavaScript.

## 1. Installation et lancement de l'API OCMovies
Pour installer l'API REST en local, nécessaire au fonctionnement du site web, veuillez suivre la documentation disponible dans ce repository GitHub:  
https://github.com/OpenClassrooms-Student-Center/OCMovies-API-EN-FR  
Lancer le serveur de l'API après installation complète:
```
python manage.py runserver
```

## 2. Lancement du serveur

#### Option 1 > Node.js et Express
Il faut que Node.js et Express soit installés pour lancer l'application.
Pour installer Express:
```
npm install express
```

Lancer le serveur de l'application avec Node.js
```
node app.js
```

Le site web est maintenant disponible en local sur le port 5000: <http://localhost:5000/>

#### Option 2 > Live server sur VScode
Il faut que l'extention Live Server soit installé sur VScode.
Ouvrir le dossier public dans VScode et lancer le live server > Go live
