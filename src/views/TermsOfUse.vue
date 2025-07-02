<template>
    <div class="py-12">
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div class="text-center mb-10">
                <h1 class="text-4xl font-extrabold tracking-tight">
                    Conditions Générales d'Utilisation
                </h1>
                <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">Dernière mise à jour : {{ lastUpdated }}</p>
            </div>
            <div class="prose prose-lg mx-auto dark:prose-invert">
                <p class="lead">
                    Bienvenue sur Kaniot ! En utilisant notre service, vous acceptez les présentes conditions. Veuillez
                    les lire attentivement.
                </p>

                <h3>Article 1 : Objet du Service</h3>
                <p>
                    Kaniot (le "Service") fournit une plateforme en ligne permettant aux utilisateurs de créer et de
                    gérer des cagnottes financières collectives dans le but de faciliter les dépenses de groupe,
                    l'organisation d'événements ou le financement de projets communs.
                </p>

                <h3>Article 2 : Inscription et Compte Utilisateur</h3>
                <p>
                    Pour utiliser certaines fonctionnalités, comme la création de cagnottes, une inscription est
                    nécessaire. Lors de votre inscription, nous collectons les informations suivantes :
                </p>
                <ul>
                    <li>Un nom d'utilisateur de votre choix.</li>
                    <li>Une adresse e-mail valide.</li>
                    <li>Un mot de passe.</li>
                </ul>
                <p>
                    Votre mot de passe est stocké de manière sécurisée et chiffrée, et n'est jamais visible en clair par
                    nos services. Vous êtes responsable de la confidentialité de vos informations de connexion et de
                    toutes les activités effectuées depuis votre compte.
                </p>

                <h3>Article 3 : Données Personnelles et Confidentialité (RGPD)</h3>
                <p>
                    La protection de vos données est notre priorité. Kaniot s'engage à respecter le Règlement Général
                    sur la Protection des Données (RGPD).
                </p>
                <p>
                    Les données collectées (nom d'utilisateur, e-mail) sont utilisées uniquement pour le bon
                    fonctionnement du Service : identification, communication liée à vos cagnottes et sécurisation de
                    votre compte.
                </p>
                <p class="font-semibold">
                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos
                    données. Vous pouvez à tout moment demander la suppression de votre compte depuis votre tableau de
                    bord ou en nous contactant.
                </p>
                <p>
                    La suppression de votre compte est une action <strong>définitive</strong>. Elle entraînera la
                    suppression
                    irréversible de l'ensemble de vos données personnelles associées à l'application, y compris votre
                    nom d'utilisateur, votre adresse e-mail, ainsi que les cagnottes que vous avez créées.
                </p>

                <h3>Article 4 : Responsabilité</h3>
                <p>
                    Kaniot est un outil de facilitation et ne peut être tenu responsable des litiges entre les
                    participants d'une cagnotte. L'utilisation du service se fait sous l'entière responsabilité des
                    utilisateurs.
                </p>

                <h3>Article 5 : Modifications des Conditions</h3>
                <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les nouvelles conditions
                    seront applicables dès leur publication sur cette page. Nous vous encourageons à consulter
                    régulièrement cette page.
                </p>

                <h3>Article 6 : Contact</h3>
                <p>
                    Pour toute question relative à ces conditions, vous pouvez nous contacter à l'adresse : <a
                        href="mailto:alexandrenobletpro@gmail.com">alexandrenobletpro@gmail.com</a>.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const lastUpdated = '2 juillet 2025';
</script>