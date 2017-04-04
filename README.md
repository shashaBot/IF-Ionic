# IF-Ionic
A starter project for making glulx interactive fiction games playable in ionic mobile app.

This project is a derivative of the work done in the following repositories:
1. ChicagoDave/quixe-channels
2. blabno/quixe

This is a starter project in IonicV1 that uses the angular implementation of quixe and quixe-channels inform7 extension. I modified the inform 7 extention by David Cornelson and now call it: Quixe Channels Extended.

This implementation uses a control board with command buttons instead of a regular text field to input commands which deters many newbies from getting into Interactive fiction.

Control board and is fully customisable and reorganizable from within the story file and as the story progresses.

The fonts and text layout totally depends upon the developers' choice with no restrictions.

# Running the story
1. Make the story in inform7. Be sure to use the extension provided in www/inform-extensions.
2. Make the release file as .blorb.js. Use quixe as the interpreter.
3. Make JSON from your .blorb.js. (See the example json file in www/stories to know what it should look like).
4. Clone the repo and put the json story file inside the www/stories folder.
5. Replace the name of your story file in www/js/home.controller.js
6. Now, ionic serve or ionic run in command line.
7. Click Load Game and you have your story running in ionic app.!

# Notes:
1. Documentation for how to use the extensions is provided at the end of the extentions files.
2. As of now, the ionic app needs the story file in json format and you have to do that manually, I'll be correcting that soon.
3. If you don't have ionic CLI tools on your machine, you can just put the android-debug.apk file in your phone and run that to test the app.
