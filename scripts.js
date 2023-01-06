const APIURL = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username){
    try{
        if (window.localStorage.getItem(username)!=null) {
            console.log("check local storage for user")
            const data  =JSON.parse(window.localStorage.getItem(username))
            createUserCard(data)
            getRepos(username)
            
        } else {
            const { data } = await axios(APIURL + username)
            //console.log(data)
            createUserCard(data)
            getRepos(username)
            window.localStorage.setItem(username, JSON.stringify(data));
        }
    }catch (err){
        if(err.response.status == 404){
            createErrorCard('No profile with this Username')
        }
    }
}

async function getRepos(username){
    try{
        if (window.localStorage.getItem(username+' repo')!=null) {
            console.log("check local storage for user repositories")
            const data =JSON.parse(window.localStorage.getItem(username+' repo'))
            addReposToCard(data)
            
        } else {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        console.log(typeof(data))
        //console.log(data[0])
        addReposToCard(data)
        window.localStorage.setItem(username+' repo', JSON.stringify(data));
        }
    }catch (err){
        createErrorCard('Problem Fetching Repos')

    }
}

function createUserCard(user){
    const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>

                <div id="repos"></div>
            </div>
        </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg){
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `
    main.innerHTML = cardHTML
}

function addReposToCard(repos){
    const reposEl = document.getElementById('repos')

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_black'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user){
        getUser(user)

        search.value = ''
    }
})


