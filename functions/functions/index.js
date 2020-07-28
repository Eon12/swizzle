const functions = require('firebase-functions');
const admin = require('firebase-admin');;
admin.initializeApp();
storage = admin.storage()
const cors = require('cors')({ origin: true, });
const YoutubeMp3Downloader = require("youtube-mp3-downloader");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

exports.downloadSong = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  var YD = new YoutubeMp3Downloader({
    "outputPath": "out",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 2000                 // Interval in ms for the progress reports (default: 1000)
    });
    
    YD.download("Vhd6Kc4TZls");
    var storage = admin.storage();

    YD.on("finished", function(err, data) {
        storage.bucket('swizzle-music.appspot.com/').upload('hi.txt')
        .then(() => {
          console.log("success");
          cors(req, res, () => {res.send({ data: 'hi' })})    
        })
    });

});
