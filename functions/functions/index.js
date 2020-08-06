const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
storage = admin.storage()
db = admin.firestore()
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { firestore } = require('firebase-admin');
const { ResultStorage } = require('firebase-functions/lib/providers/testLab');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
}

exports.playSong = functions.runWith(runtimeOpts).https.onCall(async (data, context) => {
  const song = data.song;
  var YD = new YoutubeMp3Downloader({ "outputPath": "out", "youtubeVideoQuality": "highestaudio", "queueParallelism": 2, "progressTimeout": 2000 });

  return new Promise((resolve, reject) => {
  
    YD.download(song);

    YD.on("error", function(error) {

      console.log(error);

    });

    YD.on("progress", function(progress) {

      console.log(JSON.stringify(progress));
      
    });

    YD.on("finished", function(err, data) {

    title = data.file.replace('out/', '')

      storage.bucket('swizzle-music.appspot.com').upload(data.file, {
        destination: `music/${data.file}`
      }).then(() => {

        admin.firestore().collection('music').doc('downloaded').update({
          list: admin.firestore.FieldValue.arrayUnion(title),

        }).then(function() {

          filethingy = data.file.replace('out', 'o')
          publicUrl = `https://firebasestorage.googleapis.com/v0/b/swizzle-music.appspot.com/o/music%2Fout%2F${title}?alt=media`

          resolve(publicUrl);          
        }) 
      })
    });

  })
});