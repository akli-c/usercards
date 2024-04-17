let currentGenderFilter = 'all'; 

function fetchUsers(gender = 'all', append = false) {
  const url = `https://randomuser.me/api/?results=10&gender=${gender}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
        // check if i need to add the users or replace the old ones 
      if (!append) {
        displayUsers(data.results);
      } else {
        addUsers(data.results);
      }
    })
    // error logging 
    .catch(error => {
      console.error('Error fetching data:', error);
      const usersContainer = document.getElementById('users-container');
      usersContainer.innerHTML = '<p class="text-danger">Failed to load user data. Please try again later.</p>';
    });
}

//display users card with erasing old ones
function displayUsers(users) {
  const usersContainer = document.getElementById('users-container');
  usersContainer.innerHTML = '';
  addUsers(users);
}

// add new users 
function addUsers(users) {
    //select field to add users card
    const usersContainer = document.getElementById('users-container');
    users.forEach(user => {
        // display an icon based on gender
      const iconClass = user.gender === 'male' ? 'fa-person' : 'fa-person-dress';
      const userDiv = document.createElement('div');
      userDiv.className = 'user-card';
      //give the html foreach user card
      userDiv.innerHTML = `
      <div class="card shadow clickable w-100 h-100 align-items-center">
      <img src="https://flagcdn.com/${user.nat.toLowerCase()}.svg" width="30" class="my-2 text-center img-fluid" alt="Flag">
        <img src="${user.picture.large}" class="img-thumbnail card-img-top p-3 mx-auto rounded-circle w-75" alt="Profile picture of ${user.name.first} ${user.name.last}">
        <div class="card-body text-center">
          <h5 class="card-title"><i class="fa-solid ${iconClass}"></i> ${user.name.title} ${user.name.first} ${user.name.last}</h5>
          <p class="card-text"><i class="fa-solid fa-envelope"></i> Email: ${user.email}</p>
          <div class="more-info" style="display: none;">
          </div>
          <button class="btn btn-danger" onclick="deleteUser(this)"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
      `;
      
      // open modal if user card clicked except delete button
      userDiv.querySelector('.clickable').addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-danger')) {
          return; 
        }
        // modal html
        const cardDetails = `
        <img src="${user.picture.large}" class="modal-img img-thumbnail rounded-circle" alt="Profile picture of ${user.name.first} ${user.name.last}">
        <h5 class="modal-title pb-5">${user.name.title} ${user.name.first} ${user.name.last}</h5>
        <img src="https://flagcdn.com/${user.nat.toLowerCase()}.svg" width="30" class="my-3 text-center img-fluid" alt="Flag">
        <p class="modal-text"><i class="fa-solid fa-envelope"></i> Email : ${user.email}</p>
        <p class="modal-text"><i class="fa-solid fa-map-pin"></i> Location : ${user.location.city}, ${user.location.state}</p>
        <div class="more-info">
            <p class="modal-text"><i class="fa-solid fa-phone"></i> Phone : ${user.phone}</p>
            <p class="modal-text"><i class="fa-solid fa-cake-candles"></i> Birthdate : ${new Date(user.dob.date).toLocaleDateString()}</p>
        </div>
        <button onclick="closeModal()" class="btn btn-secondary">Close</button>
        `;
  
        // display user info in modal
        document.getElementById('modal-content').innerHTML = cardDetails;
  
        // show modal
        document.getElementById('modal-container').classList.add('show');

      });

      // finally add the user div to the container
      usersContainer.appendChild(userDiv);
    });
  }

//onload fetch and display
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers(); 
})

//add 10 users with the selected gender (default : all)
document.getElementById('add-users-btn').addEventListener('click', () => {
  fetchUsers(currentGenderFilter, true);
});

//dark-light mode switch
document.getElementById('theme-switch').addEventListener('change', function(event) {
  document.body.classList.toggle('dark-mode', event.target.checked);
});

//select gender and fetch user with selected gender 
document.getElementById('gender-filter').addEventListener('change', function() {
  currentGenderFilter = this.value;
  fetchUsers(currentGenderFilter, false);
});

// close modal for infos
function closeModal() {
    document.getElementById('modal-container').classList.remove('show');
}

// close modal if click outside 
document.getElementById('modal-container').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModal();
    }
});

//delete user card 
function deleteUser(button) {
  button.parentElement.parentElement.parentElement.remove();
}
