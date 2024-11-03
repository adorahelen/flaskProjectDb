// Fetch user data and display it
async function fetchUsers() {
    const response = await fetch('/users');
    const users = await response.json();

    const userList = document.getElementById('user-list');
    userList.innerHTML = '';  // Clear any existing content

    users.forEach(user => {
        // Create a card for each user
        const userCard = document.createElement('div');
        userCard.className = 'user-card';

        // Profile Image
        const img = document.createElement('img');
        img.src = user.profile_image || 'default-profile.png';  // Default if no image
        userCard.appendChild(img);

        // User Info
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';

        const name = document.createElement('h2');
        name.textContent = user.nickname || 'Unknown User';
        userInfo.appendChild(name);

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email}`;
        userInfo.appendChild(email);

        const role = document.createElement('p');
        role.textContent = `Role: ${user.role}`;
        userInfo.appendChild(role);

        if (user.profile_url) {
            const profileLink = document.createElement('a');
            profileLink.href = user.profile_url;
            profileLink.textContent = 'Profile Link';
            profileLink.target = '_blank';
            userInfo.appendChild(profileLink);
        }

        userCard.appendChild(userInfo);
        userList.appendChild(userCard);
    });
}

// Load user data when the page loads
document.addEventListener('DOMContentLoaded', fetchUsers);