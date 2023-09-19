# BerlinLEATerminBot

## Motivation
Booking an appointment with the Landesamt für Einwanderung (LEA) of Berlin is a very difficult endeavor. Even trying months in advance doesn't cut it: finding an appointment to, for instance, renew/extend a visa at LEA is literally impossible, since usually only a handful of appointment slots are freed each day, if any at all. Here is a (non-exhaustive) list of things I have personally tried in order to get an appointment with LEA, all of which were unsuccessful:

- Send an e-mail to the appropriate Referat of LEA
- Send a fax to the appropriate Referat of LEA
- Call the Bürgerservice of Berlin
- Send an e-mail to my Bezirksamt
- Send an e-mail to the Bürgermeister of Berlin

## Description
This Node application uses Selenium to automatically go through each of the required steps involved in the booking of an appointment at LEA on the latter's web portal.

## Performance
Not only are there almost never any free appointment slots on LEA's portal, the latter is also quite buggy. In an effort to highlight the poor performance of said portal, the following graphs have been generated:

### Length of User Session
Time spent on LEA's website by user before being met with the error message 'there are no available appointments' at the moment.

<p align="center" width="100%">
  <img alt="Length of User Sessions on LEA's Portal" src="./data/img/user-session-duration.png" width="100%" />
</p>

### Average Length of User Session
Average time spent on LEA's website by user before being met with the error message 'there are no available appointments' at the moment. Said average is computed using time buckets.

<p align="center" width="100%">
  <img alt="Average Length of User Sessions on LEA's Portal" src="./data/img/user-session-duration-by-bucket.png" width="100%" />
</p>

### Experienced Errors
Errors the user experiences on LEA's website which prevent them to access the appointment
assignment feature altogether. This graph shows the prevalence (in percentage) of each
error, using time buckets.

- ``InfiniteSpinnerError`` A loading spinner was shown for more than 2 minutes (after this time, I would assume any user to have left the portal)
- ``ElementMissingFromPageError`` A web element (e.g. button, checkbox) was expected on the bot's path, but wasn't detected (i.e. either a UI bug, or it never loaded)
- ``BackToFindAppointmentPageError`` After submitting their request for an appointment, a loading spinner appears, yet nothing happens: said user is redirected to the previous form page
- ``UIError`` The expected page structure was broken (e.g. hundreds, if not thousands, of duplicated buttons')
- ``InternalServerError`` The LEA servers are responding with the standard HTTP status code 500, which indicates that the server encountered an unexpected condition that prevented it from fulfilling the request (see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500).

<p align="center" width="100%">
  <img alt="Average Length of User Sessions on LEA's Portal" src="./data/img/workdays-errors-by-bucket.png" width="100%" />
</p>