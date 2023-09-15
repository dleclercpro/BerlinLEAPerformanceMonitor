# BerlinLEATerminBot

## Motivation
Booking an appointment with the Landesamt für Einwanderung (LEA) of Berlin is a very difficult endeavor. Even trying months in advance doesn't cut it: finding an appointment to, for instance, renew/extend a visa at LEA is literally impossible, since only a handful of appointment slots ever since to be available.

## Description
This Node application uses Selenium to automatically go through each of the required steps involved in the booking of an appointment at LEA on the latter's web portal.

## Performance
Not only are there almost never any free appointment slot on LEA's portal, the latter is also very buggy. In an effort to highlight the poor performance of said portal, the following graphs have been generated:

<p align="center" width="100%">
  <img alt="Length of User Sessions on LEA's Portal" src="./data/img/user-session-duration.png" width="100%" />
</p>