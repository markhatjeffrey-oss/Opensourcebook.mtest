function loadPosts(){
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  posts.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'card post';
    const liked = p.liked ? '❤️ Liked' : '👍 Like';
    let commentsHTML = '';
    (p.comments || []).forEach(c => {
      commentsHTML += `<div class="comment"><b>${c.user}:</b> ${c.text}</div>`;
    });

    el.innerHTML = `
      <div class="pad">
        <div class="header">
          <div class="avatar">U</div>
          <div>
            <div><b>${p.user}</b></div>
            <div class="small">${new Date(p.time).toLocaleString()}</div>
          </div>
        </div>
        <div class="content">${p.text || ''}</div>
        ${p.img ? `<img src="${p.img}">` : ``}
        <div class="actions">
          <button onclick="likePost(${idx})">${liked}</button>
          <button onclick="toggleComments(${idx})">💬 Comment</button>
        </div>
        <div class="comments" id="cwrap-${idx}" style="display:none">
          <div id="clist-${idx}">${commentsHTML}</div>
          <div class="comment-input">
            <input id="cinput-${idx}" placeholder="Write a comment...">
            <button class="btn" onclick="addComment(${idx})">Post</button>
          </div>
        </div>
      </div>
    `;
    feed.appendChild(el);
  });
}

function savePosts(posts){
  localStorage.setItem('posts', JSON.stringify(posts));
}

function addPost(){
  const input = document.getElementById('postInput');
  const file = document.getElementById('imgInput').files[0];
  const text = input.value.trim();
  if(!text && !file) return;

  const reader = new FileReader();
  reader.onload = function(){
    const imgData = file ? reader.result : '';
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.unshift({
      user: localStorage.getItem('username') || 'You',
      text: text,
      img: imgData,
      liked: false,
      comments: [],
      time: Date.now()
    });
    savePosts(posts);
    input.value = '';
    document.getElementById('imgInput').value = '';
    loadPosts();
  }
  if(file){
    reader.readAsDataURL(file);
  }else{
    reader.onload();
  }
}

function likePost(i){
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts[i].liked = !posts[i].liked;
  savePosts(posts);
  loadPosts();
}

function toggleComments(i){
  const el = document.getElementById(`cwrap-${i}`);
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function addComment(i){
  const inp = document.getElementById(`cinput-${i}`);
  const text = inp.value.trim();
  if(!text) return;
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  posts[i].comments.push({
    user: localStorage.getItem('username') || 'You',
    text
  });
  savePosts(posts);
  loadPosts();
  document.getElementById(`cwrap-${i}`).style.display = 'block';
}

window.onload = function(){
  if(document.body.getAttribute('data-auth') === 'required'){
    requireAuth();
  }
  if(document.getElementById('feed')){
    loadPosts();
  }
}