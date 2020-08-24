async function createPlaylist() {
    val = $('#newplaylistbox').val()

    if (val == '' || val == ' ' || val == undefined || val == null) {
        Snackbar.show({text: "Error creating playlist."})
        return;
    }

    $('#newplaylistbox').get(0).value = ''

    doc = await db.collection('users').doc(user.uid).collection('playlists').add({
        name: val,
        description: `${usercache.name}'s New Playlist`,
        authors: [user.uid],
        owner: user.uid,
        icon: 'https://atlas-content-cdn.pixelsquid.com/stock-images/toilet-paper-7GYYMX5-600.jpg',
    })

    doc = await doc.get()

    await db.collection('users').doc(user.uid).update({
        playlists: firebase.firestore.FieldValue.arrayUnion({
            name: val,
            doc: doc.id
        })
    })
}

async function loadPlaylists() {
    sessionStorage.setItem('waitingPlaylist', 'false')
    if (firebase.auth().currentUser == null) {
        sessionStorage.setItem('waitingPlaylist', 'true')
        return;
    }

    doc = await db.collection('users').doc(user.uid).get()
    window.usercache = doc.data()
    playlists = doc.data().playlists

    for (let i = 0; i < playlists.length; i++) {
        const playlist = playlists[i];

        doc = await db.collection('users').doc(user.uid).collection('playlists').doc(playlist.doc).get()

        a = document.createElement('div')
        a.classList.add('playlist')
        a.innerHTML = `<center><img class="shadow waves-image" src="${doc.data().icon}"></img><h4 class="playlist_text">${doc.data().name}</h4></center>`
        $('#playlists').get(0).appendChild(a)
        
    }
    Waves.attach('.waves-image');
}