const functions = require('firebase-functions');
const admin = require('firebase-admin');;
admin.initializeApp();
storage = admin.storage()
const cors = require('cors')({ origin: true, });
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { firestore } = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

exports.playSong = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  
    if (req.query.url == undefined) {
      cors(req, res, () => {res.send({ data: 'No URL' })})    
      return;
    }
    var YD = new YoutubeMp3Downloader({
      "outputPath": "out",    // Output file location (default: the home directory)
      "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
      "queueParallelism": 2,                  // Download parallelism (default: 1)
      "progressTimeout": 2000                 // Interval in ms for the progress reports (default: 1000)
      });

    YD.download(req.query.url);
    var storage = admin.storage();

    YD.on("finished", function(err, data) {
      console.log(`thing: ${data.file}`);
      title = data.file.replace('out/', '')
        storage.bucket('swizzle-music.appspot.com').upload(data.file, {
          destination: `music/${data.file}`
        }).then(() => {
          admin.firestore().collection('music').doc('downloaded').update({
            list: admin.firestore.FieldValue.arrayUnion(title),
          }).then(function() {
            // https://firebasestorage.googleapis.com/v0/b/swizzle-music.appspot.com/o/music%2Fout%2FVirgin%20Galactic%20PARODY.mp3?alt=media
            filethingy = data.file.replace('out', 'o')
            publicUrl = `https://firebasestorage.googleapis.com/v0/b/swizzle-music.appspot.com/o/music%2Fout%2F${title}?alt=media`
            cors(req, res, () => {res.send({ data: publicUrl })})   
          }) 
        })
    });
})

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
