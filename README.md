
Sheet Music Hosting App - React, next.js

Ben Wasden: "All we have to decide is what to do with the time that is given us." - Gandalf, JRR Tolkien

Jim Eberhard: "Shine on, like the sun, the moon, and the stars. Even the dimmest star shines bright somewhere."

Happiness Ncube: "For as he thinketh in his heart, so is he" - Proverbs 23:7 (KJV).

Boitumelo Hebert Meletse: “Success is not only about achieving your goals, but about lifting others as you rise, staying faithful through challenges and becoming the person God created you to be.”

Description:
Purpose
A small music publishing company has started to create sheet music for download. Sheet music currently is for multi-part vocal, sometimes with piano accompaniment. The publishing company works with other songwriters, who make arrangements to public domain songs or have acquired a license to produce sheet music so the sheet music can be sold. Some songwriters have written their own music as well, and so they own the copyrights but need an outlet to sell their music.
A website needs to be made, for users and suppliers (songwriters). Users would purchase and download the music. Writers would upload their music.

Features
Users:
	Search for music
	Login (or create login if 1st time user) and Purchase music
	Download PDF music from their purchases

Songwriters:
	Create login – input information
	Add Sheet music.  Songwriter must verify they own the copyright or has the permission to sell the sheet music.  Upload a pdf file. Determines the price.
	Add optional mp3 file to demonstrate how it sounds (max length 30 seconds) OR have a link to YouTube/Spotify to play the music.
	Able to view sales reports.

Website administrator
	Login – Master user
	Be able to run monthly or quarterly reports on sales and get statements available for the songwriters.
	Contracts – determine the percent of sale that the songwriter will get. Have this included in the sign-up process for the song-writer. Composers typically earn 50% royalties on digital sales.

Technology
Project written in Visual Studio Code
Project using React, Next.js, Prisma (for database configuration), Neon as the database, website deployed on Vercel.
Using GitHub for code changes/reviews/pushing to vercel
Use Neon Auth for Authentication and Authorization
Use tailwindcss for CSS

