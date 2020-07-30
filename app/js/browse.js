function preflight_browse() {
    var input = document.getElementById("searchBox").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            search_music(document.getElementById("searchBox").value)
            document.getElementById("searchBox").value = ''
        }
    });
}

function searchsheet_on() {
    $('#searchsheet').removeClass('hidden')
}

function searchsheet_off() {

}

async function getDurations(videos) {
    videosresponse = videos
    videos = videos.result.items
    results = []
    for (let i = 0; i < videos.length; i++) {
        response = await gapi.client.youtube.videos.list({
            "part": [
              "snippet",
              "contentDetails",
              "statistics"
            ],
            "maxResults": 12,
            "id": [
                videos[i].id.videoId
            ]
          })
        results.push(response)
    }

    build_results(videosresponse, results)
}

function build_results(response, videoinfo) {
    $('#searchResults').empty()
    console.log(response);
    for (let i = 0; i < response.result.items.length; i++) {
        const element = response.result.items[i];
        a = document.createElement('div')
        a.classList.add('searchResultDiv')
        a.classList.add('card')
        a.id = element.id.videoId + 'boxel'
        // Playerel is second line
        playerel = `<nav class="navbar navv navbar-expand-lg navbar-dark">Date: ${videoinfo[i].result.items[0].contentDetails.duration}<ul class="navbar-nav mr-auto"></ul> btns</nav>`
        a.innerHTML = '<div class="card-body"><div class="imgcontainer"><img src="' + element.snippet.thumbnails.default.url + '" class="thumbnail"/></div><div class="cardcontent"><b class="cardtitle">' + element.snippet.title + '</b><br>' + playerel + '</div></div>'
        if (element.id.kind == "youtube#video") {
            document.getElementById('searchResults').appendChild(a)
            colortheifsearch(element.id.videoId)
        }
    }
}

function colortheifsearch(id) {

}

function search_music(term) {
    gapi.client.youtube.search.list({
        "part": [
          "snippet",
        ],
        "maxResults": 12,
        "q": term
      })
      .then(function(response) {
            getDurations(response)
      }, function(err) { 
          console.error("Execute error", err); 
      });
}